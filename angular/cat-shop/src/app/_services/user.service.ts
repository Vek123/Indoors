import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, take} from 'rxjs';
import {ApiResponseHandlers, User} from '../models';
import {ApiClientService} from './api-client.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  user$: Observable<User | undefined> = this.user.asObservable();

  constructor(
    private apiClientService: ApiClientService,
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  login(username: string, password: string, responseHandlers: ApiResponseHandlers) {
    this.httpClient.post(
      this.apiClientService.http_api_url + '/auth/token/login/',
      {username: username, password: password},
      {withCredentials: true},
    ).pipe(catchError((error: any, _: Observable<Object>): Observable<any> => {
      console.error(error.error);
      responseHandlers.onErrorCallback?.(error);
      return of();
    }))
      .subscribe(response => {
        this.user.pipe(take(1)).subscribe(() => {
          this.user.next(response as User);
        });
        localStorage.setItem("user", JSON.stringify(response as User));
        this.user.next(response as User);
        responseHandlers.onSuccessCallback?.(response);
      })
  }
  logout(responseHandlers: ApiResponseHandlers) {
    this.httpClient.post(
      this.apiClientService.http_api_url + '/auth/token/logout/',
      {},
      {withCredentials: true},
    ).pipe(catchError((error: any, _: Observable<object>): Observable<any> => {
      console.error(error.error);
      responseHandlers.onErrorCallback?.(error);
      return of();
    }))
      .subscribe(response => {
        this.router.navigate(["/"]);
        responseHandlers.onSuccessCallback?.(response);
      })
    this.local_logout()
  }
  local_logout() {
    localStorage.removeItem("user");
    this.user.next(undefined);
  }
  register(username: string, first_name: string, password: string, re_password: string, responseHandlers: ApiResponseHandlers) {
    this.httpClient.post(
      this.apiClientService.http_api_url + "/auth/users/",
      {
        username: username,
        first_name: first_name,
        password: password,
        re_password: re_password,
      }
    ).pipe(catchError((error: any, _): Observable<any> => {
      console.error(error);
      responseHandlers.onErrorCallback?.(error);
      return of();
    }))
      .subscribe(response => {
        responseHandlers.onSuccessCallback?.(response);
      })
  }
  getUsers(first_name: string, responseHandlers: ApiResponseHandlers) {
    this.httpClient.get(
      this.apiClientService.http_api_url + "/users/?first_name__icontains=" + first_name,
      {withCredentials: true},
    )
      .pipe(catchError((error: any, _): Observable<any> => {
        console.error(error)
        responseHandlers.onErrorCallback?.(error);
        return of();
      }))
      .subscribe((response) => {
        responseHandlers.onSuccessCallback?.(response);
      })
  }
}

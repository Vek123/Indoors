import { Injectable } from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiResponseHandlers} from '../models';


@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  http_api_url: string = "http://127.0.0.1/api/v1";
  constructor(private httpClient: HttpClient) { }
  checkAuth(responseHandlers: ApiResponseHandlers) {
    this.httpClient.get(this.http_api_url + "/auth/check/", {withCredentials: true})
      .pipe(catchError((error: any, _): Observable<any> => {
        console.error(error);
        responseHandlers.onErrorCallback?.(error);
        return of()
      }))
      .subscribe((response) => {
        responseHandlers.onSuccessCallback?.(response);
      })
  }
}

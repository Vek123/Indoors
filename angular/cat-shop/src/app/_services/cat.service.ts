import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';
import {Cat} from '../models';
import {HttpClient} from '@angular/common/http';
import {ApiClientService} from './api-client.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CatService {
  cats: BehaviorSubject<Cat[]> = new BehaviorSubject<Cat[]>([])
  cats$: Observable<Cat[]> = this.cats.asObservable();
  api_url: string;
  constructor(
    private httpClient: HttpClient,
    private apiClientService: ApiClientService,
  ) {
    this.api_url = this.apiClientService.http_api_url + "/cats/";
  }
  getCats() {
    this.httpClient.get(
      this.api_url,
      {withCredentials: true},
    ).pipe(catchError((error: any, _): Observable<any> => {
      console.error(error);
      return of();
    }))
      .subscribe((response) => {
        this.cats.next(response as Cat[]);
      })
  }
  addCat(cat: Cat) {
    this.httpClient.post(
      this.api_url,
      {
        name: cat.name, age: cat.age, skin: cat.skin, breed: cat.breed,
        breeder: JSON.parse(localStorage.getItem("user") || "{'id':-1}").id
      },
      {withCredentials: true},
    ).pipe(catchError((error: any, _): Observable<any> => {
      console.error(error);
      return of();
    }))
      .subscribe((response) => {
        this.cats.next([...this.cats.value, response as Cat])
      })
  }
  deleteCat(cat: Cat) {
    this.httpClient.delete(
      this.api_url + cat.id + "/",
      {withCredentials: true},
    ).pipe(catchError((error: any, _): Observable<any> => {
      console.error(error);
      return of();
    }))
      .subscribe(_ => {
        this.cats.next(this.cats.value.filter((value: Cat) => value.id !== cat.id));
      })
  }
  changeCat(cat: Cat) {
    this.httpClient.patch(
      this.api_url + cat.id + "/",
      {
        id: cat.id, name: cat.name, age: cat.age, skin: cat.skin, breed: cat.breed,
        breeder: JSON.parse(localStorage.getItem("user") || "{'id':-1}").id
      },
      {withCredentials: true}
    ).pipe(catchError((error: any, _): Observable<any> => {
      console.error(error);
      return of();
    }))
      .subscribe((response) => {
        response["id"] = cat.id;
        let new_cats = this.cats.getValue();
        new_cats[new_cats.findIndex((value) => value.id === cat.id)] = response as Cat;
        this.cats.next(new_cats);
      })
  }
  clearCats() {
    this.cats.next([]);
  }
  getCatForm(values: Cat | null) {
    return new FormGroup({
      name: new FormControl(values?.name || "", [Validators.required]),
      age: new FormControl(values?.age || "", [Validators.required, Validators.pattern('[0-9]*')]),
      breed: new FormControl(values?.breed || "", [Validators.required]),
      skin: new FormControl(values?.skin || "", [Validators.required]),
    })
  }
}

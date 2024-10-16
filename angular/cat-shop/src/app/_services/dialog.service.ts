import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';
import {ApiResponseHandlers, Dialog, User} from '../models';
import {ApiClientService} from './api-client.service';
import {log} from 'node:util';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  dialogs: BehaviorSubject<Dialog[]> = new BehaviorSubject<Dialog[]>([]);
  dialogs$: Observable<Dialog[]> = this.dialogs.asObservable();
  constructor(private httpClient: HttpClient, private apiClient: ApiClientService) {}
  fetchDialogs(responseHandlers: ApiResponseHandlers) {
    this.httpClient.get(
      this.apiClient.http_api_url + "/dialogs/",
      {withCredentials: true},
    ).pipe(catchError((error: any, _): Observable<any> => {
      console.error(error);
      responseHandlers.onErrorCallback?.(error);
      return of();
    }))
      .subscribe((response) => {
        this.dialogs.next(response as Dialog[]);
        responseHandlers.onSuccessCallback?.(response);
      })
  }
  checkDialogExists(members_ids: number[]): Dialog[] {
    return this.dialogs.value.filter(value => {
      let members = value.members.filter(value1 => members_ids.includes(value1.id));
      if (value.members.length !== members.length) {
        return false;
      }
      let curr_dialog_member_set = new Set(value.members);
      let equals = true;
      for (let member of members) {
        if (!curr_dialog_member_set.has(member)) {
          equals = false;
          break;
        }
      }
      return equals;
    })
  }
  addDialog(dialog: Dialog) {
    this.dialogs.next([...this.dialogs.value, dialog]);
  }
  createDialog(dialog: Dialog, responseHandlers: ApiResponseHandlers) {
    this.httpClient.post(
      this.apiClient.http_api_url+"/dialogs/",
      {members: dialog.members.map((value: User) => {return value.id})},
      {withCredentials: true}
    ).pipe(catchError((error: any, _): Observable<any> => {
      console.error(error);
      responseHandlers.onErrorCallback?.(error);
      return of();
    }))
      .subscribe((response) => {
        this.fetchDialogs({});
        responseHandlers.onSuccessCallback?.(response);
      })
  }
  selectDialog(id: any) {
    (document.querySelector(`.dialog__input[id='${id}']`) as HTMLInputElement)?.dispatchEvent(new Event("change"));
  }
  scrollDownDialog() {
    let messageBody = document.querySelector('.messenger__messages');
    if (messageBody) {
      messageBody.scrollTop = messageBody.scrollHeight;
    }
  }
}

import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, Subject} from 'rxjs';
import {WebsocketChatService} from './websocket-chat.service';
import {HttpClient} from '@angular/common/http';
import {ApiClientService} from './api-client.service';
import {ApiResponseHandlers, Message} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  wsChatConnection: Subject<any>;
  messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  messages$: Observable<Message[]> = this.messages.asObservable();
  constructor(
    private wsChatService: WebsocketChatService,
    private httpClient: HttpClient,
    private apiClient: ApiClientService,
  ) {}
  wsConnect(dialog_id: number) {
    this.wsChatConnection = this.wsChatService.makeConnection("/chat/"+dialog_id+"/");
    return this.wsChatConnection;
  }
  wsDisconnect() {
    if (this.wsChatConnection) {
      this.wsChatConnection.complete();
    }
  }
  fetchMessages(dialog_id: number, responseHandlers: ApiResponseHandlers) {
    this.httpClient.get(
      this.apiClient.http_api_url+"/dialogs/"+dialog_id+"/messages/",
      {withCredentials: true},
    ).pipe(catchError((error: any, _): Observable<any> => {
      responseHandlers.onErrorCallback?.(error);
      return of();
    }))
      .subscribe((response) => {
        this.messages.next(response as Message[]);
        responseHandlers.onSuccessCallback?.(response);
      })
  }
}

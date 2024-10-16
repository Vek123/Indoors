import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {webSocket} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketChatService {
  ws_api_url: string = "ws://127.0.0.1/ws"
  constructor() {
  }
  makeConnection(url: string) {
    return webSocket(this.ws_api_url + url);
  }
}

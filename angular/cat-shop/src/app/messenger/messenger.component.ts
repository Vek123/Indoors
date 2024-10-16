import {Component, inject, OnDestroy, OnInit, AfterViewChecked} from '@angular/core';
import {Dialog, NavItem} from '../models';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {MessageService} from '../_services/message.service';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {AddChatDialogComponent} from './add-chat-dialog/add-chat-dialog.component';
import {DialogService} from '../_services/dialog.service';
import {Observable} from 'rxjs';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {DialogComponent} from '../dialog/dialog.component';

import {Message} from '../models';
import {UserService} from '../_services/user.service';
import {ApiClientService} from '../_services/api-client.service';


@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [
    HeaderComponent,
    MatButton,
    AsyncPipe,
    DialogComponent,
    NgOptimizedImage,
    NgIf,
  ],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss'
})
export class MessengerComponent implements OnInit, OnDestroy, AfterViewChecked {
  nav_menu: {menu: NavItem[], active_id: number};
  dialogs$: Observable<Dialog[]>;
  messages$: Observable<Message[]>;
  current_dialog_id: number | string;
  written_message: string = "";
  messages_len: number;
  wrapperOnChangeDialog = this.onChangeDialog.bind(this);
  readonly dialog = inject(MatDialog)
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private apiClient: ApiClientService,
    protected userService: UserService,
  ) {}
  ngOnInit() {
    if (typeof localStorage !== "undefined") {
      this.dialogService.fetchDialogs({});
      this.apiClient.checkAuth({
        onErrorCallback: _ => {
          this.userService.local_logout();
          this.messageService.messages.next([]);
          this.dialogService.dialogs.next([]);
          this.router.navigate(["/login"]);
        },
      });
    }
    this.route.data.subscribe(data => {
      this.nav_menu = {menu:[...data["nav_menu"]], active_id:data["active_id"]};
    });
    this.messages$ = this.messageService.messages$;
    this.dialogs$ = this.dialogService.dialogs$;
    this.messages_len = this.messageService.messages.value.length;
  }
  ngAfterViewChecked() {
    if (typeof localStorage !== "undefined") {
      this.dialogService.scrollDownDialog();
    }
  }
  ngOnDestroy() {
    if (typeof localStorage !== "undefined") {
      this.messageService.wsDisconnect();
      this.messageService.messages.next([]);
    }
  }
  onAddDialog() {
    this.dialog.open(AddChatDialogComponent);
  }
  onChangeDialog(dialog_id: any) {
    this.current_dialog_id = dialog_id;
    if (typeof dialog_id === "number") {
      this.messageService.fetchMessages(dialog_id, {
        onSuccessCallback: (_: any) => {
          this.messageService.wsDisconnect();
          this.messageService.wsConnect(dialog_id).subscribe((response) => {
            this.messageService.messages.next([...this.messageService.messages.value, response as Message])
          })
        }
      })
    }
  }
  onInputMessage(event: any) {
    this.written_message = event.target.value;
  }
  onSubmitMessage(event: any) {
    event.preventDefault();
    event.target.reset();
    const currentDialog = this.dialogService.dialogs.value.find((value: Dialog) => {return value.id === this.current_dialog_id});
    if (typeof currentDialog?.id === "string") {
      this.dialogService.createDialog(currentDialog as Dialog, {
        onSuccessCallback: response => {
          this.messageService.wsConnect(response.id);
          this.messageService.wsChatConnection.next({
            "body": this.written_message,
          });
          this.messageService.wsChatConnection.subscribe(response => {
            this.messageService.messages.next([...this.messageService.messages.value, response as Message])
          });
          this.dialogService.selectDialog(this.current_dialog_id);
          this.current_dialog_id = response.id;
          this.dialogService.selectDialog(this.current_dialog_id);
        }
      });
    } else {
      this.messageService.wsChatConnection.next({
        "body": this.written_message,
      });
    }
    this.written_message = "";
  }
}

import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../_services/message.service';
import {Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {UserService} from '../../_services/user.service';
import {User} from '../../models';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatDialogClose} from '@angular/material/dialog';
import {DialogService} from '../../_services/dialog.service';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-add-chat-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './add-chat-dialog.component.html',
  styleUrl: './add-chat-dialog.component.scss'
})
export class AddChatDialogComponent implements OnInit {
  dialogForm: FormGroup<any>;
  receivers: User[] = [];
  selectedReceiver: User | null = null;

  constructor(
    private messenger: MessageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit() {
    this.dialogForm = this.formBuilder.group({
      receiver: new FormControl("", [Validators.required]),
    });
    this.dialogForm.controls["receiver"].valueChanges.subscribe((value) => {
      this.userService.getUsers(value, {
        onSuccessCallback: response => {
          this.receivers = response["results"] as User[];
        }
      });
    });
  }

  selectReceiver(user: User) {
    this.selectedReceiver = user;
    this.dialogForm.controls["receiver"].setValue(user.first_name);
  }

  onSubmit() {
    const existsDialog = this.dialogService.checkDialogExists(
      [this.selectedReceiver?.id as number, this.userService.user.value?.id as number]
    );
    if (existsDialog.length === 1) {
      this.dialogService.selectDialog(existsDialog[0].id);
    } else if (existsDialog.length === 0) {
      let dialog_id = uuidv4() + "-new";
      this.dialogService.addDialog({id: dialog_id, members: [this.userService.user.value as User, this.selectedReceiver as User]});
    }
  }
}

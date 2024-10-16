import {Component, Input, OnInit} from '@angular/core';
import {Dialog} from '../models';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() dialog: Dialog;
  @Input() onChangeDialog: any;
  constructor() {}
}

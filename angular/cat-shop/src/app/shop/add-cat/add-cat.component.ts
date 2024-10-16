import {Component, inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Cat} from '../../models';
import {CatService} from '../../_services/cat.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from '@angular/material/dialog';


interface dialogData {
  title: string,
  cat: Cat | null,
  submit_text: string,
}

@Component({
  selector: 'app-add-cat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatFabButton,
    MatLabel,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './add-cat.component.html',
  styleUrl: './add-cat.component.scss'
})
export class AddCatComponent implements OnInit {
  catForm: FormGroup<any>;
  readonly formRef = inject(MatDialogRef<AddCatComponent>)
  readonly dialogData = inject<dialogData>(MAT_DIALOG_DATA);
  constructor(private catService: CatService) {
  }
  ngOnInit() {
    this.catForm = this.catService.getCatForm(this.dialogData.cat);
  }
  onSubmit() {
    if (this.dialogData.cat) {
       let data = this.catForm.value as Cat;
       data["id"] = this.dialogData.cat.id;
       this.catService.changeCat(data);
    } else {
      const data = this.catForm.value as Cat;
      this.catService.addCat(data);
    }
  }
  closeCatForm() {
    this.formRef.close();
  }
}

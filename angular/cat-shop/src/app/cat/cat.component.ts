import {Component, inject, Input} from '@angular/core';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader} from '@angular/material/card';
import { Cat } from '../models';
import {CatService} from '../_services/cat.service';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {AddCatComponent} from '../shop/add-cat/add-cat.component';

@Component({
  selector: 'app-cat',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatButton,
    MatCardFooter,
  ],
  templateUrl: './cat.component.html',
  styleUrl: './cat.component.scss'
})
export class CatComponent {
  @Input() cat: Cat;
  readonly dialog = inject(MatDialog)
  constructor(private catService: CatService) {
  }
  onDelete(cat: Cat) {
    if (confirm("Вы действительно хотите удалить кота?")) {
      this.catService.deleteCat(cat);
    }
  }
  onChange(cat: Cat) {
    const catFormRef = this.dialog.open(AddCatComponent, {
      data: {title: "Изменить кота", cat: cat, submit_text: "Изменить"},
    });
  }
  getAgeSuffix(age: number) {
    const end = age % 10;
    let suffix = "";
    switch (end) {
      case 1:
        suffix = "год";
        break;
      case 2:
      case 3:
      case 4:
        suffix = "года";
        break;
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 0:
        suffix = "лет";
        break;
    }
    return suffix;
  }
}

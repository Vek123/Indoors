import {Component, inject, OnInit} from '@angular/core';
import { CatComponent } from '../cat/cat.component';
import {Cat, NavItem} from '../models';
import {Observable} from 'rxjs';
import {CatService} from '../_services/cat.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {HeaderComponent} from '../header/header.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AddCatComponent} from './add-cat/add-cat.component';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../_services/user.service';
import {ApiClientService} from '../_services/api-client.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CatComponent,
    AsyncPipe,
    HeaderComponent,
    AddCatComponent,
    MatButton,
    NgIf,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  cats$: Observable<Cat[]>;
  nav_menu: {menu: NavItem[], active_id: number};
  readonly dialog = inject(MatDialog)
  constructor(private catService: CatService,
              private router: Router,
              private route: ActivatedRoute,
              private apiClient: ApiClientService,
              protected userService: UserService) {}
  ngOnInit() {
    if (typeof localStorage !== "undefined") {
      this.apiClient.checkAuth({
        onErrorCallback: error => {
          if (error.status === 401) {
            this.catService.clearCats();
            this.userService.local_logout();
            this.router.navigate(["/login"]);
          }
        },
        onSuccessCallback: response => {
          this.catService.getCats();
          this.cats$ = this.catService.cats;
        }
      })
    }
    this.route.data.subscribe(data => {
      this.nav_menu = {menu:[...data["nav_menu"]], active_id:data["active_id"]};
    });
  }
  openAddCatForm() {
    const catFormRef = this.dialog.open(AddCatComponent, {
      data: {title: "Добавить кота", cat: null, submit_text: "Добавить"},
    })
  }
}

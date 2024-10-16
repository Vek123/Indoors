import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ShopComponent} from './shop/shop.component';
import {HeaderComponent} from './header/header.component';
import {UserService} from './_services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShopComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'cat-shop';
  constructor(private userService: UserService) {
  }
  ngOnInit() {
    if (typeof localStorage !== "undefined") {
      const local_user: string | null = localStorage.getItem("user");
      if (local_user) {
        this.userService.user.next(JSON.parse(local_user));
      }
    }
  }
}

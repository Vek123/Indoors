import {Component, OnInit} from '@angular/core';
import {NavItem} from '../models';
import {ActivatedRoute} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {UserService} from '../_services/user.service';
import {CatService} from '../_services/cat.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  nav_menu: {menu: NavItem[], active_id: number};
  constructor(private route: ActivatedRoute, private userService: UserService, private catService: CatService) {
  }
  ngOnInit() {
    if (typeof localStorage !== "undefined") {
      this.route.data.subscribe(data => {
        this.nav_menu = {menu:[...data["nav_menu"]], active_id:-1};
      });
      this.userService.logout(
        {
          onSuccessCallback: _ => {
            this.catService.cats.next([]);
          }
        }
      );
    }
  }
}

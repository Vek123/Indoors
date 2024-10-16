import {Component, Input, OnInit} from '@angular/core';
import {NavItem, User} from '../models';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf} from '@angular/common';
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() menu: {menu: NavItem[], active_id: number};
  user: User | undefined;
  constructor(private userService: UserService) {
  }
  ngOnInit() {
    this.userService.user.subscribe(value => {
      this.user = value;
    })
  }
}

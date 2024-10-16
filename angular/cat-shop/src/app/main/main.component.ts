import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {NavItem} from '../models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
    imports: [
        HeaderComponent
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  nav: {menu: NavItem[], active_id: number};
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.nav = {menu:[...data["nav_menu"]], active_id:data["active_id"]};
    });
  }
}

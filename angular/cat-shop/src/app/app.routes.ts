import { Routes } from '@angular/router';
import {ShopComponent} from './shop/shop.component';
import {MessengerComponent} from './messenger/messenger.component';
import {NavItem} from './models';
import {MainComponent} from './main/main.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {RegisterComponent} from './register/register.component';

export const nav_menu: NavItem[] = [{name: "Главная", link: ""}, {name: "Магазин", link: "/shop"}, {name: "Мессенджер", link: "/messenger"}]

export const routes: Routes = [
  {path: "shop", component: ShopComponent, data: {nav_menu: [...nav_menu], active_id: 1}},
  {path: "messenger", component: MessengerComponent, data: {nav_menu: [...nav_menu], active_id: 2}},
  {path: "login", component: LoginComponent, data: {nav_menu: [...nav_menu]}},
  {path: "logout", component: LogoutComponent, data: {nav_menu: [...nav_menu]}},
  {path: "register", component: RegisterComponent, data: {nav_menu: [...nav_menu]}},
  {path: "**", component: MainComponent, data: {nav_menu: [...nav_menu], active_id: 0}},
];

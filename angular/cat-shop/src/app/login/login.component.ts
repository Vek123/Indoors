import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HeaderComponent} from '../header/header.component';
import {LoginForm, NavItem} from '../models';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserService} from '../_services/user.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatFabButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatFabButton,
    NgIf,
    NgForOf,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })
  nav_menu: { menu: NavItem[], active_id: number };
  login_errors: object | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.nav_menu = {menu: [...data["nav_menu"]], active_id: -1};
    });

  }

  onSubmit() {
    const data: LoginForm = this.loginForm.value as LoginForm;
    this.userService.login(
      data.username,
      data.password,
      {
        onErrorCallback: (error) => {
          this.login_errors = error.error;
        },
        onSuccessCallback: (_) => {
          this.router.navigate(["/shop"]);
        }
      }
    )
  }

  protected readonly Object = Object;
  protected readonly Array = Array;
}

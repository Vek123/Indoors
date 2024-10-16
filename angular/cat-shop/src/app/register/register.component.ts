import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {NavItem} from '../models';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserService} from '../_services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatFabButton} from '@angular/material/button';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatFabButton,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  nav_menu: {menu: NavItem[], active_id: number};
  registerForm: FormGroup;
  register_errors: object | null;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.nav_menu = {menu:[...data["nav_menu"]], active_id:-1};
    });
    this.createForm();
  }
  createForm() {
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      passwords: this.formBuilder.group({
        password: new FormControl('', [Validators.required]),
        re_password: new FormControl('', [Validators.required]),
      }, {validators: [rePasswordValidator]})
    })
  }
  onSubmit() {
    this.userService.register(
      this.registerForm.value["username"],
      this.registerForm.value["first_name"],
      this.registerForm.value["passwords"]["password"],
      this.registerForm.value["passwords"]["re_password"],
      {
        onErrorCallback: error => {
          this.register_errors = error.error;
        },
        onSuccessCallback: _ => {
          this.userService.login(
            this.registerForm.value["username"],
            this.registerForm.value["passwords"]["password"],
            {
              onErrorCallback: error => {
                this.register_errors = error.error;
              },
              onSuccessCallback: _ => {
                this.router.navigate(["/shop"]);
              }
            }
          )
        }
      }
    )
  }

  protected readonly Object = Object;
}
export function rePasswordValidator(form: FormGroup) {
  let valid: boolean;
  let passwords = new Set<string>();
  Object.values(form.controls).forEach(field => {
    passwords.add(field.value);
  })
  valid = passwords.size === 1;
  return valid ? null : {mismatch: true};
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

  constructor(private authService: AuthService) {
    this.loginForm = new FormGroup({
      username: new FormControl(null,{}),
      password: new FormControl(null, {})
    })
  }

  ngOnInit(): void {
  }

  login(){
    if(this.loginForm.invalid) { return; }
    this.authService.loginUser(
      this.loginForm.value.username,
      this.loginForm.value.password
      );
  }

}

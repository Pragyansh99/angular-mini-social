import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm:FormGroup

  constructor(private authService: AuthService) {
    this.signupForm = new FormGroup({
      username: new FormControl(null, {}),
      password: new FormControl(null, {})
    });
  }

  ngOnInit(): void { }

  signup() {
    if(!this.signupForm.value.username || !this.signupForm.value.password) { return; }
    this.authService.createUser(this.signupForm.value.username, this.signupForm.value.password)
  }

}

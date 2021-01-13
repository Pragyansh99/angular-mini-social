import { Component, OnInit } from '@angular/core';
import { AuthService } from './providers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-mini-social-network';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.autoLogin();
  }

}

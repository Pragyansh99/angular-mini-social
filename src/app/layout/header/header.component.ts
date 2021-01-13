import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListnerSubscription: Subscription
  userAuthenticated = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.userAuthenticated = this.auth.getIsAuthenticated();
    this.authListnerSubscription = this.auth.getAuthStatus().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    if(this.authListnerSubscription) {
      this.authListnerSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.auth.logout();
  }

}

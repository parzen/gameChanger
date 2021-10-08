import { AuthService } from '../../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSub: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}

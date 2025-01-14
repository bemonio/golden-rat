import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    try {
      const isAuthenticated = await this.authService.isAuthenticated();
      
      if (!isAuthenticated) {
        const queryParams = window.location.search;
        if (queryParams.includes('code=') && queryParams.includes('state=')) {
          await this.authService.handleRedirectCallback();
          window.history.replaceState({}, document.title, window.location.pathname);
          const authenticated = await this.authService.isAuthenticated();
          if (authenticated) {
            this.router.navigate(['/home']);
          }
        }
      }
    } catch (error) {
      console.error('Error during authentication', error);
      this.router.navigate(['/login']);
    }
  }
}

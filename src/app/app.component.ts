import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('Golden Rat');
  }

  async ngOnInit() {
    try {
      const queryParams = window.location.search;

      if (queryParams.includes('code=') && queryParams.includes('state=')) {
        await this.authService.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const isAuthenticated = await this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.router.navigate(['/pos']);
      } else {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error during authentication', error);
      this.router.navigate(['/login']);
    }
  }
}


import { Injectable } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth0Client: Auth0Client;

  constructor(private router: Router) {
    this.auth0Client = new Auth0Client({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: environment.auth0.callbackUrl
      }
    });
  }

  async login(): Promise<void> {
    await this.auth0Client.loginWithRedirect();
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authUser');
    await this.auth0Client.logout({
      logoutParams: { returnTo: environment.auth0.callbackUrl + '/login' }
    });
  }

  async handleRedirectCallback() {
    await this.auth0Client.handleRedirectCallback();
    const user = await this.auth0Client.getUser();
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  async isAuthenticated(): Promise<boolean> {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      return true;
    }
    return await this.auth0Client.isAuthenticated();
  }

  async getUser(): Promise<any> {
    return await this.auth0Client.getUser();
  }
}

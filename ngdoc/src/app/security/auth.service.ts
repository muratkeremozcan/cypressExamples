import { Injectable, EventEmitter } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IUser } from './user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class Auth {
  private identityRetrieved = false;
  authenticated = false;

  currentIdentity: IUser;

  constructor(private httpClient: HttpClient) { }

  hasRole(role) {
    return this.currentIdentity && this.currentIdentity.role === role;
  }

  getAuthType() {
    return this.httpClient.get('/api/auth/type');
  }

  localLogin() {
    this.httpClient.post('/api/auth/login', { username: 'joeeames@gmail.com', password: 'joe' })
      .subscribe((d) => {
        this.identityRetrieved = false;
        this.getIdentity();
        console.log('logged in with local user');
      });
  }

  isAuthenticated(): Promise<boolean> {
    const p = new Promise<boolean>((resolve) => {
      this.getIdentity().then(() => {
        resolve(this.authenticated);
      });
    });

    return p;
  }

  isAdmin(): Promise<boolean> {
    const p = new Promise<boolean>((resolve) => {
      this.getIdentity().then(() => {
        resolve(this.currentIdentity.role === 'admin');
      });
    });

    return p;
  }

  getIdentity() {
    const p = new Promise((resolve) => {
      if (this.identityRetrieved) {
        resolve(this.currentIdentity);
      }
      this.httpClient.get('/api/currentIdentity')
        .subscribe((user: any) => {
          this.identityRetrieved = true;

          if (user._id !== undefined) {
            this.currentIdentity = user;
            this.authenticated = true;
            resolve(this.currentIdentity);
          } else {
            resolve(undefined);
          }
        });
    });
    return p;
  }

  logout() {
    const o = this.httpClient.post('/api/logout', {});
    o.subscribe(() => {
      this.currentIdentity = undefined;
      this.authenticated = false;
    });
    return o;
  }

  verifyCaptcha(response) {
    const secret = environment.captcha_secret,
      url = '/api/captcha/verify';

    return this.httpClient.post(url, { secret: secret, response: response });
  }
}

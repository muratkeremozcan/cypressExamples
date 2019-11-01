/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MainNavComponent } from './nav/main-nav.component';
import { SiteFooterComponent } from './footer/site-footer.component';

import { Auth } from './security/auth.service';

class AuthServiceMock {
  hasRole(role) {
    return true;
  }

  getIdentity() {
    return null;
  }
}

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MainNavComponent,
        SiteFooterComponent
      ],
      providers: [
        { provide: Auth, useValue: AuthServiceMock }
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

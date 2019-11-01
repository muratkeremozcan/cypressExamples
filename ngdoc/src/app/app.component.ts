import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-main-nav></app-main-nav>
    <div class='page-wrapper'>
      <router-outlet></router-outlet>
    </div>
    <app-site-footer></app-site-footer>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  ngOnInit() {}
}

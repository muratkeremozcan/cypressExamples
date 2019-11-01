import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: 'main-nav.component.html',
  styleUrls: ['main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  displayDropDownNav = false;

  ngOnInit() {}

  toggleNav() {
    this.displayDropDownNav = !this.displayDropDownNav;
  }
}

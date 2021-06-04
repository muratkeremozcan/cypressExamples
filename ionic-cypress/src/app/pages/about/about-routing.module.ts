import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutPage } from './about';

const routes: Routes = [
  {
    path: '',
    component: AboutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutPageRoutingModule { }

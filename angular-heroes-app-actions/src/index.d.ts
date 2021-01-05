import { HeroesComponent } from './app/heroes/heroes.component';
import { ApplicationRef } from '@angular/core';
declare global {
  interface Window {
    Cypress?: unknown
    appRef?: ApplicationRef
    HeroesComponent?: HeroesComponent
  }
}

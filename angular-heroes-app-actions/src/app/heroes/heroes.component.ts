import { Component, OnInit, ApplicationRef  } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) {
    if (window.Cypress) {
      window.HeroesComponent = this
    }
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  // add(name: string) {
  //   name = name.trim();
  //   if (!name) { return }
  //   this.heroService.addHero({ name } as Hero)
  //   .subscribe(hero => {
  //     this.heroes.push(hero);
  //   })
  // }

  add(name: string): Promise<void> {
    name = name.trim();
    if (!name) { return Promise.resolve(); }
    return new Promise((resolve) => {
      this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
        resolve()
      });
    })
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/

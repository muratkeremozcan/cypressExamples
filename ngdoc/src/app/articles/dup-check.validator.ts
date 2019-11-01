import { ArticleService } from './services/article.service';
import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

let _articleService;

@Injectable()
export class DupCheckValidator {

  constructor(private articleService: ArticleService) {
    _articleService = articleService;
  }

  checkDupUrl(c: AbstractControl) {
    const p = new Promise((resolve, reject) => {
      _articleService.checkDupUrl(c.value)
        .subscribe(val => {
          if (val.isDup) {
            resolve({ shouldBeUnique: true });
          } else {
            resolve(null);
          }
        });
    });

    return p;
  }

}

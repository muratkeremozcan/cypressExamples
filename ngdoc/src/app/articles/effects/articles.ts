import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { switchMap, toArray, map, catchError, mergeMap } from 'rxjs/operators';

import { ArticleActionTypes } from '../actions/articles';
import * as articleActions from '../actions/articles';
import { IArticle } from '../models/article';
import { ArticleService } from '../services/article.service';

@Injectable()
export class ArticleEffects {
  constructor(private actions: Actions, private articleSvc: ArticleService) {}

  @Effect()
  loadRecentArticles: Observable<Action> = this.actions
    .ofType(ArticleActionTypes.LoadRecent)
    .pipe(
      switchMap(() =>
        this.articleSvc.getRecentArticles().pipe(
          map(
            (articles: IArticle[]) =>
              new articleActions.LoadArticlesSuccess(articles)
          ),
          catchError(err =>
            of(new articleActions.LoadArticlesFail({ error: err.message }))
          )
        )
      )
    );

  @Effect()
  searchArticles: Observable<Action> = this.actions
    .ofType(ArticleActionTypes.Search)
    .pipe(
      switchMap((action: articleActions.SearchArticles) =>
        this.articleSvc.searchArticles(action.filter).pipe(
          map(
            (articles: IArticle[]) =>
              new articleActions.LoadArticlesSuccess(articles)
          ),
          catchError(error => of(new articleActions.LoadArticlesFail(error)))
        )
      )
    );
}

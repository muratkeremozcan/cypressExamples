import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

import * as articleActions from '../../articles/actions/articles';
import { ArticleFilterActionTypes } from '../actions/article-filter';
import * as articleFilterActions from '../actions/article-filter';
import { IArticleFilter } from '../models/article-filter';
import { articleFilterReducer, AppState } from '../reducers/article-filter';

@Injectable()
export class ArticleFilterEffects {
  constructor(private actions: Actions, private store: Store<AppState>) {}

  // switch action to load articles
  @Effect() changeFilter = this.actions
    .ofType(
      ArticleFilterActionTypes.SetVersion,
      ArticleFilterActionTypes.SetKeywords,
      ArticleFilterActionTypes.SetFilter,
      ArticleFilterActionTypes.SetTags,
      ArticleFilterActionTypes.Reset
    )
    .pipe(
      withLatestFrom(this.store, (action, state) => state.articleFilter),
      map(filter => {
        if (this.filterIsDefault(filter)) {
          return new articleActions.LoadRecentArticles();
        } else {
          return new articleActions.SearchArticles(filter);
        }
      })
    );

  filterIsDefault = filter => {
    return (
      filter.tags.length === 0 &&
      filter.keywords === '' &&
      filter.version === '2+'
    );
  }
}

import { Action } from '@ngrx/store';

import { IArticle } from '../models';
import { IArticleFilter } from '../../../app/article-filter/models/article-filter';

export enum ArticleActionTypes {
  Search = '[Article] Search',
  LoadRecent = '[Article] Load Recent',
  LoadSuccess = '[Article] Load Success',
  LoadFail = '[Article] Load Fail',
  Select = '[Article] Select'
}

export class SearchArticles implements Action {
  readonly type = ArticleActionTypes.Search;

  constructor(public filter: IArticleFilter) { }
}

export class LoadRecentArticles implements Action {
  readonly type = ArticleActionTypes.LoadRecent;
}

export class LoadArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.LoadSuccess;

  constructor(public payload: IArticle[]) { }
}

export class LoadArticlesFail implements Action {
  readonly type = ArticleActionTypes.LoadFail;

  constructor(public payload?: any) { }
}

export class Select implements Action {
  readonly type = ArticleActionTypes.Select;

  constructor(public payload: number) { }
}

export type ArticleActions
  = SearchArticles
  | LoadRecentArticles
  | LoadArticlesSuccess
  | LoadArticlesFail
  | Select;

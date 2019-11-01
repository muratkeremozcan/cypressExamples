import { Action } from '@ngrx/store';

import { IArticleFilter } from '../models/article-filter';

export enum ArticleFilterActionTypes {
  AddTag = '[Article Filter] Add Tag',
  RemoveTag = '[Article Filter] Remove Tag',
  Reset = '[Article Filter] Reset',
  SetVersion = '[Article Filter] Set Version',
  SetKeywords = '[Article Filter] Set Keywords',
  SetFilter = '[Article Filter] Set Filter',
  SetShowAllTags = '[Article Filter] Set Show All Tags',
  SetTags = '[Article Filter] Set Tags'
}

export class AddTag implements Action {
  readonly type = ArticleFilterActionTypes.AddTag;

  constructor(public payload: string) { }
}

export class RemoveTag implements Action {
  readonly type = ArticleFilterActionTypes.RemoveTag;

  constructor(public payload: string) { }
}

export class Reset implements Action {
  readonly type = ArticleFilterActionTypes.Reset;
}

export class SetVersion implements Action {
  readonly type = ArticleFilterActionTypes.SetVersion;

  constructor(public payload: string) { }
}

export class SetKeywords implements Action {
  readonly type = ArticleFilterActionTypes.SetKeywords;

  constructor(public payload: string) { }
}

export class SetTags implements Action {
  readonly type = ArticleFilterActionTypes.SetTags;

  constructor(public payload: string[]) { }
}

export class SetFilter implements Action {
  readonly type = ArticleFilterActionTypes.SetFilter;

  constructor(public payload: IArticleFilter) { }
}

export class SetShowAllTags implements Action {
  readonly type = ArticleFilterActionTypes.SetShowAllTags;

  constructor(public payload: boolean) { }
}

export type ArticleFilterActions
  = AddTag
  | Reset
  | RemoveTag
  | SetVersion
  | SetKeywords
  | SetFilter
  | SetShowAllTags
  | SetTags;

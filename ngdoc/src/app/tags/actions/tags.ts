import { Action } from '@ngrx/store';

import { ITag } from '../models/tags';

export enum TagActionTypes {
  Load = '[Tag] Load',
  Search = '[Tag] Search',
  LoadSuccess = '[Tag] Load Success',
  LoadFail = '[Tag] Load Fail',
  Select = '[Tag] Select',
  TagSearch = '[Tag] Search'
}

export class LoadAll implements Action {
  readonly type = TagActionTypes.Load;
}

export class LoadTagsSuccess implements Action {
  readonly type = TagActionTypes.LoadSuccess;

  constructor(public payload: ITag[]) { }
}

export class LoadTagsFail implements Action {
  readonly type = TagActionTypes.LoadFail;

  constructor(public payload?: any) { }
}

export class Select implements Action {
  readonly type = TagActionTypes.Select;

  constructor(public payload: number) { }
}

export class TagSearch implements Action {
  readonly type = TagActionTypes.TagSearch;

  constructor(public payload: string) { }
}

export type TagActions
  = LoadAll
  | LoadTagsSuccess
  | LoadTagsFail
  | Select
  | TagSearch;

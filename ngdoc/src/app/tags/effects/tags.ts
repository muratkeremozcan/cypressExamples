import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { switchMap, toArray, map, catchError, mergeMap } from 'rxjs/operators';

import { TagActionTypes } from '../actions/tags';
import * as tagActions from '../actions/tags';
import { ITag } from '../models/tags';
import { TagService } from '../services/tag.service';

@Injectable()
export class TagEffects {
  constructor(private actions: Actions,
    private tagSvc: TagService) {
  }

  @Effect()
  loadTags: Observable<Action> = this.actions.ofType(TagActionTypes.Load)
    .pipe(
    switchMap(() =>
      this.tagSvc.getTags()
        .pipe(
        map((tags: ITag[]) => new tagActions.LoadTagsSuccess(tags)),
        catchError(err => of(new tagActions.LoadTagsFail({ error: err.message })))
        )
    )
    );
}

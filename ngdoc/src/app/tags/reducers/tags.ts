import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ITag } from '../models/tags';
import { TagActions, TagActionTypes } from '../actions/tags';
import { IArticleFilter } from '../../../app/article-filter/models/article-filter';

export interface AppState {
  tags: ITag[];
  articleFilter: IArticleFilter;
}

export interface TagsState extends EntityState<ITag> {
  selectedTagId: number | null;
  loading: boolean;
  tagSearch: string;
}

export const tagAdapter: EntityAdapter<ITag> = createEntityAdapter<ITag>({
  selectId: (tag => tag._id),
  sortComparer: (a, b) => {
    const tagA = a.tag.toUpperCase(),
      tagB = b.tag.toUpperCase();

    if (tagA < tagB) {
      return -1;
    }
    if (tagA > tagB) {
      return 1;
    }

    return 0;
  }
});

export const initialState: TagsState = tagAdapter.getInitialState({
  selectedTagId: null,
  tagSearch: '',
  loading: false
});

export function tagReducer(
  state = initialState,
  action: TagActions
): TagsState {
  switch (action.type) {
    case TagActionTypes.Load:
      return {
        ...state,
        loading: true
      };

    case TagActionTypes.LoadSuccess:
      return {
        ...tagAdapter.addMany(action.payload, initialState),
        loading: false
      };

    case TagActionTypes.LoadFail:
      return {
        ...state,
        ...action.payload,
        loading: false
      };


    case TagActionTypes.Select: {
      return {
        ...state,
        selectedTagId: action.payload,
      };
    }

    case TagActionTypes.TagSearch: {
      return {
        ...state,
        loading: state.loading,
        tagSearch: action.payload
      };
    }

    default:
      return state;
  }
}

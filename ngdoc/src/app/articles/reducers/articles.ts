import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IArticle } from '../models';
import { ArticleActions, ArticleActionTypes } from '../actions/articles';
import { IArticleFilter } from '../../../app/article-filter/models/article-filter';

export interface AppState {
  articles: IArticle[];
  articleFilter: IArticleFilter;
}

export interface ArticlesState extends EntityState<IArticle> {
  selectedArticleId: number | null;
  loading: boolean;
  error: any;
}

export const articleAdapter: EntityAdapter<IArticle> = createEntityAdapter<IArticle>({
  selectId: (article: IArticle) => article._id
});

export const initialState: ArticlesState = articleAdapter.getInitialState({
  selectedArticleId: null,
  loading: false,
  error: null
});

export function articleReducer(
  state = initialState,
  action: ArticleActions
): ArticlesState {
  switch (action.type) {
    case ArticleActionTypes.LoadRecent:
    case ArticleActionTypes.Search:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ArticleActionTypes.LoadSuccess:
      return {
        ...articleAdapter.addMany(action.payload, initialState),
        loading: false
      };

    case ArticleActionTypes.LoadFail:
      return {
        ...state,
        loading: false,
        error: { error: 'Error while loading articles' }
      };

    case ArticleActionTypes.Select: {
      return {
        ...state,
        selectedArticleId: action.payload,
      };
    }

    default:
      return state;
  }
}

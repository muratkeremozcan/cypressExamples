import { ActionReducerMap } from '@ngrx/store';

import { AppState, articleFilterReducer } from './article-filter';

export const reducers: ActionReducerMap<AppState> = {
  articleFilter: articleFilterReducer
};

export const getArticleFilter = (state: AppState) => state.articleFilter;

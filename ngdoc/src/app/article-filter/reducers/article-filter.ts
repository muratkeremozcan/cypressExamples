import { IArticleFilter } from '../models/article-filter';
import { ArticleFilterActions, ArticleFilterActionTypes } from '../actions/article-filter';

export interface AppState {
  articleFilter: IArticleFilter;
}

export const initialState: IArticleFilter = {
  keywords: '',
  version: '2+',
  tags: [],
  showAllTags: false
};

export function articleFilterReducer(
  state = initialState,
  action: ArticleFilterActions
): IArticleFilter {
  switch (action.type) {
    case ArticleFilterActionTypes.SetFilter:
      return { ...state, ...action.payload };

    case ArticleFilterActionTypes.Reset:
      return { ...initialState };

    case ArticleFilterActionTypes.AddTag:
      const tags = { tags: [...state.tags, action.payload] };
      return { ...state, ...tags };

    case ArticleFilterActionTypes.RemoveTag:
      const data = [...state.tags].filter(tag =>
        tag !== action.payload);
      return { ...state, tags: data };

    case ArticleFilterActionTypes.SetShowAllTags:
      return { ...state, showAllTags: action.payload };

    case ArticleFilterActionTypes.SetTags:
      return { ...state, ...{ tags: action.payload } };

    default:
      return state;
  }
}

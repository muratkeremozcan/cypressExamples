import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';


import { ArticlesState, articleReducer, articleAdapter } from './articles';
import { IArticle } from '../models';


export interface State {
  articles: ArticlesState;
}

export const reducers: ActionReducerMap<State> = {
  articles: articleReducer
};

export const selectArticleState = createFeatureSelector<ArticlesState>('articles');

export const getSelectedId = (state: ArticlesState) => state.selectedArticleId;
export const getLoadingFlag = (state: ArticlesState) => state.loading;
export const getError = (state: ArticlesState) => state.error;

export const getSelectedArticleId = createSelector(
  selectArticleState,
  getSelectedId
);

export const getArticleLoadingFlag = createSelector(
  selectArticleState,
  getLoadingFlag
);

export const selectError = createSelector(
  selectArticleState,
  getError
);

export const {
  selectIds: selectArticleIds,
  selectEntities: selectArticleEntities,
  selectAll: selectAllArticles,
  selectTotal: selectArticleTotal
} = articleAdapter.getSelectors(selectArticleState);

export const selectAllArticleTags = createSelector(
  selectAllArticles,
  (articles: IArticle[]) =>
    articles.map(article => article.tags)
);

const combineArrays = (previousValue: string[], currentValue: IArticle) => {
  return [...previousValue, ...currentValue.tags];
};

export const selectAllTags = createSelector(
  selectAllArticles,
  (articles) => {
    return articles.reduce(combineArrays, []);
  }
);

export const selectUniqueTags = createSelector(
  selectAllTags,
  (tags) => {
    return tags.filter((v, i, a) => a.indexOf(v) === i);
  }
);

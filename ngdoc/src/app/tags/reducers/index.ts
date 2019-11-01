import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import { Observable } from 'rxjs';
import { AppState, TagsState, tagReducer, tagAdapter } from './tags';

import * as articleSelectors from '../../articles/reducers';
import * as articleFilterSelectors from '../../article-filter/reducers';
import { defaultTags } from './defaultTagList';

export interface State {
  tags: TagsState;
}

export const reducers: ActionReducerMap<State> = {
  tags: tagReducer
};

export const selectTagState = createFeatureSelector<TagsState>('tags');
export const getTagSearchString = (state: TagsState) => state.tagSearch;

export const {
  selectIds: selectTagIds,
  selectEntities: selectTagEntities,
  selectAll: selectAllTags,
  selectTotal: selectTagTotal
} = tagAdapter.getSelectors(selectTagState);

export const selectTagSearch = createSelector (
  selectTagState,
  getTagSearchString
);

export const selectTagStrings = createSelector(
  selectAllTags,
  (tags) => {
    return tags.map(tag => tag.tag);
  }
);

export const selectDefaultTags = createSelector(
  selectTagStrings,
  articleFilterSelectors.getArticleFilter,
  (tags, filter) => tags.filter(tag => {
    return defaultTags.indexOf(tag) > -1 &&
      filter.tags.indexOf(tag) === -1;
  })
);

export const selectTags = createSelector(
  articleFilterSelectors.getArticleFilter,
  selectTagSearch,
  selectTagStrings,
  articleSelectors.selectUniqueTags,
  selectDefaultTags,
  (filter, searchString, allTags, articleTags, defaultTagsList) => {
    if (searchString || (filter.showAllTags && filter.tags.length === 0)) {
      return allTags;
    } else if (filter.tags.length) {
      return articleTags;
    } else {
      return defaultTagsList;
    }
  }
);

export const selectFilteredTags = createSelector(
  articleFilterSelectors.getArticleFilter,
  selectTagSearch,
  selectTags,
  (filter, searchString, tags) => tags.filter(tag => {
    return (!searchString || tag.indexOf(searchString) !== -1) &&
      filter.tags.indexOf(tag) === -1;
  })
);

export const selectFilteredSortedTags = createSelector (
  selectFilteredTags,
  (tags) => {
    return tags.sort();
  }
);

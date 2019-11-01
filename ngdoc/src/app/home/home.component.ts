import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from 'primeng/primeng';

import { LoadingContainerComponent, LoadingPage } from '../common/loading-container';

import { IArticle } from '../articles/models';
import * as fromArticles from '../articles/reducers/articles';
import * as articleSelectors from '../articles/reducers';

import { IArticleFilter } from '../../app/article-filter/models/article-filter';
import * as ArticleFilterActions from '../article-filter/actions/article-filter';
import * as articleFilterSelectors from '../article-filter/reducers';

import * as TagActions from '../tags/actions/tags';
import * as tagSelectors from '../tags/reducers';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent extends LoadingPage implements OnInit {
  articles$: Observable<IArticle[]>;
  tags$: Observable<string[]>;
  filterData$: Observable<IArticleFilter>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  msgs: Message[] = [];

  constructor(private store: Store<fromArticles.AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(true);

    // load all tags
    this.store.dispatch(new TagActions.LoadAll());
  }

  ngOnInit() {
    this.articles$ = this.store.select(articleSelectors.selectAllArticles);
    this.tags$ = this.store.select(tagSelectors.selectFilteredSortedTags);
    this.filterData$ = this.store.select(articleFilterSelectors.getArticleFilter);

    this.loading$ = this.store.select(articleSelectors.getArticleLoadingFlag);
    this.error$ = this.store.select(articleSelectors.selectError);

    // subscribe to article loading flag changes
    this.loading$.subscribe((loading) => {
      this.loading = loading;
    });

    // subscribe to any errors
    this.error$.subscribe((payload) => {
      if (payload && payload.error) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: payload.error });
      }
    });

    // watch when query params change
    this.activatedRoute.queryParams.subscribe(params => {
      const parms = params['tags'],
        tags = parms ? parms.split(',') : [];

      if (parms !== undefined) {
        this.store.dispatch(new ArticleFilterActions.SetTags(tags));
      }
    });

    // navigate when the filter data changes
    this.filterData$.subscribe(data => {
      this.router.navigate([''], {
        queryParams: { tags: data.tags.join(',') }
      });
    });
  }

  showAllTags() {
    this.store.dispatch(new ArticleFilterActions.SetShowAllTags(true));
  }

  keywords(keywords: string) {
    this.store.dispatch(new ArticleFilterActions.SetKeywords(keywords));
  }

  version(version: string) {
    this.store.dispatch(new ArticleFilterActions.SetVersion(version));
  }

  addTag(tag: string) {
    this.store.dispatch(new ArticleFilterActions.AddTag(tag));
  }

  removeTag(tag: string) {
    this.store.dispatch(new ArticleFilterActions.RemoveTag(tag));
  }

  reset() {
    this.store.dispatch(new ArticleFilterActions.Reset());
  }

  tagSearch(tagFilterValue: string) {
    this.store.dispatch(new TagActions.TagSearch(tagFilterValue));
    tagSelectors.selectTagSearch.release();
  }
}

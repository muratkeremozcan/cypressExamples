import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { LoadingContainerComponent, LoadingPage } from '../../../common/loading-container';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/primeng';

import { IArticleFilter } from '../../../article-filter/models/article-filter';
import { ITag } from '../../models/tags';

@Component({
  selector: 'app-home-search',
  templateUrl: 'home-search.component.html',
  styleUrls: ['home-search.component.scss']
})
export class HomeSearchComponent extends LoadingPage implements OnInit {
  @Input() filterData: IArticleFilter;
  @Input() tags: string[];

  @Output() showAll = new EventEmitter<boolean>();
  @Output() keywords = new EventEmitter<string>();
  @Output() version = new EventEmitter<string>();
  @Output() addTag = new EventEmitter<ITag>();
  @Output() removeTag = new EventEmitter<ITag>();
  @Output() tagSearch = new EventEmitter<string>();
  @Output() reset = new EventEmitter();

  searchTagsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super(true);
  }

  ngOnInit() {
    this.searchTagsForm = this.fb.group({
      tagsearch: ''
    });
  }

  someTagsAreSelected() {
    return this.filterData && this.filterData.tags.length > 0;
  }

  isInTagList(tag) {
    return this.filterData.tags.some(item => {
      return item === tag;
    });
  }

  selectTag(tag) {
    this.addTag.emit(tag);
    this.clearTagFilter();
  }

  clearTagFilter() {
    this.tagSearch.emit('');
    this.searchTagsForm.reset();
  }
}

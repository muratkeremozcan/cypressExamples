import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IArticle } from '../articles/models/article';

@Injectable()
export class BookmarkService {

  constructor(private httpClient: HttpClient) {
  }

  toggleBookmark(article: IArticle) {
    return this.httpClient.post('/api/bookmarks', { id: article._id });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IArticle } from '../models/article';
import { map } from 'rxjs/operators';

@Injectable()
export class ArticleService {
  public versions = [
    { label: '2+', value: '2+' },
    { label: '1.x', value: '1.x' },
    { label: '1.5', value: '1.5' },
    { label: '1.6', value: '1.6' },
    { label: '2 Alpha', value: '2 Alpha' },
    { label: '2 Beta', value: '2 Beta' },
    { label: '2 Release Candidate', value: '2 Release Candidate' },
    { label: '2.0', value: '2.0' },
    { label: '2.1', value: '2.1' },
    { label: '2.2', value: '2.2' },
    { label: '2.3', value: '2.3' },
    { label: '2.4', value: '2.4' },
    { label: '4 Beta', value: '4 Beta' },
    { label: '4 Release Candidate', value: '4 Release Candidate' },
    { label: '4+', value: '4+' },
    { label: '4.0', value: '4.0' },
    { label: '4.1', value: '4.1' },
    { label: '4.2', value: '4.2' },
    { label: '4.3', value: '4.3' },
    { label: '4.4', value: '4.4' },
    { label: '5 Beta', value: '5 Beta' },
    { label: '5 Release Candidate', value: '5 Release Candidate' },
    { label: '5+', value: '5+' },
    { label: '5.1', value: '5.1' }
  ];

  constructor(private httpClient: HttpClient) {}

  approve(id) {
    return this.httpClient.post('/api/articles/' + id + '/approve', {});
  }

  save(article: IArticle) {
    if (!article._id) {
      return this.createArticle(article);
    }

    return this.updateArticle(article);
  }

  createArticle(newArticle: IArticle) {
    return this.httpClient.post('/api/articles', newArticle);
  }

  updateArticle(article: IArticle) {
    return this.httpClient.put('/api/articles/' + article._id, article);
  }

  upvoteArticle(article) {
    article.rating += 1;
    return this.updateArticle(article);
  }

  downvoteArticle(article) {
    article.rating -= 1;
    return this.updateArticle(article);
  }

  searchArticles(filterData) {
    return this.httpClient.post('/api/articles/search', filterData);
  }

  searchAllArticles(filterData) {
    filterData.all = true;
    return this.httpClient.post('/api/articles/search', filterData);
  }

  getRecentArticles() {
    return this.httpClient.get('/api/articles/recent');
  }

  getArticles() {
    return this.httpClient.get('/api/articles');
  }

  getArticle(id) {
    return this.httpClient.get('/api/articles/' + id);
  }

  getArticleForEdit(id) {
    const url = '/api/articles/' + id + '?allData=true';
    return this.httpClient.get(url);
  }

  checkDup(article) {
    return this.httpClient.post('/api/articles/isdup', article);
  }

  checkDupUrl(url) {
    return this.httpClient.post('/api/articles/isdupurl', { url: url });
  }

  getAuthors() {
    return this.httpClient.get('/api/authors/');
  }

  searchAuthors(searchString) {
    return this.httpClient
      .get('/api/authors/search/' + searchString.toLocaleLowerCase())
      .pipe(
        map((matches: any[]) => {
          return matches.map(match => {
            return match.name;
          });
        })
      );
  }

  getNextArticleForApproval() {
    return this.httpClient.get('/api/articles/nextunreviewed');
  }
}

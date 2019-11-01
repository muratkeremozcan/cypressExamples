import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-list',
  template: `
    <h1>Articles List</h1>
    <div class="articles-wrapper">
      <a *ngFor="let article of articles" [routerLink]="['/admin/resources/' + article._id]">
        {{article.title}}
      </a>
    </div>
  `,
  styles: [
    'h1 {margin: 22px;}',
    'a {margin-bottom: 18px;}',
    'a:nth-child(odd) {color: #6680ab}',
    'a.bold { font-weight: bold; color: red }',
    '.articles-wrapper { display: flex; flex-direction: column; margin: 22px; }'
  ]

})
export class ArticleListComponent implements OnInit {
  articles: any;
  selectedVersion: string;
  keywords: String;
  versionList: Object[];

  constructor(private articleSvc: ArticleService) {
    this.versionList = articleSvc.versions.slice();
  }

  ngOnInit() {
    this.articleSvc.getArticles()
      .subscribe(articles => {
        this.articles = articles;
      });
  }

}

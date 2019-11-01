import { Component, Input } from '@angular/core';
import { ArticleService } from '../../../articles/services/article.service';
import { LoadingContainerComponent, LoadingPage } from '../../../common/loading-container';
import { IArticle } from '../../../articles/models/article';

@Component({
  selector: 'app-article',
  templateUrl: 'article.component.html',
  styleUrls: ['article.component.scss']
})
export class ArticleComponent {
  @Input() article: IArticle;
}

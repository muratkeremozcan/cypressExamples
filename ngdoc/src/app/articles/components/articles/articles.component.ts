import { Component, Input } from '@angular/core';
import { IArticle } from '../../models/article';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
  @Input() articles: IArticle[];
}

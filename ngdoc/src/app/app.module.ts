import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { ArticleFilterEffects } from './article-filter/effects/article-filter';

import { ArticleEffects } from './articles/effects/articles';
import { articleReducer } from './articles/reducers/articles';
import { ArticleService } from './articles/services/article.service';

import { TagEffects } from './tags/effects/tags';
import { tagReducer } from './tags/reducers/tags';
import { TagService } from './tags/services/tag.service';
import { articleFilterReducer } from './article-filter/reducers/article-filter';

import { AppComponent } from './app.component';
import { MainNavComponent } from './nav/main-nav.component';
import { SiteFooterComponent } from './footer/site-footer.component';
import { AboutComponent } from './about/about.component';
import { NewArticleComponent } from './articles/components/new-article/new-article.component';
import { ArticlesComponent } from './articles/components/articles/articles.component';
import { HomeComponent } from './home/home.component';
import { routes } from './routes';
import { LoggedInGuard } from './security/logged-in.guard';
import { AdminLoggedInGuard } from './security/admin-logged-in.guard';
import { Auth } from './security/auth.service';
import { HomeSearchComponent } from './tags/components/search/home-search.component';
import { ArticleListComponent } from './articles/components/article-list/article-list.component';
import { LoadingContainerComponent, LoadingPage } from './common/loading-container';
import { DupCheckValidator } from './articles/dup-check.validator';
import { ArticleComponent } from './articles/components/article/article.component';
import { AutocompleteWithChipsComponent } from './articles/components/auto-complete/autoComplete.component';
import {
  ButtonModule, AutoCompleteModule, CalendarModule,
  DropdownModule, InputTextModule, GrowlModule, SharedModule,
  TooltipModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, ToggleButtonModule, SelectButtonModule, CaptchaModule
} from 'primeng/primeng';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InMemoryDataService } from './in-memory-data.service';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    SiteFooterComponent,
    AboutComponent,
    NewArticleComponent,
    HomeComponent,
    HomeSearchComponent,
    ArticlesComponent,
    ArticleListComponent,
    LoadingContainerComponent,
    ArticleComponent,
    AutocompleteWithChipsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ButtonModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    GrowlModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule,
    ToggleButtonModule,
    SelectButtonModule,
    CaptchaModule,
    SharedModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    StoreModule.forRoot({
      articles: articleReducer,
      tags: tagReducer,
      articleFilter: articleFilterReducer
    }),
    EffectsModule.forRoot([ArticleEffects, TagEffects, ArticleFilterEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    })
  ],
  providers: [
    LoggedInGuard,
    AdminLoggedInGuard,
    Auth,
    ArticleService,
    TagService,
    ConfirmationService,
    DupCheckValidator
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

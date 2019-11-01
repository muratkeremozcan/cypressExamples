import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { RouteConfigLoadEnd } from '@angular/router/src/events';

import { Observable } from 'rxjs';
import { Message, Captcha, AutoComplete } from 'primeng/primeng';

import { IArticle, ContentTypes } from '../../models/article';
import { DupCheckValidator } from '../../dup-check.validator';
import { Auth } from '../../../security/auth.service';
import { ArticleService } from '../../services/article.service';
import { TagService } from '../../../tags/services/tag.service';

import { environment } from '../../../../environments/environment';
import { NoTrackingTokenValidator } from '../../tracking-token.validator';
import { NoFutureDatesValidator } from '../../no-future-dates.validator';
import { UrlProtocolValidator } from '../../url-protocol.validator';

@Component({
  selector: 'app-new-article',
  templateUrl: 'new-article.component.html',
  styleUrls: ['new-article.component.scss']
})
export class NewArticleComponent implements OnInit {
  articleForm: FormGroup;
  dupTitle = false;
  dupURL = false;
  msgs: Message[] = [];
  versions: Object[];
  authorResults: any[];
  authorList: any[];
  tagList: any[];
  tagResults: any[];
  captchaKey = environment.captcha_key;
  showValidation = false;

  contentTypes = ContentTypes;

  constructor(
    private router: Router,
    private articleSvc: ArticleService,
    private authService: Auth,
    private tagService: TagService,
    private fb: FormBuilder,
    private dupCheck: DupCheckValidator ) {
    this.versions = articleSvc.versions;
  }

  ngOnInit() {
    this.articleSvc.getAuthors().subscribe((authors: any) => {
      this.authorList = authors;
    });

    this.tagService.getTags().subscribe((tags: any) => {
      this.tagList = tags
        .map(tag => tag.tag)
        .sort();
    });

    this.articleForm = this.fb.group({
      title: [''],
      url: ['', [Validators.required, UrlProtocolValidator(), NoTrackingTokenValidator()], this.dupCheck.checkDupUrl],
      author: [''],
      published: ['', NoFutureDatesValidator()],
      version: ['2+'],
      type: ['Blog'],
      tags: [[]],
      captcha: ['', Validators.required]
    });
  }

  searchAuthors(event) {
    this.authorResults = []; // resets list for change detection

    this.authorResults = this.authorList.filter(author => {
      return author.lower_name.indexOf(event.query.toLocaleLowerCase()) > -1;
    }).map(author => {
      return author.name;
    });
  }

  public searchTags(event) {
    this.tagResults = []; // resets list for change detection

    this.tagResults = this.tagList.filter(tag => {
      return tag.toLocaleLowerCase().indexOf(event.query.toLocaleLowerCase()) > -1;
    });
  }

  cancel() {
    this.router.navigate(['home']);
  }

  showResponse(response) {
    this.authService.verifyCaptcha(response.response)
      .subscribe((res: any) => {
        if (res.success) {
          this.setCaptchaValid();
        }
      });
  }

  setCaptchaValid() {
    const control = this.articleForm.controls['captcha'];

    control.setValue(true);
    control.updateValueAndValidity({ emitEvent: true });
  }

  prefill() {
    this.articleForm.setValue({
      title: 'title1',
      url: 'www.dil.com',
      author: 'joe eames',
      published: '1/1/2050',
      version: '2+',
      type: 'Blog',
      tags: ['tag1', 'tag2']
    });
  }

  save() {
    this.showValidation = true;

    if (this.articleForm.valid) {
      this.checkDupInfo().subscribe((isDup: Boolean) => {
        if (!isDup) {
          this.articleSvc.createArticle(this.articleForm.value)
            .subscribe(() => {
              this.msgs.push({ severity: 'success', summary: 'Success!', detail: 'Article Created. It will be made live after review.' });
              this.resetForm();
            }, (rsp: any) => {
              console.log('err', rsp);
              this.showError(rsp.error);
            });
        }
      });
    } else {
      this.showError('Invalid Form');
    }
  }

  resetForm() {
    this.showValidation = false;
    this.articleForm.reset();
    this.articleForm.patchValue({ tags: [], version: '2+', type: 'Blog' });
  }

  checkDupInfo() {
    const isDupArticle = new EventEmitter();
    this.dupURL = false;

    this.articleSvc.checkDup(this.articleForm.value)
      .subscribe((dupInfo: any) => {
        if (dupInfo.url) {
          this.dupURL = true;
        }

        if (!dupInfo.url) {
          isDupArticle.emit(false);
        } else {
          this.msgs.push({ severity: 'error', summary: 'Validation Error', detail: 'Duplicate Info' });
          isDupArticle.emit(true);
        }
      });
    return isDupArticle;
  }

  showError(message) {
    this.msgs.push({ severity: 'error', summary: 'Error', detail: message });
  }
}

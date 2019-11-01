import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class TagService {

  constructor(private httpClient: HttpClient) {
  }

  deleteTag(tag) {
    return this.httpClient.delete('/api/tags/' + tag);
  }

  renameTag(oldName, newName) {
    return this.httpClient.put('/api/tags/' + oldName, { newName: newName });
  }

  searchTags(term) {
    return this.httpClient.get('/api/tags/search/' + term);
  }

  getTags() {
    return this.httpClient.get('/api/tags/');
  }

  getTagsLowerCase() {
    return this.httpClient.get('/api/tags/')
      .pipe(
      map((tags: any[]) => {
        return tags.map(match => {
          return match.tag.toLocaleLowerCase();
        });
      })
      );
  }

}

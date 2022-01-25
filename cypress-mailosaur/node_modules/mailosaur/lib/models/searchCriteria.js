class SearchCriteria {
  constructor(data = {}) {
    this.sentFrom = data.sentFrom;
    this.sentTo = data.sentTo;
    this.subject = data.subject;
    this.body = data.body;
    this.match = data.match;
  }
}

module.exports = SearchCriteria;

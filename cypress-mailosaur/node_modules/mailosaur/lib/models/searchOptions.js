class SearchOptions {
  constructor(data = {}) {
    this.timeout = data.timeout;
    this.receivedAfter = data.receivedAfter;
    this.page = data.page;
    this.itemsPerPage = data.itemsPerPage;
    this.suppressError = data.suppressError;
  }
}

module.exports = SearchOptions;

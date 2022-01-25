class MessageListOptions {
  constructor(data = {}) {
    this.receivedAfter = data.receivedAfter;
    this.page = data.page;
    this.itemsPerPage = data.itemsPerPage;
  }
}

module.exports = MessageListOptions;

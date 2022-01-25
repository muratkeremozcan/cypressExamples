const MessageSummary = require('./messageSummary');

class MessageListResult {
  constructor(data = {}) {
    this.items = (data.items || []).map((i) => (new MessageSummary(i)));
  }
}

module.exports = MessageListResult;

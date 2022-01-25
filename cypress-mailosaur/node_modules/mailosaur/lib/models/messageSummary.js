const MessageAddress = require('./messageAddress');

class MessageSummary {
  constructor(data = {}) {
    this.id = data.id;
    this.server = data.server;
    this.from = (data.from || []).map((i) => (new MessageAddress(i)));
    this.to = (data.to || []).map((i) => (new MessageAddress(i)));
    this.cc = (data.cc || []).map((i) => (new MessageAddress(i)));
    this.bcc = (data.bcc || []).map((i) => (new MessageAddress(i)));
    this.received = new Date(data.received);
    this.subject = data.subject;
    this.summary = data.summary;
    this.attachments = data.attachments || 0;
  }
}

module.exports = MessageSummary;

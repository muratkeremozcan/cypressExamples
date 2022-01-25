const MessageAddress = require('./messageAddress');
const MessageContent = require('./messageContent');
const Attachment = require('./attachment');
const Metadata = require('./metadata');

class Message {
  constructor(data = {}) {
    this.id = data.id;
    this.from = (data.from || []).map((i) => (new MessageAddress(i)));
    this.to = (data.to || []).map((i) => (new MessageAddress(i)));
    this.cc = (data.cc || []).map((i) => (new MessageAddress(i)));
    this.bcc = (data.bcc || []).map((i) => (new MessageAddress(i)));
    this.received = new Date(data.received);
    this.subject = data.subject;
    this.html = new MessageContent(data.html);
    this.text = new MessageContent(data.text);
    this.attachments = (data.attachments || []).map((i) => (new Attachment(i)));
    this.metadata = new Metadata(data.metadata);
    this.server = data.server;
  }
}

module.exports = Message;

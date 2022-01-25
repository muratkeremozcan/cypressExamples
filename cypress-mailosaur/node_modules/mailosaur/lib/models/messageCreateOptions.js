class MessageCreateOptions {
  constructor(data = {}) {
    this.to = data.to;
    this.send = data.send;
    this.subject = data.subject;
    this.text = data.text;
    this.html = data.html;
    this.attachments = data.attachments;
  }
}

module.exports = MessageCreateOptions;

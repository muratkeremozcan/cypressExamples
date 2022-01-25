class MessageReplyOptions {
  constructor(data = {}) {
    this.text = data.text;
    this.html = data.html;
    this.attachments = data.attachments;
  }
}

module.exports = MessageReplyOptions;

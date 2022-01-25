class Attachment {
  constructor(data = {}) {
    this.id = data.id;
    this.contentType = data.contentType;
    this.fileName = data.fileName;
    this.content = data.content;
    this.contentId = data.contentId;
    this.length = data.length;
    this.url = data.url;
  }
}

module.exports = Attachment;

class Files {
  constructor(client) {
    this.client = client;
  }

  getAttachment(attachmentId) {
    const self = this;
    const url = `api/files/attachments/${attachmentId}`;

    return new Promise((resolve, reject) => {
      self.client.request.get(url, { buffer: true }, (err, response, body) => (
        err ? reject(err) : resolve(body)
      ));
    });
  }

  getEmail(messageId) {
    const self = this;
    const url = `api/files/email/${messageId}`;

    return new Promise((resolve, reject) => {
      self.client.request.get(url, { buffer: true }, (err, response, body) => (
        err ? reject(err) : resolve(body)
      ));
    });
  }
}

module.exports = Files;

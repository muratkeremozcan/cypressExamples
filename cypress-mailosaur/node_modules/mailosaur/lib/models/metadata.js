const MessageAddress = require('./messageAddress');
const MessageHeader = require('./messageHeader');

class Metadata {
  constructor(data = {}) {
    this.headers = (data.headers || []).map((i) => (new MessageHeader(i)));
    this.ehlo = data.ehlo;
    this.mailFrom = data.mailFrom;
    this.rcptTo = (data.rcptTo || []).map((i) => (new MessageAddress(i)));
  }
}

module.exports = Metadata;

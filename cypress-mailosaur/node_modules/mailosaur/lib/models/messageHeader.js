class MessageHeader {
  constructor(data = {}) {
    this.field = data.field;
    this.value = data.value;
  }
}

module.exports = MessageHeader;

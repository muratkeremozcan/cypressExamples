class MessageAddress {
  constructor(data = {}) {
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
  }
}

module.exports = MessageAddress;

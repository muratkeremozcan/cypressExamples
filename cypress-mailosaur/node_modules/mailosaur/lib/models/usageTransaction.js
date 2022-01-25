class UsageTransaction {
  constructor(data = {}) {
    this.timestamp = new Date(data.timestamp);
    this.email = data.email || 0;
    this.sms = data.sms || 0;
  }
}

module.exports = UsageTransaction;

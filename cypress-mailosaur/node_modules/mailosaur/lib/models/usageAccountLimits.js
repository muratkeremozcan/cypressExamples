const UsageAccountLimit = require('./usageAccountLimit');

class UsageAccountLimits {
  constructor(data = {}) {
    this.servers = new UsageAccountLimit(data.servers);
    this.users = new UsageAccountLimit(data.users);
    this.email = new UsageAccountLimit(data.email);
    this.sms = new UsageAccountLimit(data.sms);
  }
}

module.exports = UsageAccountLimits;

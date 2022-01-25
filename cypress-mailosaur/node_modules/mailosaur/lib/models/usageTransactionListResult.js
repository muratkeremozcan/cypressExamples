const UsageTransaction = require('./usageTransaction');

class UsageTransactionListResult {
  constructor(data = {}) {
    this.items = (data.items || []).map((i) => (new UsageTransaction(i)));
  }
}

module.exports = UsageTransactionListResult;

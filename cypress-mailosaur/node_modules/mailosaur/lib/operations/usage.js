const UsageAccountLimits = require('../models/usageAccountLimits');
const UsageTransactionListResult = require('../models/usageTransactionListResult');

class Usage {
  constructor(client) {
    this.client = client;
  }

  limits() {
    const self = this;
    const url = `api/usage/limits`;

    return new Promise((resolve, reject) => {
      self.client.request.get(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || self.client.httpError(response));
        }
        resolve(new UsageAccountLimits(body));
      });
    });
  }

  transactions() {
    const self = this;
    const url = `api/usage/transactions`;

    return new Promise((resolve, reject) => {
      self.client.request.get(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || self.client.httpError(response));
        }
        resolve(new UsageTransactionListResult(body));
      });
    });
  }
}

module.exports = Usage;

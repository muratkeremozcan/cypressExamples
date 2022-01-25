const SpamAssassinRule = require('./spamAssassinRule');

class SpamFilterResults {
  constructor(data = {}) {
    this.spamAssassin = (data.spamAssassin || []).map((i) => (new SpamAssassinRule(i)));
  }
}

module.exports = SpamFilterResults;

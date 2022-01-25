const SpamFilterResults = require('./spamFilterResults');

class SpamAnalysisResult {
  constructor(data = {}) {
    this.spamFilterResults = new SpamFilterResults(data.spamFilterResults);
    this.score = data.score || 0;
  }
}

module.exports = SpamAnalysisResult;

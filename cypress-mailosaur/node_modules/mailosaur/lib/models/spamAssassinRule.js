class SpamAssassinRule {
  constructor(data = {}) {
    this.score = data.score || 0;
    this.rule = data.rule;
    this.description = data.description;
  }
}

module.exports = SpamAssassinRule;

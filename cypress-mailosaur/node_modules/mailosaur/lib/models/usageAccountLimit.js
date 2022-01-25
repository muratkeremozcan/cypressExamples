class UsageAccountLimit {
  constructor(data = {}) {
    this.limit = data.limit || 0;
    this.current = data.current || 0;
  }
}

module.exports = UsageAccountLimit;

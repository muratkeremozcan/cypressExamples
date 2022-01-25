const Server = require('./server');

class ServerListResult {
  constructor(data = {}) {
    this.items = (data.items || []).map((i) => (new Server(i)));
  }
}

module.exports = ServerListResult;

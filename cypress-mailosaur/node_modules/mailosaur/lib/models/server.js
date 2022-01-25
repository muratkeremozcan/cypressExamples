class Server {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.users = data.users;
    this.messages = data.messages;
  }
}

module.exports = Server;

const ServerListResult = require('../models/serverListResult');
const Server = require('../models/server');

class Servers {
  constructor(client) {
    this.client = client;
  }

  list() {
    const self = this;
    const url = `api/servers`;

    return new Promise((resolve, reject) => {
      self.client.request.get(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || self.client.httpError(response));
        }
        resolve(new ServerListResult(body));
      });
    });
  }

  create(options) {
    const self = this;
    const url = `api/servers`;

    return new Promise((resolve, reject) => {
      self.client.request.post(url, { body: options }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || self.client.httpError(response));
        }
        resolve(new Server(body));
      });
    });
  }

  get(serverId) {
    const self = this;
    const url = `api/servers/${serverId}`;

    return new Promise((resolve, reject) => {
      self.client.request.get(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || self.client.httpError(response));
        }
        resolve(new Server(body));
      });
    });
  }

  getPassword(serverId) {
    const self = this;
    const url = `api/servers/${serverId}/password`;

    return new Promise((resolve, reject) => {
      self.client.request.get(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || self.client.httpError(response));
        }
        resolve(body.value);
      });
    });
  }

  update(serverId, server) {
    const self = this;
    const url = `api/servers/${serverId}`;

    return new Promise((resolve, reject) => {
      self.client.request.put(url, { body: server }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || self.client.httpError(response));
        }
        resolve(new Server(body));
      });
    });
  }

  del(serverId) {
    const self = this;
    const url = `api/servers/${serverId}`;

    return new Promise((resolve, reject) => {
      self.client.request.del(url, (err, response) => {
        if (err || response.statusCode !== 204) {
          return reject(err || self.client.httpError(response));
        }
        resolve();
      });
    });
  }

  generateEmailAddress(serverId) {
    const host = process.env.MAILOSAUR_SMTP_HOST || 'mailosaur.net';
    const random = (Math.random() + 1).toString(36).substring(7);
    return `${random}@${serverId}.${host}`;
  }
}

module.exports = Servers;

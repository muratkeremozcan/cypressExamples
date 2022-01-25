const models = require('./models');
const operations = require('./operations');
const Request = require('./request');
const MailosaurError = require('./models/mailosaurError');

class MailosaurClient {
  constructor(apiKey, baseUrl) {
    if (!apiKey) {
      throw new Error('\'apiKey\' must be set.');
    }

    this.request = new Request({
      baseUrl: baseUrl || 'https://mailosaur.com/',
      apiKey
    });

    this.analysis = new operations.Analysis(this);
    this.files = new operations.Files(this);
    this.messages = new operations.Messages(this);
    this.servers = new operations.Servers(this);
    this.usage = new operations.Usage(this);
    this.models = models;
  }

  httpError(response) {
    const httpStatusCode = response.statusCode;
    const httpResponseBody = response.body ? JSON.stringify(response.body) : null;

    switch (httpStatusCode) {
      case 400:
        return new MailosaurError('Request had one or more invalid parameters.', 'invalid_request', httpStatusCode, httpResponseBody);
      case 401:
        return new MailosaurError('Authentication failed, check your API key.', 'authentication_error', httpStatusCode, httpResponseBody);
      case 403:
        return new MailosaurError('Insufficient permission to perform that task.', 'permission_error', httpStatusCode, httpResponseBody);
      case 404:
        return new MailosaurError('Request did not find any matching resources.', 'invalid_request', httpStatusCode, httpResponseBody);
      default:
        return new MailosaurError('An API error occurred, see httpResponse for further information.', 'api_error', httpStatusCode, httpResponseBody);
    }
  }
}

MailosaurClient.default = MailosaurClient;
module.exports = MailosaurClient;

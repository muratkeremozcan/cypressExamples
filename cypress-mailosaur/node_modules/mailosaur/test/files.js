const { assert } = require('chai');
const MailosaurClient = require('../lib/mailosaur');
const mailer = require('./mailer');

const outputError = (done) => (err) => {
  // eslint-disable-next-line no-console
  console.log(err.errorType, err.httpStatusCode, err.httpResponseBody);
  done(err);
};

describe('files', () => {
  const apiKey = process.env.MAILOSAUR_API_KEY;
  const server = process.env.MAILOSAUR_SERVER;
  const baseUrl = process.env.MAILOSAUR_BASE_URL || 'https://mailosaur.com/';
  let client;
  let email;

  before((done) => {
    let testEmailAddress;

    if (!apiKey || !server) {
      throw new Error('Missing necessary environment variables - refer to README.md');
    }

    client = new MailosaurClient(apiKey, baseUrl);

    client.messages.deleteAll(server)
      .then(() => {
        const host = process.env.MAILOSAUR_SMTP_HOST || 'mailosaur.net';
        testEmailAddress = `files_test@${server}.${host}`;
        return mailer.sendEmail(client, server, testEmailAddress);
      })
      .then(() => (
        client.messages.get(server, {
          sentTo: testEmailAddress
        })
      ))
      .then((result) => {
        email = result;
        done();
      })
      .catch(outputError(done));
  });

  describe('getEmail', () => {
    it('should return a file', (done) => {
      client.files.getEmail(email.id)
        .then((result) => {
          assert.isOk(result);
          assert.isTrue(result.length > 1);
          assert.isTrue(result.indexOf(email.subject) !== -1);
          done();
        })
        .catch(outputError(done));
    });
  });

  describe('getAttachment', () => {
    it('should return a file', (done) => {
      const attachment = email.attachments[0];

      client.files.getAttachment(attachment.id)
        .then((result) => {
          assert.isOk(result);
          assert.equal(result.length, attachment.length);
          done();
        })
        .catch(outputError(done));
    });
  });
});

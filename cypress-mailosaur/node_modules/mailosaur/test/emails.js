const fs = require('fs');
const path = require('path');
const { assert } = require('chai');
const MailosaurClient = require('../lib/mailosaur');
const MailosaurError = require('../lib/models/mailosaurError');
const mailer = require('./mailer');

const isoDateString = new Date().toISOString().slice(0, 10);

const outputError = (done) => (err) => {
  // eslint-disable-next-line no-console
  console.log(err.errorType, err.httpStatusCode, err.httpResponseBody);
  done(err);
};

const validateHtml = (email) => {
  // Body
  assert.match(email.html.body, /^<div dir="ltr">/, 'HTML body should match');

  // Links
  assert.equal(email.html.links.length, 3, 'Should have HTML links');
  assert.equal(email.html.links[0].href, 'https://mailosaur.com/', 'First link should have href');
  assert.equal(email.html.links[0].text, 'mailosaur', 'First link should have text');
  assert.equal(email.html.links[1].href, 'https://mailosaur.com/', 'Second link should have href');
  assert.isNull(email.html.links[1].text, 'Second link should have no text');
  assert.equal(email.html.links[2].href, 'http://invalid/', 'Third link should have href');
  assert.equal(email.html.links[2].text, 'invalid', 'Third link should have text');

  // Images
  assert.match(email.html.images[1].src, /cid:/);
  assert.equal(email.html.images[1].alt, 'Inline image 1', 'Second image should have alt text');
};

const validateText = (email) => {
  // Body
  assert.match(email.text.body, /^this is a test/);

  // Links
  assert.equal(email.text.links.length, 2, 'Should have Text links');
  assert.equal(email.text.links[0].href, 'https://mailosaur.com/', 'First link should have href');
  assert.equal(email.text.links[0].text, email.text.links[0].href, 'First text link href & text should match');
  assert.equal(email.text.links[1].href, 'https://mailosaur.com/', 'Second link should have href');
  assert.equal(email.text.links[1].text, email.text.links[1].href, 'Second text link href & text should match');
};

const validateHeaders = (email) => {
  const expectedFromHeader = `${email.from[0].name} <${email.from[0].email}>`;
  const expectedToHeader = `${email.to[0].name} <${email.to[0].email}>`;
  const { headers } = email.metadata;

  assert.equal(headers.find(h => h.field.toLowerCase() === 'from').value, expectedFromHeader, 'From header should be accurate');
  assert.equal(headers.find(h => h.field.toLowerCase() === 'to').value, expectedToHeader, 'To header should be accurate');
  assert.equal(headers.find(h => h.field.toLowerCase() === 'subject').value, email.subject, 'Subject header should be accurate');
};

const validateMetadata = (email) => {
  assert.equal(email.from.length, 1);
  assert.equal(email.to.length, 1);
  assert.isNotEmpty(email.from[0].email);
  assert.isNotEmpty(email.from[0].name);
  assert.isNotEmpty(email.to[0].email);
  assert.isNotEmpty(email.to[0].name);
  assert.isNotEmpty(email.subject);
  assert.isNotEmpty(email.server);

  assert.equal(email.received.toISOString().slice(0, 10), isoDateString);
};

const validateAttachments = (email) => {
  assert.equal(email.attachments.length, 2, 'Should have attachments');

  const file1 = email.attachments[0];
  assert.isOk(file1.id, 'First attachment should have file id');
  assert.isOk(file1.url);
  assert.equal(file1.length, 82138, 'First attachment should be correct size');
  assert.equal(file1.fileName, 'cat.png', 'First attachment should have filename');
  assert.equal(file1.contentType, 'image/png', 'First attachment should have correct MIME type');

  const file2 = email.attachments[1];
  assert.isOk(file2.id, 'Second attachment should have file id');
  assert.isOk(file2.url);
  assert.equal(file2.length, 212080, 'Second attachment should be correct size');
  assert.equal(file2.fileName, 'dog.png', 'Second attachment should have filename');
  assert.equal(file2.contentType, 'image/png', 'Second attachment should have correct MIME type');
};

const validateEmail = (email) => {
  validateMetadata(email);
  validateAttachments(email);
  validateHtml(email);
  validateText(email);
  assert.isOk(email.metadata.ehlo, 'ehlo is empty');
  assert.isOk(email.metadata.mailFrom, 'mailFrom is empty');
  assert.equal(email.metadata.rcptTo.length, 1);
};

const validateEmailSummary = (email) => {
  validateMetadata(email);
  assert.isNotEmpty(email.summary);
  assert.equal(email.attachments, 2);
};

describe('emails', () => {
  const apiKey = process.env.MAILOSAUR_API_KEY;
  const server = process.env.MAILOSAUR_SERVER;
  const baseUrl = process.env.MAILOSAUR_BASE_URL || 'https://mailosaur.com/';
  const verifiedDomain = process.env.MAILOSAUR_VERIFIED_DOMAIN;
  let client;
  let emails;

  before((done) => {
    if (!apiKey || !server) {
      throw new Error('Missing necessary environment variables - refer to README.md');
    }

    client = new MailosaurClient(apiKey, baseUrl);

    client.messages.deleteAll(server)
      .then(() => (
        mailer.sendEmails(mailer, client, server, 5)
      ))
      .then(() => (
        client.messages.list(server)
      ))
      .then((result) => {
        emails = result.items;
        emails.forEach(validateEmailSummary);
        done();
      })
      .catch(outputError(done));
  });

  describe('list', () => {
    it('should filter on older received after date', (done) => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 10);
      client.messages.list(server, { receivedAfter: pastDate })
        .then((result) => {
          assert.isTrue(result.items.length > 0);
          done();
        })
        .catch(outputError(done));
    });

    it('should filter on received after date', (done) => {
      const d = new Date();
      d.setSeconds(d.getSeconds() + 60);
      client.messages.list(server, { receivedAfter: d })
        .then((result) => {
          assert.equal(result.items.length, 0);
          done();
        })
        .catch(outputError(done));
    });
  });

  describe('get', () => {
    it('should return a match once found', (done) => {
      const host = process.env.MAILOSAUR_SMTP_HOST || 'mailosaur.net';
      const testEmailAddress = `wait_for_test@${server}.${host}`;
      mailer.sendEmail(client, server, testEmailAddress)
        .then(() => (
          client.messages.get(server, {
            sentTo: testEmailAddress
          })
        ))
        .then((email) => {
          validateEmail(email);
          done();
        })
        .catch(outputError(done));
    });
  });

  describe('getById', () => {
    it('should return a single email', (done) => {
      client.messages.getById(emails[0].id)
        .then((email) => {
          validateEmail(email);
          validateHeaders(email);
          done();
        })
        .catch(outputError(done));
    });

    it('should throw an error if email not found', (done) => {
      client.messages.getById('efe907e9-74ed-4113-a3e0-a3d41d914765')
        .catch((err) => {
          assert.instanceOf(err, MailosaurError);
          done();
        });
    });
  });

  describe('search', () => {
    it('should throw an error if no criteria', (done) => {
      client.messages
        .search(server, {})
        .catch((err) => {
          assert.instanceOf(err, MailosaurError);
          done();
        });
    });

    it('should throw a meaningful error if the timeout is reached', (done) => {
      const testFromEmail = 'zzyy@test.com';
      client.messages
        .search(server, {
          sentFrom: testFromEmail
        }, {
          timeout: 1,
        })
        .catch((err) => {
          assert.instanceOf(err, MailosaurError);
          assert.equal(err.message, `No matching messages found in time. By default, only messages received in the last hour are checked (use receivedAfter to override this). The search criteria used for this query was [{"sentFrom":"${testFromEmail}"}] which timed out after 1ms`);
          done();
        });
    });

    it('should return empty array if errors suppressed', (done) => {
      client.messages.search(server, {
        sentTo: 'neverfound@example.com'
      }, {
        timeout: 1,
        errorOnTimeout: false
      })
        .then((result) => {
          assert.equal(result.items.length, 0);
          done();
        })
        .catch(outputError(done));
    });

    describe('by sentFrom', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        client.messages
          .search(server, {
            sentFrom: targetEmail.from[0].email
          })
          .then((result) => {
            assert.equal(result.items.length, 1);
            assert.equal(result.items[0].from[0].email, targetEmail.from[0].email);
            assert.equal(result.items[0].subject, targetEmail.subject);
            done();
          })
          .catch(outputError(done));
      });

      it('should throw an error on invalid email address', (done) => {
        client.messages
          .search(server, {
            sentFrom: '.not_an_email_address'
          })
          .catch((err) => {
            assert.instanceOf(err, MailosaurError);
            done();
          });
      });
    });

    describe('by sentTo', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        client.messages
          .search(server, {
            sentTo: targetEmail.to[0].email
          })
          .then((result) => {
            assert.equal(result.items.length, 1);
            assert.equal(result.items[0].to[0].email, targetEmail.to[0].email);
            assert.equal(result.items[0].subject, targetEmail.subject);
            done();
          })
          .catch(outputError(done));
      });

      it('should throw an error on invalid email address', (done) => {
        client.messages
          .search(server, {
            sentTo: '.not_an_email_address'
          })
          .catch((err) => {
            assert.instanceOf(err, MailosaurError);
            done();
          });
      });
    });

    describe('by body', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        const uniqueString = targetEmail.subject.substr(0, targetEmail.subject.indexOf(' subject'));
        client.messages
          .search(server, {
            body: `${uniqueString} html`
          })
          .then((result) => {
            assert.equal(result.items.length, 1);
            assert.equal(result.items[0].to[0].email, targetEmail.to[0].email);
            assert.equal(result.items[0].subject, targetEmail.subject);
            done();
          })
          .catch(outputError(done));
      });
    });

    describe('by subject', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        const uniqueString = targetEmail.subject.substr(0, targetEmail.subject.indexOf(' subject'));
        client.messages
          .search(server, {
            subject: uniqueString
          })
          .then((result) => {
            assert.equal(result.items.length, 1);
            assert.equal(result.items[0].to[0].email, targetEmail.to[0].email);
            assert.equal(result.items[0].subject, targetEmail.subject);
            done();
          })
          .catch(outputError(done));
      });
    });

    describe('with match all', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        const uniqueString = targetEmail.subject.substr(0, targetEmail.subject.indexOf(' subject'));
        client.messages
          .search(server, {
            subject: uniqueString,
            body: 'this is a link',
            match: 'ALL'
          })
          .then((result) => {
            assert.equal(result.items.length, 1);
            done();
          })
          .catch(outputError(done));
      });
    });

    describe('with match any', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        const uniqueString = targetEmail.subject.substr(0, targetEmail.subject.indexOf(' subject'));
        client.messages
          .search(server, {
            subject: uniqueString,
            body: 'this is a link',
            match: 'ANY'
          })
          .then((result) => {
            assert.equal(result.items.length, 6);
            done();
          })
          .catch(outputError(done));
      });
    });

    describe('with special characters', () => {
      it('should support special characters', (done) => {
        client.messages
          .search(server, {
            subject: 'Search with ellipsis … and emoji 👨🏿‍🚒'
          })
          .then((result) => {
            assert.equal(result.items.length, 0);
            done();
          })
          .catch(outputError(done));
      });
    });
  });

  describe('spamAnalysis', () => {
    it('should perform a spam analysis on an email', (done) => {
      const targetId = emails[0].id;
      client.analysis.spam(targetId)
        .then((result) => {
          result.spamFilterResults.spamAssassin.forEach((rule) => {
            assert.isNumber(rule.score);
            assert.isOk(rule.rule);
            assert.isOk(rule.description);
          });

          done();
        })
        .catch(outputError(done));
    });
  });

  describe('del', () => {
    it('should delete an email', (done) => {
      const targetEmailId = emails[4].id;

      client.messages.del(targetEmailId)
        .then(done)
        .catch(outputError(done));
    });

    it('should fail if attempting to delete again', (done) => {
      const targetEmailId = emails[4].id;

      client.messages.del(targetEmailId)
        .catch((err) => {
          assert.instanceOf(err, MailosaurError);
          done();
        });
    });
  });

  (verifiedDomain ? describe : describe.skip)('create and send', () => {
    it('send with text content', (done) => {
      const subject = 'New message';
      client.messages.create(server, {
        to: `anything@${verifiedDomain}`,
        send: true,
        subject,
        text: 'This is a new email'
      })
        .then((message) => {
          assert.isNotEmpty(message.id);
          assert.equal(message.subject, subject);
          done();
        })
        .catch(outputError(done));
    });

    it('send with HTML content', (done) => {
      const subject = 'New HTML message';
      client.messages.create(server, {
        to: `anything@${verifiedDomain}`,
        send: true,
        subject,
        html: '<p>This is a new email.</p>'
      })
        .then((message) => {
          assert.isNotEmpty(message.id);
          assert.equal(message.subject, subject);
          done();
        })
        .catch(outputError(done));
    });

    it('send with attachment', (done) => {
      const subject = 'New message with attachment';

      const buffer = fs.readFileSync(path.join(__dirname, '/resources/cat.png'));
      const attachment = {
        fileName: 'cat.png',
        content: buffer.toString('base64'),
        contentType: 'image/png'
      };

      client.messages.create(server, {
        to: `anything@${verifiedDomain}`,
        send: true,
        subject,
        html: '<p>This is a new email.</p>',
        attachments: [attachment]
      })
        .then((message) => {
          assert.equal(message.attachments.length, 1, 'Should have attachment');
          const file1 = message.attachments[0];
          assert.isOk(file1.id, 'First attachment should have file id');
          assert.isOk(file1.url);
          assert.equal(file1.length, 82138, 'First attachment should be correct size');
          assert.equal(file1.fileName, 'cat.png', 'First attachment should have filename');
          assert.equal(file1.contentType, 'image/png', 'First attachment should have correct MIME type');
          done();
        })
        .catch(outputError(done));
    });
  });

  (verifiedDomain ? describe : describe.skip)('forward', () => {
    it('forward with text content', (done) => {
      const targetEmailId = emails[0].id;
      const body = 'Forwarded message';

      client.messages.forward(targetEmailId, {
        to: `anything@${verifiedDomain}`,
        text: body
      })
        .then((message) => {
          assert.isNotEmpty(message.id);
          assert.isTrue(message.text.body.indexOf(body) >= 0);
          done();
        })
        .catch(outputError(done));
    });

    it('forward with HTML content', (done) => {
      const targetEmailId = emails[0].id;
      const body = '<p>Forwarded <strong>HTML</strong> message.</p>';

      client.messages.forward(targetEmailId, {
        to: `anything@${verifiedDomain}`,
        html: body
      })
        .then((message) => {
          assert.isNotEmpty(message.id);
          assert.isTrue(message.html.body.indexOf(body) >= 0);
          done();
        })
        .catch(outputError(done));
    });
  });

  (verifiedDomain ? describe : describe.skip)('reply', () => {
    it('reply with text content', (done) => {
      const targetEmailId = emails[0].id;
      const body = 'Reply message';

      client.messages.reply(targetEmailId, {
        text: body
      })
        .then((message) => {
          assert.isNotEmpty(message.id);
          assert.isTrue(message.text.body.indexOf(body) >= 0);
          done();
        })
        .catch(outputError(done));
    });

    it('reply with HTML content', (done) => {
      const targetEmailId = emails[0].id;
      const body = '<p>Reply <strong>HTML</strong> message.</p>';

      client.messages.reply(targetEmailId, {
        html: body
      })
        .then((message) => {
          assert.isNotEmpty(message.id);
          assert.isTrue(message.html.body.indexOf(body) >= 0);
          done();
        })
        .catch(outputError(done));
    });

    it('reply with attachment', (done) => {
      const targetEmailId = emails[0].id;

      const buffer = fs.readFileSync(path.join(__dirname, '/resources/cat.png'));
      const attachment = {
        fileName: 'cat.png',
        content: buffer.toString('base64'),
        contentType: 'image/png'
      };

      client.messages.reply(targetEmailId, {
        html: '<p>This is a reply with attachment.</p>',
        attachments: [attachment]
      })
        .then((message) => {
          assert.equal(message.attachments.length, 1, 'Should have attachment');
          const file1 = message.attachments[0];
          assert.isOk(file1.id, 'First attachment should have file id');
          assert.isOk(file1.url);
          assert.equal(file1.length, 82138, 'First attachment should be correct size');
          assert.equal(file1.fileName, 'cat.png', 'First attachment should have filename');
          assert.equal(file1.contentType, 'image/png', 'First attachment should have correct MIME type');
          done();
        })
        .catch(outputError(done));
    });
  });
});

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const sendmail = require('sendmail')({
  logger: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  },
  silent: false
});

const customHtml = '<div class="content">' +
'<h1>This is a heading</h1>' +
'<p>This is a paragraph of text.</p>' +
'<p><strong>Note:</strong> If you don\'t escape "quotes" properly, it will not work.</p>' +
'</div>';
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    // check out node-sendmail for more varieties https://www.npmjs.com/package/sendmail#examples
    // usually your application would send these emails. This is just so that you have a playground


    sendSimpleEmail(targetEmail) {
      sendmail({
        from: 'test@nodesendmail.com',
        to: targetEmail,
        replyTo: 'jason@yourdomain.com',
        subject: 'MailComposer sendmail',
        html: customHtml
      }, function (err, reply) {
        console.log(err && err.stack)
        console.dir(reply)
      });
      return true;
    },

    sendEMailWithAttachment(targetEmail) {
      sendmail({
        from: 'test@yourdomain.com',
        to: targetEmail,
        replyTo: 'jason@yourdomain.com',
        subject: 'MailComposer sendmail',
        html: customHtml,
        attachments: [
          {   // utf-8 string as an attachment
            filename: 'text1.txt',
            content: 'hello world!'
          },
          {   // binary buffer as an attachment
            filename: 'text2.txt',
            content: new Buffer('hello world!', 'utf-8')
          },
          // {   // file on disk as an attachment
          //     filename: 'text3.txt',
          //     path: '/path/to/file.txt' // stream this file
          // },
          // {   // filename and content type is derived from path
          //     path: '/path/to/file.txt'
          // },
          {   // define custom content type for the attachment
            filename: 'text.bin',
            content: 'hello world!',
            contentType: 'text/plain'
          },
          {   // use URL as an attachment
            filename: 'license.txt',
            path: 'https://raw.github.com/guileen/node-sendmail/master/LICENSE'
          },
          {   // encoded string as an attachment
            filename: 'text1.txt',
            content: 'aGVsbG8gd29ybGQh',
            encoding: 'base64'
          },
          {   // data uri as an attachment
            path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
          }
        ]
      }, function (err, reply) {
        console.log(err && err.stack)
        console.dir(reply)
      })
      return true;
    }
  })
}

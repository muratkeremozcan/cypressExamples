
const MailosaurClient = require('mailosaur');
const envVars = require('../../cypress.env.json'); // use static file like this. GitLab env var approach is problematic.
const mailosaurClient = new MailosaurClient(envVars.MAILOSAUR_API_KEY);

// you can add all of the Node examples from Mailosaur getting started as cypress tasks
// https://docs.mailosaur.com/docs/development

// the format can also be:  checkServerName() {..}
/** generates a random email address for each test */
const createEmail = () => {
  return mailosaurClient.servers.generateEmailAddress(envVars.MAILOSAUR_SERVERID);
};

// https://docs.mailosaur.com/docs/fetching-messages more options here
/** finds the most recent email message */
const findEmailToUser = async (userEmail) => {
  let message = await mailosaurClient.messages.get(envVars.MAILOSAUR_SERVERID, {
    sentTo: userEmail
  }, { timeout: 25000 });
  return message;
};

/** given a message id, deletes the message */
const deleteAMessage = async (id) => {
  return await mailosaurClient.messages.del(id);
}

/** lists all email messages at mailosaur */
const listAllMessages = () => {
  return mailosaurClient.messages.list(envVars.MAILOSAUR_SERVERID)
    .then(result => {
      let messages = result.items;
      return messages;
    });
}

/** checks for test server name */
const checkServerName = async () => {
  let result = await mailosaurClient.servers.list();
  return (result.items[0].name);
};

const findMessage = async (userEmail) => {
  let message = await mailosaurClient.messages.get(envVars.MAILOSAUR_SERVERID, {
    sentTo: userEmail
  }, { timeout: 25000});
  return message;
};

module.exports = { createEmail, findEmailToUser, listAllMessages, deleteAMessage, checkServerName, findMessage };

import * as stream from 'stream';
import * as models from '../models';

/**
 * Message analysis operations.
 */
export interface Analysis {
  /**
   * Perform a spam analysis of an email.
   */
  spam(
    /**
     * The identifier of the message to be analyzed.
     */
    messageId: string
  ): Promise<models.SpamAnalysisResult>;
}

/**
 * File operations.
 */
export interface Files {
  /**
   * Downloads a single attachment.
   */
  getAttachment(
    /**
     * The identifier for the required attachment.
     */
    attachmentId: string
  ): Promise<stream.Readable>;

  /**
   * Downloads an EML file representing the specified email.
   */
  getEmail(
    /**
     * The identifier for the required message.
     */
    messageId: string
  ): Promise<stream.Readable>;
}

export interface Messages {
  /**
   * Waits for a message to be found. Returns as soon as a message matching the specified search criteria is found.
   * **Recommended:** This is the most efficient method of looking up a message, therefore we recommend using it wherever possible.
   */
  get(
    /**
     * The unique identifier of the containing server.
     */
    serverId: string,
    /**
     * The criteria with which to find messages during a search.
     */
    criteria: models.SearchCriteria,
    /**
     * Search options
     */
    options?: models.SearchOptions
  ): Promise<models.Message>;

  /**
   * Retrieves the detail for a single message. Must be used in conjunction with either list or
   * search in order to get the unique identifier for the required message.
   */
  getById(
    /**
     * The unique identifier of the message to be retrieved.
     */
    messageId: string
  ): Promise<models.Message>;

  /**
   * Permanently deletes a message. Also deletes any attachments related to the message. This operation cannot be undone.
   */
  del(
    /**
     * The identifier for the message.
     */
    messageId: string
  ): Promise<void>;

  /**
   * Returns a list of your messages in summary form. The summaries are returned sorted by received date, with the most recently-received messages appearing first.
   */
  list(
    /**
     * The unique identifier of the required server.
     */
    server: string,
    /**
     * Message listing options
     */
    options?: models.MessageListOptions
  ): Promise<models.MessageListResult>;

  /**
   * Permenantly delete all messages within a server.
   */
  deleteAll(
    /**
     * The unique identifier of the server.
     */
    serverId: string
  ): Promise<void>;

  /**
   * Returns a list of messages matching the specified search criteria, in summary form.
   * The messages are returned sorted by received date, with the most recently-received messages appearing first.
   */
  search(
    /**
     * The unique identifier of the server to search.
     */
    serverId: string,
    /**
     * The criteria with which to find messages during a search.
     */
    criteria: models.SearchCriteria,
    /**
     * Search options
     */
    options?: models.SearchOptions
  ): Promise<models.MessageListResult>;

  /**
   * Creates a new message that can be sent to a verified email address. This is useful
   * in scenarios where you want an email to trigger a workflow in your product.
   */
  create(
    /**
     * The unique identifier of the required server.
     */
    serverId: string,
    /**
     * Options to use when creating a new message.
     */
    options: models.MessageCreateOptions
  ): Promise<models.Message>;

  forward(
    /**
     * The unique identifier of the message to be forwarded.
     */
    messageId: string,
    /**
     * Options to use when forwarding a message.
     */
    options: models.MessageForwardOptions
  ): Promise<models.Message>;

  /**
   * Sends a reply to the specified message. This is useful for when simulating a user replying to one of your email or SMS messages.
   */
  reply(
    /**
     * The unique identifier of the message to be forwarded.
     */
    messageId: string,
    /**
     * Options to use when replying to a message.
     */
    options: models.MessageReplyOptions
  ): Promise<models.Message>;
}

export interface Servers {
  /**
   * Returns a list of your virtual servers. Servers are returned sorted in alphabetical order.
   */
  list(
  ): Promise<models.ServerListResult>;

  /**
   * Creates a new virtual server.
   */
  create(
    /**
     * Options used to create a new Mailosaur server.
     */
    options: models.ServerCreateOptions
  ): Promise<models.Server>;

  /**
   * Retrieves the detail for a single server.
   */
  get(
    /**
     * The unique identifier of the server.
     */
    serverId: string
  ): Promise<models.Server>;

  /**
   * Retrieves the password for a server. This password can be used for SMTP, POP3, and IMAP connectivity.
   */
  getPassword(
    /**
     * The unique identifier of the server.
     */
    serverId: string
  ): Promise<string>;

  /**
   * Updates the attributes of a server.
   */
  update(
    /**
     * The unique identifier of the server.
     */
    serverId: string,
    /**
     * The updated server.
     */
    server: models.Server
  ): Promise<models.Server>;

  /**
   * Permanently delete a server. This will also delete all messages, associated attachments, etc. within the server. This operation cannot be undone.
   */
  del(
    /**
     * The unique identifier of the server.
     */
    serverId: string
  ): Promise<void>;

  /**
   * Generates a random email address by appending a random string in front of the server's
   * domain name.
   */
  generateEmailAddress(
    /**
     * The identifier of the server.
     */
    serverId: string
  ): string;
}

export interface Usage {
  /**
   * Retrieve account usage limits. Details the current limits and usage for your account.
   * This endpoint requires authentication with an account-level API key.
   */
  limits(
  ): Promise<models.UsageAccountLimits>;

  /**
   * Retrieves the last 31 days of transactional usage.
   * This endpoint requires authentication with an account-level API key.
   */
  transactions(
  ): Promise<models.UsageTransactionListResult>;
}

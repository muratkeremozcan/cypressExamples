/// <reference types="node" />

import * as operations from "./operations";

export = MailosaurClient;

declare class MailosaurClient {
  /**
   * Returns an instance of the Mailosaur client.
   */
  constructor(
    /**
     * Your Mailosaur API key.
     */
    apiKey: string,
    /**
     * Optionally overrides the base URL of the Mailosaur service.
     */
    baseUrl?: string
  );

  /**
   * Message analysis operations
   */
  analysis: operations.Analysis;

  /**
   * File operations
   */
  files: operations.Files;

  /**
   * Message operations
   */
  messages: operations.Messages;

  /**
   * Server management operations
   */
  servers: operations.Servers;

  /**
   * Account usage operations
   */
  usage: operations.Usage;
}

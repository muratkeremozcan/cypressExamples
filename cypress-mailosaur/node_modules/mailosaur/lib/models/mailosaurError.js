class MailosaurError extends Error {
  constructor(message, errorType, httpStatusCode = null, httpResponseBody = null) {
    super(message);

    this.errorType = errorType;
    this.httpStatusCode = httpStatusCode;
    this.httpResponseBody = httpResponseBody;
  }
}

module.exports = MailosaurError;

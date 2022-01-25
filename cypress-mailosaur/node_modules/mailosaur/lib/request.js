const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');
const pkg = require('../package.json');

class Request {
  constructor(options) {
    this.baseUrl = options.baseUrl || 'https://mailosaur.com/';
    const encodedKey = Buffer.from(`${options.apiKey}:`).toString('base64');
    this.headers = {
      Accept: 'application/json',
      Authorization: `Basic ${encodedKey}`,
      'User-Agent': options.agent || `mailosaur-node/${pkg.version}`
    };
    const httpProxy = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY;
    if (httpProxy) {
      this.proxyAgent = new HttpsProxyAgent(httpProxy);
    }
  }

  buildOptions(method, path, options = {}) {
    const result = {
      method,
      url: `${this.baseUrl}${path}`,
      headers: {
        Accept: this.headers.Accept,
        Authorization: this.headers.Authorization,
        'User-Agent': this.headers['User-Agent']
      }
    };

    if (options.buffer) {
      result.buffer = true;
    }

    if (options.qs) {
      Object.keys(options.qs).forEach((key, index) => {
        let value = options.qs[key];
        if (!value) {
          return;
        }
        if (value instanceof Date) {
          value = value.toISOString();
        }
        const prefix = !index ? '?' : '&';
        result.url += `${prefix}${key}=${value}`;
      });
    }

    if (options.body) {
      const data = JSON.stringify(options.body);
      result.data = Buffer.from(data);
      result.headers['Content-Type'] = 'application/json';
      result.headers['Content-Length'] = Buffer.byteLength(result.data);
    }

    if (this.proxyAgent) {
      result.agent = this.proxyAgent;
    }
    return result;
  }

  invoke(options, callback) {
    let urlResult;

    // Fallback to legacy parsing if `URL` not a constructor
    try {
      urlResult = new url.URL(options.url);
    } catch (e) {
      urlResult = url.parse(options.url);
    }

    // Ignoring as spread is not compatible with Node 6
    // eslint-disable-next-line prefer-object-spread
    const spread = Object.assign({}, options, {
      protocol: urlResult.protocol,
      hostname: urlResult.hostname,
      path: urlResult.pathname + urlResult.search
    });
    const req = https.request(spread, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        try {
          if (data) {
            res.body = options.buffer ?
              Buffer.concat(data) :
              JSON.parse(Buffer.concat(data).toString());
          }
        } catch (e) {
          res.body = data;
        }

        callback(null, res, res.body);
      });
    });

    req.on('error', (e) => callback(e));

    if (options.data) {
      req.write(options.data);
    }

    req.end();
  }

  request(method, path, options, callback) {
    /* eslint-disable no-param-reassign */
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }
    /* eslint-enable no-param-reassign */

    const requestOptions = this.buildOptions(method, path, options);
    this.invoke(requestOptions, callback);
  }

  get(path, options, callback) {
    this.request('GET', path, options, callback);
  }

  put(path, options, callback) {
    this.request('PUT', path, options, callback);
  }

  post(path, options, callback) {
    this.request('POST', path, options, callback);
  }

  del(path, options, callback) {
    this.request('DELETE', path, options, callback);
  }
}

module.exports = Request;

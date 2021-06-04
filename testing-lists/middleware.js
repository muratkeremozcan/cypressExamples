const sendmail = require('sendmail')();
 
module.exports = (req, res, next) => {
  
  const db = req.app.db;

  if (req.method === 'GET' && req.path === '/login') {
    return res.sendFile(`${__dirname}/index.html`);
  }

  if (req.method === 'GET' && req.path === '/signup') {
    return res.sendFile(`${__dirname}/index.html`);
  }

  if (req.method === 'POST' && req.path === '/signup') {

    if (!req.body.email || !req.body.password) {
      let response = res.status(401).jsonp({
        error: 'email and password are required'
      });
      return response;
    }

    if (db.get('accounts').find({email: req.body.email}).value()) {
      let response = res.status(409).jsonp({
        error: 'email is already taken'
      });
      return response;
    } else {

      // return auth cookie
      res.header('Set-Cookie', 'auth=true;');

      // send welcome email if header is true
      if (req.headers.sendwelcomeemail === 'true') {

        sendmail({
          from: 'todomvc@filiphric.sk',
          to: req.body.email,
          subject: 'Welcome to TodoMVC app',
          html: 'Your account was successfully created!\nIn the meantime, subscribe to my <a href="https://www.youtube.com/channel/UCDOCAVIhSh5VpJMEfdak1OA">YouTube channel for Cypress tips!</a>',
        }, function(err, reply) {
          console.log(err && err.stack);
          console.dir(reply);
        });

      }

      db.get('accounts').push(req.body).write();
      let response = res.status(201).jsonp(req.body);
      return response;
    }

  }

  if (req.method === 'POST' && req.path === '/reset') {
    db
      .setState({
        'todos': [],
        'accounts': []
      })
      .write();

    return res.sendStatus(204);
  }

  if (req.method === 'DELETE' && req.path === '/todos') {
    db.set('todos', []).write();

    return res.sendStatus(204);
  }

  if (req.method === 'POST' && req.path === '/todos/seed') {
    
    db.set('todos', req.body).write();

    return res.sendStatus(201);
  }

  if (req.method === 'DELETE' && req.path === '/accounts') {
    db.set('accounts', []).write();

    return res.sendStatus(204);
  }

  if (req.method === 'POST' && req.path === '/login') {

    if (db.get('accounts').find(req.body).value()) {
      res.header('Set-Cookie', 'auth=true;');
      let response = res.status(200).jsonp({
        message: 'User is logged in'
      });
      return response;

    } else {

      return res.sendStatus(401);

    }

  }
  
  next();
    
};
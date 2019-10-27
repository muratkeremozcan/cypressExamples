/** this is a fake server  */

var express = require("express");
var cors = require("cors");
var app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*"
  })
);

app.get("/", function(req, res) {
  // just to have start-server-and-test working
  res.send();
});

app.post("/api/authentication", function(req, res) {
  const { username, password } = req.body;
  const user = users.find(item => item.username === username);
  if (users && user && user.password === password) {
    //  just to simulate E2E tests slowness// @see
    //  https://slides.com/noriste/working-software-2019-mastering-ui-testing#ui-integration-tests
    setTimeout(() => res.send({ token: Date.now() }), 1000 + Math.random() * 2000);
  } else {
    res.status(401);
    res.send({});
  }
});

let users = [];
app.post("/e2e-tests/seed-data", function(req, res) {
  // a utility to add fake users for E2E tests
  users.push({
    username: req.body.username,
    password: req.body.password
  });

  //  just to simulate E2E tests slowness
  //  https://slides.com/noriste/working-software-2019-mastering-ui-testing#ui-integration-tests
  setTimeout(() => res.send({}), 1000 + Math.random() * 2000);
});

app.post("/e2e-tests/wipe-data", function(req, res) {
  // a utility to wipe the fake users data for E2E tests
  users = [];

  //  just to simulate E2E tests slowness
  //  https://slides.com/noriste/working-software-2019-mastering-ui-testing#ui-integration-tests
  setTimeout(() => res.send({}), 1000 + Math.random() * 2000);
});

app.listen(3001);

const http = require('http');
const pg = require('pg');

const httpServer = http.createServer((req, res) => {
  // Log all requests made to the server
  console.log(`${req.method} ${req.url}`);

  const client = new pg.Client({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  });

  function success() {
    return true;
  }

  function failure(err) {
    console.log(err.toString());
    return false
  }

  connected = client.connect().then(success, failure);
  queried = client.query("SELECT 1").then(success, failure);
  client.end().then(success, failure);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const data = {
    env : process.env,
    database: {
      connected : connected,
      queried: queried
    }
  }
  res.end(JSON.stringify(data));
});

httpServer.listen(process.env.PORT || '8080');

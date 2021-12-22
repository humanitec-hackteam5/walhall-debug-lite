const http = require('http');

async function testDatabase(user, password, database, host, port) {
  const { Pool } = require('pg')
  const pool = new Pool({
    user: user,
    password: password,
    database: database,
    host: host,
    port: port
  })

  const dbReport = {}
  await pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        dbReport.error = err.toString()
      } else {
        dbReport.result = res
      }
    })
  await pool.end()   

  return dbReport
}

const httpServer = http.createServer((req, res) => {
  // Log all requests made to the server
  console.log(`${req.method} ${req.url}`)

  testDatabase(
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    process.env.DATABASE_NAME,
    process.env.DATABASE_HOST,
    process.env.DATABASE_PORT
  )
  .then(async (dbReport) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    const data = {
      env : process.env,
      database: dbReport
    }
    res.end(JSON.stringify(data))  
  })
})

httpServer.listen(process.env.PORT || '8080')

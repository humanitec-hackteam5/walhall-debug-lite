const http = require('http');

async function testDatabase(pool) {
  const dbReport = {}
  await pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        dbReport.error = err.toString()
        dbReport.success = false
      } else {
        dbReport.success = true
      }
    })
  await pool.end()   

  return dbReport
}

const httpServer = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)

  const params = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  }

  const { Pool } = require('pg')
  const pool = new Pool(params)
  
  testDatabase(pool)
  .then(async (dbReport) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    const data = {
      params : params,
      database: dbReport
    }
    res.end(JSON.stringify(data))  
  })
})

httpServer.listen(process.env.PORT || '8080')

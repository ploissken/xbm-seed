const { Pool } = require('pg')
const pool = new Pool({
  user: 'xmo-user',
  host: 'txto.com.br',
  database: 'xmo-db',
  password: 'xmo-1337_##-pass',
  port: 5432
})
module.exports = pool

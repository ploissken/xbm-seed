const { Pool } = require('pg')
const pool = new Pool({
  user: 'xmo-user',
  host: 'txto.com.br',
  database: 'xmo-db',
  password: 'xmo-1337_##-pass',
  port: 5432
})

// usage postgres://:@:5432/
// pool.query('SELECT * FROM table_name').then(response => {
//   console.log(response.rows)
// }).catch(err => {
//   console.log(err.message)
// })

module.exports = pool

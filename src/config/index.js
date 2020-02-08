const PORT = process.env.PORT || 9000
const MODE = process.env.NODE_ENV || 'development'

const ALLOWED_ORIGINS = [
  'http://localhost/',
  'http://localhost',
  'http://localhost:3000/',
  'http://localhost:3000',
  'http://lunch.localhost/',
  'http://lunch.localhost',
  'lunch.localhost/',
  'lunch.localhost',
  'http://lunch.txto.com.br/',
  'http://lunch.txto.com.br'
]

  const corsConf = {
    credentials: true,
    origin: ALLOWED_ORIGINS
  }

  const config = {
    PORT, MODE,
    corsConf,
    cookie: {
      secret: 'here-goes-THE-secret-that-keeps-a-cookie-unique--important-stuff'
    }
  }

module.exports = config

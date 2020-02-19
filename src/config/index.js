const PORT = process.env.PORT || 9000
const MODE = process.env.NODE_ENV || 'development'

const API = process.env.NODE_ENV === 'production'
  ? 'https://xm.txto.com.br'
  : 'http://xm.localhost'

  const ALLOWED_ORIGINS = [
    'http://localhost:8080/',
    'http://localhost:8080',
    'http://lunch.localhost/',
    'http://lunch.localhost',
    'http://lunch.txto.com.br/',
    'http://lunch.txto.com.br',
    'https://lunch.txto.com.br/',
    'https://lunch.txto.com.br'
  ]

  const corsConf = {
    credentials: true,
    origin: ALLOWED_ORIGINS
  }

  const mailgunConf = {
    API_KEY: 'key-a93feda686130e147a070d02a2ba2cc6',
    DOMAIN: 'txto.com.br'
  }

  const config = {
    API, PORT, MODE,
    corsConf,
    mailgunConf,
    cookie: {
      secret: 'here-goes-THE-secret-that-keeps-a-cookie-unique--important-stuff'
    }
  }

module.exports = config

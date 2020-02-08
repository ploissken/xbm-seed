const PORT = process.env.PORT || 9000
const MODE = process.env.NODE_ENV || 'development'

const API = process.env.NODE_ENV === 'production'
  ? 'https://xm.txto.com.br'
  : 'http://xm.localhost'

  const ALLOWED_ORIGINS = [
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

  const config = {
    API, PORT, MODE,
    corsConf,
    cookie: {
      secret: 'here-goes-THE-secret-that-keeps-a-cookie-unique--important-stuff'
    }
  }

module.exports = config

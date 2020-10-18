const PORT = process.env.PORT || 9000
const MODE = process.env.NODE_ENV || 'development'

const API = process.env.NODE_ENV === 'production'
  ? 'https://xm.txto.com.br'
  : 'http://xm.localhost'

  const ALLOWED_ORIGINS = [
    'https://xmofe.txto.com.br',
    'http://xmofe.localhost',
    'http://localhost'
  ]

  const corsConf = {
    credentials: true,
    origin: ALLOWED_ORIGINS
  }

  const mailgunConf = {
    API_KEY: 'SECRET-MAILGUN-API-KEY',
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

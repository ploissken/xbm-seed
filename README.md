# Lunch King - Back-end
A [Node.js](https://nodejs.org/en/) server with a [Mongo](https://www.mongodb.com/) database, for daily elections of THE LUNCH KING.

## Project Setup in default env
You need [Node.js](https://nodejs.org/en/) installed for running these instructions.

#### Build and start for development
```
npm install && npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

## Back-end file structure
    public/avatar/       # stores user image uploads
    src
    ├── config           # server configurations
    ├── authentication   # local authentication with passport.js
    ├── database         # db connection and models definition
    ├── server           # server setup and routes handling
    └── tools            # votes counting tool

## Project Setup with Docker env
For properly building the environment, [Docker](https://www.docker.com/) and Docker-compose are mandatory. For `Windows 10 Home`, check [Windows Hyper-V limitations](https://forums.docker.com/t/installing-docker-on-windows-10-home/11722).

[Traefik](https://github.com/ploissken/traefik) container is also mandatory, for binding frontend, backend & database and generating SSL certifications. It must be started prior to the Lunch King backend and frontend.

With all these requirements met, start the server with docker-compose:

#### Building for development
```
docker-compose up
```

#### Building for production
```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

# 0xchange-server
ETHWaterloo

## Setup

`npm i`

Make a config.js file like this:
```
module.exports = {
  infuraURL: 'https://mainnet.infura.io/YOUR_TOKEN',
  pg: {  // node-postgres config
    host: '',
    user: '',
    password: '',
    database: ''
  }
}
```

## Making a PostgreSQL database
- Run a PostgreSQL server (https://www.postgresql.org/download/)
  * (the easy macOS way: http://postgresapp.com/)
- `psql -f db/createDB.sql`
- If not running server locally, set up pg config in config.js (https://node-postgres.com/api/client)

## Run server

`npm run serve`
- On port 3000 for now

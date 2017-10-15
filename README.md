# 0xchange-server
ETHWaterloo

## API reference:

`GET: /get` - gets all orders in the DB

`POST: /get` - gets some orders in the DB
  - body:
  ```
  {
    sortBy: DBColumnID
    asc: acending? true/false
    limit: numberPerPage
    page: pageNumber
  }
  ```
  - Possible sortBy columns: `makerfee`, `makertokenaddress`, `makertokenamount`, `takerfee`, `takertokenaddress`, or `takertokenamount`

`POST: /post/order` - adds new order to DB if valid
  - body: `ZeroEx.SignedOrder`


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

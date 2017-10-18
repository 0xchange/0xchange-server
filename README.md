# 0xchange-server

This is the server component of the 0xchange project for ETHWaterloo 2017!

#### We won the 0x API Prize!

- See the live site at https://0xchange.me/

- by Billy Rennekamp, Gregory Hogue, Kevin Ho, & Alex Zhao

- read more: https://devpost.com/software/0xchange-me


## API reference:

`GET: /order` - gets all orders in the DB

`POST: /order` - gets some orders in the DB
  - body:
  ```
  {
    sortBy: DBColumnID
    asc: acending? true/false
    limit: numberPerPage
    page: pageNumber
    (tokenAddress: address)
  }
  ```
  - Possible sortBy columns: `makerfee`, `makertokenaddress`, `makertokenamount`, `takerfee`, `takertokenaddress`, or `takertokenamount`

`POST: /order/new` - adds new order to DB if valid
  - body: `ZeroEx.SignedOrder`


`GET: /token` - gets all tokens in the DB

`POST: /token/new` - adds new token to DB
  - body: `address`, `symbol`, `name`, & `decimals`


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

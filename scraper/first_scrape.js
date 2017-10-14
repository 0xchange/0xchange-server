// Run this to get 0x history and then start listening to 0x.

var zeroEx = require('./util/zeroEx');

zeroEx.exchange.getLogsAsync('LogFill', {fromBlock: 4219261, toBlock: 'latest'}, {}).then((result) => {
  // Filter & write to DB
  require('./scraper.js');
}).catch((err) => {
  console.error(err);
});

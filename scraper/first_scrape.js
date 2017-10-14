var zeroEx = require('./util/zeroEx');

zeroEx.exchange.getLogsAsync('LogFill', {fromBlock: 4219261, toBlock: 'latest'}, {}).then((result) => {

}).catch((err) => {
  console.error(err);
});

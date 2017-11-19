var async = require('async-bluebird');
var processLogFill = require('./util/processLogFill.js');

var {
  ExchangeContract,
  exchangeContractGenesisBlock,
  provider
} = require('./util/ethers.js');


var error_logs = {};

var success_count = 0;

var LogFill = ExchangeContract.interface.events.LogFill();

function printErrorLogs() {
  console.log('Non-critical errors:');
  for (var error in error_logs) {
    console.log('\t'+error);
  }
}

provider.getLogs({
  address: ExchangeContract.address,
  topics: LogFill.topics,
  fromBlock: exchangeContractGenesisBlock,
  toBlock: 'latest'
}).then((logs) => {
  console.log('Got logs. Processing...');
  return async.eachLimit(logs, 10, (log, callback) => {
    processLogFill(log).then((errors) => {
      console.log('Processed', success_count);
      Object.assign(error_logs, errors);
      success_count++;
      callback();
    }).catch(callback);
  });
}).then(() => {
  printErrorLogs();
  console.log('Got', success_count, 'orders!');
  process.exit();
}).catch((err) => {
  printErrorLogs();
  console.error('CRITICAL ERROR:\n', err);
  process.exit(1);
});

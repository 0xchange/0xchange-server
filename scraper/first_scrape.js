var async = require('async-bluebird');
var {ExchangeContract, provider} = require('./util/ethers.js');
var processLogFill = require('./util/processLogFill.js');

var LogFill = ExchangeContract.interface.events.LogFill();

var error_whitelist = {  // These errors won't stop logs processing
  INSUFFICIENT_MAKER_BALANCE: true,
  INSUFFICIENT_MAKER_FEE_BALANCE: true,
  NOT_A_LOGFILL_FUNCTION: true,
  NOT_FILLORDER: true,
  ORDER_FILL_EXPIRED: true,
  ORDER_REMAINING_FILL_AMOUNT_ZERO: true,
}


var error_logs = {};

var success_count = 0;

function printErrorLogs() {
  console.log('Non-critical errors:');
  for (var error in error_logs) {
    console.log('\t'+error);
  }
}

provider.getLogs({
  address: ExchangeContract.address,
  topics: LogFill.topics,
  fromBlock: 4219261,
  toBlock: 'latest'
}).then((logs) => {
  return async.each(logs, (log, callback) => {
    processLogFill(log).then(() => {
      success_count++;
      callback();
    }).catch((err) => {
      if (error_whitelist[err.message]) {
        error_logs[err] = true;
        callback();
      } else {
        callback(err);
      }
    });
  });
}).then(() => {
  printErrorLogs();
  console.log('Got', success_count, 'valid orders!');
  process.exit();
}).catch((err) => {
  printErrorLogs();
  console.error('CRITICAL ERROR:\n', err);
  process.exit(1);
});

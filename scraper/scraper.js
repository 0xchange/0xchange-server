var {ExchangeContract, provider} = require('./util/ethers.js');
var processLogFill = require('./util/processLogFill.js');
var error_whitelist = require('./util/errorWhitelist.js');


var LogFill = ExchangeContract.interface.events.LogFill();

provider.on(LogFill.topics, (log) => {
  var logFill = LogFill.parse(log.topics, log.data);
  processLogFill(log).then(() => {
    console.log(logFill);
  }).catch((err) => {
    if (error_whitelist[err.message]) {
      console.log('Non-critical error:');
      console.log('\t'+err.message);
    } else {
      console.error('CRITICAL ERROR:\n', err);
    }
  });
});
console.log('Listening for LogFill events.');

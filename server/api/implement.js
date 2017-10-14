var config = require('./config.js');
var Web3 = require('web3');
var ZeroEx = require('0x.js').ZeroEx;

var provider = new Web3.providers.HttpProvider(config.infuraURL);

var zeroEx = new ZeroEx(provider);

var logs;
var tokens;
var address;

zeroEx.exchange.getLogsAsync('LogFill', {fromBlock: 4219261, toBlock: 'latest'}, {}).then((result) => {
  logs = result;
  console.log('Logs', logs);
});

zeroEx.tokenRegistry.getTokensAsync().then((result) => {
  tokens = result;
  console.log('Tokens', tokens);
});


zeroEx.exchange.getContractAddressAsync().then((result) => {
  address = result;
  console.log('Address', address);
});

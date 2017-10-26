var BigNumber = require('bignumber.js');

var {bigNumberify, ExchangeContractPromise, RLP, provider} = require('./ethers.js');

var db = require('../../shared/db.js');
var zeroEx = require('../../shared/zeroEx.js');

var fillOrderArgs = [
  'maker', 'taker', 'makerTokenAddress', 'takerTokenAddress', 'feeRecipient',
  'makerTokenAmount', 'takerTokenAmount', 'makerFee', 'takerFee', 'expirationUnixTimestampSec', 'salt',
  null,
  null,
  'v',
  'r',
  's'
];

var ExchangeContract;

var LogFillFunctions;


function defineLogFillFunctions() {
  LogFillFunctions = {};
  LogFillFunctions[ExchangeContract.interface.functions.fillOrder(
    new Array(5).fill('0x0000000000000000000000000000000000000000'), new Array(6), 0, false, 0, '0x0','0x0'
  ).data.substring(0,10)] = 'fillOrder';
  LogFillFunctions[ExchangeContract.interface.functions.fillOrKillOrder(
    new Array(5).fill('0x0000000000000000000000000000000000000000'), new Array(6), 0, 0, '0x0','0x0'
  ).data.substring(0,10)] = 'fillOrKillOrder';
  LogFillFunctions[ExchangeContract.interface.functions.batchFillOrders(
    [], [], [], false, [], [], []
  ).data.substring(0,10)] = 'batchFillOrders';
  LogFillFunctions[ExchangeContract.interface.functions.fillOrdersUpTo(
    [], [], 0, false, [], [], []
  ).data.substring(0,10)] = 'fillOrdersUpTo';
}


function splitSubstring(str, len) {
  var ret = [ ];
  for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
    ret.push(str.substring(offset, offset + len));
  }
  return ret;
}

function ErrorWithInfo(message, info) {
  var error = new Error(message);
  error.info = info;
  return error;
}

function getSignedOrder(rawFillOrderTransaction) {
  var rawParams = RLP.decode(rawFillOrderTransaction)[5];
  var functionHash = rawParams.substring(0, 10);
  var functionId = LogFillFunctions[functionHash];
  if (!functionId) {throw ErrorWithInfo('NOT_A_LOGFILL_FUNCTION', functionHash)}
  if (functionId != 'fillOrder') {throw ErrorWithInfo('NOT_FILLORDER', functionId)}
  var hexParams = splitSubstring(rawParams.substring(10), 64);
  var order = {
    ecSignature: {},
    exchangeContractAddress: ExchangeContract.address
  };

  for (var i in fillOrderArgs) order[fillOrderArgs[i]] = hexParams[i];

  for (var property of [
    'feeRecipient', 'maker', 'makerTokenAddress', 'taker', 'takerTokenAddress'
  ]) order[property] = '0x'+order[property].substring(24);

  for (var property of [
    'expirationUnixTimestampSec', 'makerFee', 'makerTokenAmount', 'salt', 'takerFee', 'takerTokenAmount'
  ]) order[property] = new BigNumber(order[property], 16);

  for (var property of ['r', 's']) order[property] = '0x'+order[property];

  order.v = bigNumberify('0x'+order.v).toNumber();

  delete order.null;

  for (var property of ['v', 'r', 's']) {
    order.ecSignature[property] = order[property];
    delete order[property];
  }

  return order;
}

module.exports = function(log) {
  var order;
  return ExchangeContractPromise().then((_ExchangeContract) => {
    ExchangeContract = _ExchangeContract;
    if (!LogFillFunctions) defineLogFillFunctions();
    return provider.getTransaction(log.transactionHash);
  }).then((transaction) => {
    order = getSignedOrder(transaction.raw);
    return zeroEx.exchange.validateOrderFillableOrThrowAsync(order);
  }).then(() => {
    return db.addOrder(order);
  });
}

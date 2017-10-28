var BigNumber = require('bignumber.js');

var db = require('../../shared/db.js');
var zeroEx = require('../../shared/zeroEx.js');

var {
  arrayify,
  bigNumberify,
  ExchangeContract,
  Interface,
  provider,
  RLP
} = require('./ethers.js');


var LogFillFunctions = (function() {
  var LogFillFunctions = {};
  for (var fn of ['fillOrder', 'fillOrKillOrder', 'batchFillOrders', 'fillOrdersUpTo']) {
    var functionObj = ExchangeContract.interface.functions[fn];
    LogFillFunctions[ExchangeContract.interface.functions[fn].sighash] = {
      name: fn,
      params: functionObj.inputs,
      types: functionObj.signature.split('(', 2)[1].slice(0, -1).split(',')
    };
  }
  return LogFillFunctions;
})();


function ErrorWithInfo(message, info) {
  var error = new Error(message);
  error.info = info;
  return error;
}

function getSignedOrder(rawFillOrderTransaction) {
  var rawFunctionCall = RLP.decode(rawFillOrderTransaction)[5];

  var functionHash = rawFunctionCall.substring(0, 10);
  var functionInfo = LogFillFunctions[functionHash];

  if (!functionInfo) {throw ErrorWithInfo('NOT_A_LOGFILL_FUNCTION', functionHash)}
  if (functionInfo.name !== 'fillOrder') {throw ErrorWithInfo('NOT_FILLORDER', functionInfo.name)}

  var rawParams = '0x'+rawFunctionCall.substring(10);

  var params = Interface.decodeParams(
    functionInfo.params,
    functionInfo.types,
    arrayify(rawParams)
  );

  params.orderValues = params.orderValues.map((value) => {
    return new BigNumber(value.toString());
  });

  params.orderAddresses = params.orderAddresses.map((address) => {
    return address.toLowerCase();
  });

  var order = {
    ecSignature: {
      r: params.r,
      s: params.s,
      v: params.v
    },
    exchangeContractAddress: ExchangeContract.address,
    expirationUnixTimestampSec: params.orderValues[4],
    feeRecipient: params.orderAddresses[4],
    maker: params.orderAddresses[0],
    makerFee: params.orderValues[2],
    makerTokenAddress: params.orderAddresses[2],
    makerTokenAmount: params.orderValues[0],
    salt: params.orderValues[5],
    taker: params.orderAddresses[1],
    takerFee: params.orderValues[3],
    takerTokenAddress: params.orderAddresses[3],
    takerTokenAmount: params.orderValues[1]
  };

  return order;
}


module.exports = function(log) {
  var order;
  return provider.getTransaction(log.transactionHash).then((transaction) => {
    order = getSignedOrder(transaction.raw);
    return zeroEx.exchange.validateOrderFillableOrThrowAsync(order);
  }).then(() => {
    return db.addOrder(order);
  });
}

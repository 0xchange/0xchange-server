var BigNumber = require('bignumber.js');
var txDecoder = require('ethereum-tx-decoder');

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


var fnDecoder = new txDecoder.FunctionDecoder(ExchangeContract.interface);


var LogFillFunctions = (function() {
  var functions = ExchangeContract.interface.functions;
  var LogFillFunctions = {};

  LogFillFunctions[functions.fillOrder.sighash] = function(params) {
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


  LogFillFunctions[functions.fillOrKillOrder.sighash] = function() {}


  LogFillFunctions[functions.batchFillOrders.sighash] = function() {}


  LogFillFunctions[functions.fillOrdersUpTo.sighash] = function() {}

  return LogFillFunctions;
})();


function ErrorWithInfo(message, info) {
  var error = new Error(message);
  error.info = info;
  return error;
}

function getSignedOrder(rawFillOrderTransaction) {
  var decodedTx = txDecoder.decodeTx(rawFillOrderTransaction);
  var decodedFn = fnDecoder.decodeFn(decodedTx.data);

  var sighash = decodedTx.data.substring(0,10);
  var processFn = LogFillFunctions[sighash];

  if (!processFn) {throw ErrorWithInfo('NOT_A_LOGFILL_FUNCTION', sighash)}
  if (sighash !== ExchangeContract.interface.functions.fillOrder.sighash) {
    throw ErrorWithInfo('NOT_FILLORDER', processFn.name);
  }

  var order = processFn(decodedFn);

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

var {async, Promise} = require('async-bluebird');
var BigNumber = require('bignumber.js');
var txDecoder = require('ethereum-tx-decoder');

var error_whitelist = require('./errorWhitelist.js');

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

    return [order];
  }


  LogFillFunctions[functions.fillOrKillOrder.sighash] = function() {
    console.error('FILL_OR_KILL_ORDER');
  }


  LogFillFunctions[functions.batchFillOrders.sighash] =
  LogFillFunctions[functions.fillOrdersUpTo.sighash] = function(params) {
    params.orderValues = params.orderValues.map((orderValues) => {
      return orderValues.map((value) => {
        return new BigNumber(value.toString());
      });
    });
    params.orderAddresses = params.orderAddresses.map((orderAddresses) => {
      return orderAddresses.map((address) => {
        return address.toLowerCase();
      });
    });

    var numOrders = params.orderAddresses.length;
    var orders = new Array(numOrders);

    for (var i = 0; i < numOrders; i++) {
      orders[i] = {
        ecSignature: {
          r: params.r[i],
          s: params.s[i],
          v: params.v[i]
        },
        exchangeContractAddress: ExchangeContract.address,
        expirationUnixTimestampSec: params.orderValues[i][4],
        feeRecipient: params.orderAddresses[i][4],
        maker: params.orderAddresses[i][0],
        makerFee: params.orderValues[i][2],
        makerTokenAddress: params.orderAddresses[i][2],
        makerTokenAmount: params.orderValues[i][0],
        salt: params.orderValues[i][5],
        taker: params.orderAddresses[i][1],
        takerFee: params.orderValues[i][3],
        takerTokenAddress: params.orderAddresses[i][3],
        takerTokenAmount: params.orderValues[i][1]
      };
    }

    return orders;
  }

  return LogFillFunctions;
})();


function ErrorWithInfo(message, info) {
  var error = new Error(message);
  error.info = info;
  return error;
}

function getSignedOrders(rawFillOrderTransaction) {
  var decodedTx = txDecoder.decodeTx(rawFillOrderTransaction);
  var decodedFn = fnDecoder.decodeFn(decodedTx.data);

  var sighash = decodedTx.data.substring(0,10);
  var processFn = LogFillFunctions[sighash];

  if (!processFn) {throw ErrorWithInfo('NOT_A_LOGFILL_FUNCTION', sighash)}

  var orders = processFn(decodedFn);

  return orders;
}


module.exports = function(log) {
  var error_logs = {};

  return provider.getTransaction(log.transactionHash).then((transaction) => {
    var orders = getSignedOrders(transaction.raw);

    return async.eachLimit(orders, 10, (order, callback) => {
      zeroEx.exchange.validateOrderFillableOrThrowAsync(order).then(() => {
        return db.addOrder(order);
      }).then(() => callback()).catch((err) => {
        if (error_whitelist[err.message]) {
          error_logs[err] = true;
          callback();
        } else {
          callback(err);
        }
      });
    });
  }).then(() => {return Promise.resolve(error_logs)});
}

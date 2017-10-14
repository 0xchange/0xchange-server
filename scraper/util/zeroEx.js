// Get a ZeroEx object

var config = require('./config.js');
var ProviderEngine = require('web3-provider-engine');
var FilterSubprovider = require('web3-provider-engine/subproviders/filters');
var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
var ZeroEx = require('0x.js').ZeroEx;

var providerEngine = new ProviderEngine();
providerEngine.addProvider(new FilterSubprovider());
providerEngine.addProvider(new RpcSubprovider({rpcUrl: config.infuraURL}));
providerEngine.start();

module.exports = new ZeroEx(providerEngine);

var bitcoin = require('bitcoin');
var Q = require('q');

var bip100re = new RegExp('BIP100|BV[0-9]{7}');

var client = new bitcoin.Client({
  host:'localhost',
  port:8332,
  user:'bitcoinrpc',
  pass:'3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce'
});



function getBestBlock() {
  var defer = Q.defer();
  client.getBestBlockHash(function(err, data) {
    if (err) {
      defer.reject(error);
    } else {
      console.log('data from getBestBlock:', data);
      defer.resolve(data);
    }
  });
  return defer.promise;
}


function getBlock(blockHash) {
  var defer = Q.defer();
  client.getBlock(blockHash, function(err, data) {
    if (err) {
      defer.reject(err);
    } else {
      console.log('coinbaseTransactionId %s, previousBlockHash %s', data.tx[0], data.previousblockhash);
      defer.resolve({ 'coinbaseTransactionId': data.tx[0], 'previousBlockHash': data.previousblockhash });
    }
  });
  return defer.promise;
}

function getRawTransaction(transactionId) {
  var defer = Q.defer();
  client.getRawTransaction(transactionId, 1, function(err, data) {
    if (err) {
      defer.reject(err);
    } else {
      console.log('data from getRawTransaction:', data);
      defer.resolve(data);
    }
  });
  return defer.promise;
}

function checkCoinBaseValue(transaction) {
  var coinbaseValue = transaction.vin[0].coinbase;
  console.log('coinbaseValue:', coinbaseValue);
  var coinbaseValueInBinary = new Buffer(coinbaseValue, 'hex')
  console.log('coinbase binary field:', coinbaseValueInBinary);

  if (bip100re.test(coinbaseValueInBinary)) {
    console.log('test is positive. BIP100 supported');
  } else {
    console.log('NACK. No support here.');
  }

}

getBestBlock()
  .then(function(hash) {
    return getBlock(hash);
  })
  .then(function(blockinfo) {
    return getRawTransaction(blockinfo.coinbaseTransactionId);
  })
  .then(function(transaction) {
    checkCoinBaseValue(transaction);
  })
  .catch(function(err) {
    console.log('error:', err);
  });

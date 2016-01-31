var bitcoin = require('bitcoin');
var Q = require('q');
var bip100re = new RegExp('BIP100|BV[0-9]{7}');
var bip100Support = 0;
var notBip100Support = 0;
var blocksChecked = 0;
var blocksToLoop = 3;
var results=[];

var client = new bitcoin.Client({
  host:'localhost',
  port:8332,
  user:'bitcoinrpc',
  pass:'BNMWKyZoA9BzSgHDwCjdu9DZr5vgvCqLZZZg9PGGgfSD'
});

getBestBlock().then(function(bestblockHash) {
  GetPreviousBlocks(bestblockHash).then(function(finished) {
    printResults();
  });
});

function GetPreviousBlocks(hash) {
  getBlock(hash)
    .then(function(blockinfo) {
      results.push([blocksChecked,blockinfo.blockhash])
      //console.log('blockinfo:', blockinfo);
      blocksChecked++
      previousBlockHash = blockinfo.previousBlockHash;
      if (blocksChecked < blocksToLoop) {
        console.log('1 more block down out of ' + blocksToLoop);
        GetPreviousBlocks(previousBlockHash);
      }
    });
}

// blockHashes.forEach(function(hash) {
//   getBlock(hash).then(function(blockInfo) {
//     console.log(blockInfo);
//   })
// });

function getBlock(blockHash) {
  //console.log('Requested info for ' + blockHash);
  //console.log('Blockhash = ' + blockHash);
  var defer = Q.defer();
  client.getBlock(blockHash, function(err, data) {
    if (err) {
      defer.reject(err);
    } else {
      //console.log('[getBlock] hash, coinbaseTransactionId %s, previousBlockHash %s', blockHash, data.tx[0], data.previousblockhash);
      defer.resolve({ 'blockhash':blockHash, 'coinbaseTransactionId': data.tx[0], 'previousBlockHash': data.previousblockhash, height: data.height  });
    }
  });
  results.push(defer.promise);
  return defer.promise;sy
}

function getBestBlock() {
  var defer = Q.defer();
  client.getBestBlockHash(function(err, data) {
    if (err) {
      defer.reject(error);
    } else {
      console.log('data from getBestBlock');
      defer.resolve(data);
    }
  });
  return defer.promise;
}

function getLastNBlocks(NBlocks, startingBlockHash) {
  getBlock(startingBlockHash);
}

function printResults () {
 for (var i = 0; i < blocksToLoop; i++)
   console.log(results[i])
}

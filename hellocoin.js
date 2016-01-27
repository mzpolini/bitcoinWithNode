var bitcoin = require('bitcoin');

var client = new bitcoin.Client({
  host:'localhost',
  port:8332,
  user:'bitcoinrpc',
  pass:'3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce'
});

var bip100_blocks = 0;
var non_bip100_blocks = 0;

var bip100re = new RegExp('BIP100|BV[0-9]{7}');

client.getBlockchainInfo(function(err, data) {
  if (err) throw err;

  if (data.blocks < 360000) {
    console.log('Block height too low; there are no blokcs indicating support for BIP100');
  } else {
    client.getBestBlockHash(function(err, latestBlock) {
      if (err) throw err;

      var block = latestBlock

      for (var i = 0; i < 10; i++) {
        client.getBlock(block, function(err, blockData) {
          console.log('block:', block);
          if (err) throw err;

          block = blockData.previousblockhash;
          var coinbaseTransactionId = blockData.tx[0];

          client.getRawTransaction(coinbaseTransactionId, 1, function(err, coinbaseTransaction) {
            if (err) throw err;

            //console.log('coinbaseTransaction:', coinbaseTransaction);
            var coinbaseField = coinbaseTransaction.vin[0].coinbase;
            console.log('coinbase field:', coinbaseField);

            var coinbaseFieldInBinary = new Buffer(coinbaseField, 'hex')
            console.log('coinbase binary field:', coinbaseFieldInBinary);

            //console.log('coinbase field in string:', coinbaseFieldInBinary.toString('utf8'));
          });

        });
      }


    });
  }

});

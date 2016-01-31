var bitcoin = require('bitcoinjs-lib')
var bigi = require('bigi')



function createNewAddress(stringtoHash) {
  var hash = bitcoin.crypto.sha256(stringtoHash)
  var d = bigi.fromBuffer(hash)

  var options = {
    compressed: false,
    network: bitcoin.networks.testnet
  }

  var keyPair = new bitcoin.ECPair(d, null, options)
  var address = keyPair.getAddress()
  var wif = keyPair.toWIF()

  console.log('Address: ' +address)
  console.log('WIF: ' + wif)

  return {'address':address,'wif':wif};
}

function createTransaction() {
  var keyPair = bitcoin.ECPair.fromWIF('92vuTHxGKs1awYy1FUujKmHENuXFRJgmy8KU8jMsYxe2ykE5vb6', bitcoin.networks.testnet)
  var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)

  tx.addInput('1992ab532eea950e4c37b659ac3cc67c1bfb883f693c9d6414d6ab9a05fc7563', 0)
  tx.addOutput('muzxKEGrG5Uy4jaG53K6o73Ex879VGxNCc', 980000)
  tx.sign(0, keyPair)
  console.log(tx.build().toHex());
}

createTransaction()

// var stringtoHash = process.argv[2];
//
// if (!stringtoHash) {
//   console.log('No string to hash provided.');
//   process.exit(0);
// }
// console.log('stringHashed:', stringtoHash);

//createNewAddress(stringtoHash);

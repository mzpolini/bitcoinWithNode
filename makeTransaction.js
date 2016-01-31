var bitcoin = require('bitcoinjs-lib');
var bigi = require('bigi');
var fs = require('fs');


var transactionInfo = {
  wif: '',
  txInput: [], //allow multiple inputs for transaction
  InputVout: [], //allow multiple inputs for transaction
  outPutAddress: '',
  Amount: 0
}

transactionInfo.txInput.push('bf7f78facee1487d4d1610d6d5c26fd08d8b80601c8f794cb4825cb09a3db825');
transactionInfo.InputVout.push(1);
transactionInfo.outPutAddress = process.argv[2];
transactionInfo.Amount = parseInt(process.argv[3]);


function getWIFFromKeyFile() {
  var keyInfo = JSON.parse(fs.readFileSync('testnet.key'));

  transactionInfo.wif = keyInfo.wif;
}

//Get the wif from file for now.



function signTransaction() {

  console.log('Starting Sign Transaction: transactionInfo = ', transactionInfo);
  var keyPair = bitcoin.ECPair.fromWIF(transactionInfo.wif, bitcoin.networks.testnet);
  var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);

  // assume just one input for now.

  if (transactionInfo.InputVout)
  tx.addInput(transactionInfo.txInput[0], transactionInfo.InputVout[0]);
  tx.addOutput(transactionInfo.outPutAddress, transactionInfo.Amount);
  tx.sign(0, keyPair);

  console.log(tx.build().toHex());

}

getWIFFromKeyFile();

signTransaction();

var AWS = require('aws-sdk');
const EthereumTx = require('ethereumjs-tx');
var Web3 = require('web3');

const TABLE = process.env.TABLE;
const TEST_GAS = 350000;
var DB = new AWS.DynamoDB();
var KMS = new AWS.KMS();

exports.handler = async (event) => {
  console.log(event);
  var bodyData = JSON.parse(event.body);
  var keyError;

  // Check user entry in lookup table for conditionals below.
  var storedUserMetadata = await retrieveUserMetadata(event.requestContext.authorizer.userEmail)
    .catch(error => {
      console.log(error);
      keyError = true;
    });
  if (keyError) return genResponse(400, 'Error checking user in lookup table');
  if (Object.entries(storedUserMetadata).length === 0) {
    return genResponse(400, 'Something went wrong. No address for this user.');
  }

  // All further methods require web3 connection:
  var web3provider = new Web3.providers.WebsocketProvider(process.env.GETH_ENDPOINT);
  var web3 = new Web3(web3provider);
  var userMetadata = {};
  var hashBuffer;

  hashBuffer = Buffer.from(storedUserMetadata.Item.hash.S, 'base64');
  userMetadata.key = await decrypt(hashBuffer).catch(error => {
    console.log(error);
    keyError = true;
  });
  if (keyError) return genResponse(400, 'Error decrypting user credentials');
  userMetadata.address = storedUserMetadata.Item.address.S;
  if (bodyData.special) {
    delete userMetadata.key;
    var response = await special(userMetadata, bodyData, web3).catch(error => {
      console.log(error);
      keyError = true;
    });
    if (keyError) return genResponse(400, 'Error seeding account');
    console.log(response);

    return genResponse(200, response);
  }

  var response = await signAndSend(userMetadata, bodyData, web3).catch(error => {
    console.log(error);
    keyError = true;
    delete userMetadata.key;
  });
  if (keyError) return genResponse(400, 'Error sigining or sending transaction');
  console.log(response);

  return genResponse(200, response);
};

function genResponse(statusCode, body) {
  const response = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: statusCode,
    body: JSON.stringify(body)
  };
  return response;
}

/* DYNAMODB METHODS */
/**
 * Check if user exists in user lookup table
 * @param {} email 
 */
function retrieveUserMetadata(email) {
  var params = {
    TableName: TABLE,
    Key: {
      email: { S: email }
    }
  };
  return DB.getItem(params).promise();
}

/* KMS METHODS */
async function decrypt(b64CiphertextBlob) {
  return new Promise(async (resolve, reject) => {
    var params = {
      CiphertextBlob: b64CiphertextBlob
    };
    var decryptError;
    var response = await KMS.decrypt(params).promise().catch(error => {
      console.log(error);
      decryptError = true;
      reject(error);
    });
    if (decryptError) return;

    resolve(response.Plaintext); 
  });
}

/* CHAIN METHODS */
function signTransaction(userMetadata, bodyData, web3) {
  return new Promise(async (resolve, reject) => {
    // Calc nonce
    var count = await web3.eth.getTransactionCount(userMetadata.address);

    const txParams = {
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(process.env.GAS_PRICE), 
      gasLimit: web3.utils.toHex(process.env.GAS_LIMIT),
      to: bodyData.contract, 
      value: '0x00', 
      data: bodyData.transaction,
      // EIP 155 chainId - mainnet: 1, ropsten: 3
      chainId: web3.utils.toHex(process.env.CHAIN_ID)
    }
    const tx = new EthereumTx(txParams);
    // TODO use try except block to catch errors here bc unhandled promise errors
    tx.sign(userMetadata.key);
    var serializedTx = await tx.serialize();
    console.log('Testing address derived back from contract: ' + tx.getSenderAddress().toString('hex'));
    resolve('0x' + serializedTx.toString('hex'));
  });
}

function sendTransaction(serializedTx, web3) {
  return new Promise(async (resolve, reject) => {
    var confirmation;
    // Uses listeners
    web3.eth.sendSignedTransaction(serializedTx)
      .on('transactionHash', (transactionHash) => {
        console.log("TX Hash: " + transactionHash);
        confirmation = transactionHash;
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
        resolve(confirmation);
      })
      .on('error', (error) => {
        console.log(error);
        reject(error);
      });
  });
}

function signAndSend(userMetadata, bodyData, web3) {
  return new Promise(async (resolve, reject) => {
    var signed = await signTransaction(userMetadata, bodyData, web3);
    console.log(signed);
    var uploadError;

    var response = await sendTransaction(signed, web3).catch(error => {
      console.log(error);
      delete userMetadata.key;
      uploadError = true;
      reject(error);
    });
    if (uploadError) return;
    console.log(response);
    resolve(response);
    delete userMetadata.key;
  })
}


// SPECIAL DANGEROUS
function special(userMetadata, bodyData, web3) {
  return new Promise(async (resolve, reject) => {
    console.log('Attempting to seed with Eth:' + process.env.SEED_ETH);
    var count = await web3.eth.getTransactionCount(process.env.SEEDER_ADDRESS);
    console.log(count)
    var txParams = {
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(process.env.GAS_PRICE), 
      gasLimit: web3.utils.toHex(process.env.GAS_LIMIT),
      to: userMetadata.address, 
      value: web3.utils.toHex(web3.utils.toWei(process.env.SEED_ETH, 'ether')), 
      // EIP 155 chainId - mainnet: 1, ropsten: 3
      chainId: web3.utils.toHex(process.env.CHAIN_ID)
    }
    var tx = new EthereumTx(txParams);
    var signError;

    tx.sign(Buffer.from(process.env.SEEDER_KEY, 'hex'))
    console.log('Testing address derived back from contract: ' + tx.getSenderAddress().toString('hex'));
    var serializedTx = await tx.serialize()
    await new Promise(async (innerResolve, innerReject) => {
      var confirmation;
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('transactionHash', (transactionHash) => {
          console.log("TX Hash: " + transactionHash);
          confirmation = transactionHash;
        })
        .on('receipt', (receipt) => {
          console.log(receipt);
          innerResolve(confirmation);
        })
        .on('error', (error) => {
          console.log(error);
          signError = true;
          innerReject(error);
        });
    });
    if (signError) return;
    console.log("Attempting to issueTokens");
    count = await web3.eth.getTransactionCount(process.env.SEEDER_ADDRESS);
    console.log(count)
    txParams = {
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(process.env.GAS_PRICE), 
      gasLimit: web3.utils.toHex(process.env.GAS_LIMIT),
      to: bodyData.contract, 
      value: '0x00', 
      // EIP 155 chainId - mainnet: 1, ropsten: 3
      chainId: web3.utils.toHex(process.env.CHAIN_ID),
      data: bodyData.transaction
    }
    tx = new EthereumTx(txParams);
    tx.sign(Buffer.from(process.env.SEEDER_KEY, 'hex'))
    console.log('Testing address derived back from contract: ' + tx.getSenderAddress().toString('hex'));
    serializedTx = await tx.serialize()
    var confirmation;
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', (transactionHash) => {
        console.log("TX Hash: " + transactionHash);
        confirmation = transactionHash;
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
        resolve(confirmation);
      })
      .on('error', (error) => {
        console.log(error);
        reject(error);
      });
  });
}
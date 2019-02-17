var AWS = require('aws-sdk');
var keythereum = require("keythereum");

const TABLE = process.env.TABLE;
var DB = new AWS.DynamoDB();
var KMS = new AWS.KMS();

exports.handler = async (event) => {
  var keyError;
  console.log(event);
  console.log(event.requestContext.authorizer.userEmail);

  // Check user entry in lookup table for conditionals below.
  var storedUserMetadata = await retrieveUserMetadata(event.requestContext.authorizer.userEmail)
    .catch(error => {
      console.log(error);
      keyError = true;
    });
  if (keyError) return genResponse(400, 'Error checking user in lookup table');

  // Check if this is a login event for a returning user, since no web3 is needed, its just db lookup.
  if (Object.entries(storedUserMetadata).length > 0) {
    // Return address for frontend to retrieve profile.
    return genResponse(200, storedUserMetadata.Item.address.S);
  }

  var newAddress = await createNewAccount(event.requestContext.authorizer.userEmail)
    .catch(error => {
      console.log(error);
      keyError = true;
    });
  console.log(newAddress);

  if (keyError) return genResponse(400, 'Error creating new account');

  return genResponse(200, newAddress);
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

function createNewAccount(email) {
  return new Promise(async (resolve, reject) => {
    var createAcctErr;
    // Call keythereum createkey method
    var dk = await createPrivateKey();
    
    // hash the secret key in KMS:
    var encryptedObj = await encryptKey(dk.privateKey).catch(error => {
      console.log(error);
      createAcctErr = true;
      reject(error);
    });
    if (createAcctErr) return;
    
    // Generate public address
    var newAddress = await createAddress(dk).catch(error => {
      console.log(error);
      createAcctErr = true;
      reject(error);
    });
    if (createAcctErr) return;

    // Finally, store user in lookup table
    await createLookupEntry(email, newAddress, encryptedObj.CiphertextBlob)
      .catch(error => {
        console.log(error);
        createAcctErr = true;
        reject(error);
      });
    if (createAcctErr) return;

    resolve(newAddress);
  });
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

function createLookupEntry(email, address, ciphertextBlob) {
  var params = {
    TableName: TABLE,
    Item: {
      email: { S: email },
      address: { S: address },
      hash: { S: ciphertextBlob.toString('base64') }
    }
  }
  return DB.putItem(params).promise();
}

/* KMS METHODS */
function encryptKey(privateKey) {
  var params = {
    KeyId: process.env.KEY_ID,
    Plaintext: privateKey
  };
  return KMS.encrypt(params).promise();
}

function generateDataKey() {
  var params = {
    KeyId: process.env.KEY_ID,
    KeySpec: 'AES_256'
  };
  return KMS.generateDataKey(params).promise();
}

/* KEYTHEREUM METHODS */
function createPrivateKey() {
  return new Promise(async (resolve) => {
    keythereum.create({}, dk => {
      resolve(dk);
    });
  });
}

function createAddress(dk) {
  return new Promise(async (resolve, reject) => {
    var createAcctErr;
    // The dump method needs a password, create one using generateDataKey
    var newDataKey = await generateDataKey().catch(error => {
      console.log(error);
      createAcctErr = true;
      reject(error);
    });
    if (createAcctErr) return;
    
    var hashword = newDataKey.Plaintext.toString('base64');
    keythereum.dump(hashword, dk.privateKey, dk.salt, dk.iv, {}, (keyObject) => {
      resolve('0x' + keyObject.address);
    });
  });
}
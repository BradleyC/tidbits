var AWS = require('aws-sdk');

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
    // TODO Call keythereum createkey method
    var newAddress = 'helloworld';

    // Generate a data key in KMS:
    var encryptedObj = await encryptKey(newAddress).catch(error => {
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
function encryptKey(key) {
  var params = {
    KeyId: process.env.KEY_ID,
    Plaintext: Buffer.from(key)
  };
  return KMS.encrypt(params).promise();
}

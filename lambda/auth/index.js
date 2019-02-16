const {OAuth2Client} = require('google-auth-library');

const ALLOWED_ISSUERS = [
  'accounts.google.com', 
  'https://accounts.google.com'
]

exports.handler = async (event) => {
  console.log(event.authorizationToken);
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: event.authorizationToken,
    audience: process.env.CLIENT_ID
  });
  var tokenInfo = ticket.getPayload();
  console.log(tokenInfo);
  if (tokenInfo.iss === ALLOWED_ISSUERS[0] || tokenInfo.iss === ALLOWED_ISSUERS[1]) {
    return genPolicyDoc(true, event.methodArn, tokenInfo.sub, tokenInfo.email);
  }
  return genPolicyDoc(false, event.methodArn);
};

function genPolicyDoc(effect, methodArn, principalId, userEmail) {
  var authResponse = {}
  if (effect) {
    authResponse.principalId = principalId;
    // Pass metadata to the next Lambda that runs from request
    authResponse.context = { userEmail: userEmail };
  }
  authResponse.policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'invoke_api',
        Action: 'execute-api:Invoke',
        Effect: effect ? "Allow" : "Deny",
        Resource: methodArn
      }
    ]
  };
  console.log(authResponse);
  return authResponse;
}
 
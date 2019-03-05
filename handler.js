const AWS = require('aws-sdk');
let cognitoClient = new AWS.CognitoIdentityServiceProvider({ region: 'eu-west-1' });


// Event object is the event passed to Lambda
async function getUserOfAuthenticatedUser(event) {
    // Get the unique ID given by cognito for this user, it is passed to lambda as part of a large string in event.requestContext.identity.cognitoAuthenticationProvider
    let userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    let request = {
        UserPoolId: 'eu-west-1_h6GvHrDaF', // Set your cognito user pool id
        Filter: `sub = "${userSub}"`,
        Limit: 1
    }
    const { Users: [user] } = await cognitoClient.listUsers(request).promise();
    console.log('event', event);
    console.log('request', request);
    console.log("got user:", user);

    return user;
}

module.exports.hello = async (event, context) => {

  const user = await getUserOfAuthenticatedUser(event);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: user,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

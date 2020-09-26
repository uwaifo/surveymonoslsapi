import AWS from "aws-sdk";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function newCognitoUser(event, context, callback) {
  // Send post authentication data to Cloudwatch logs
  console.log("Authentication successful");
  console.log("Trigger function =", event.triggerSource);
  console.log("User pool = ", event.userPoolId);
  console.log("App client ID = ", event.callerContext.clientId);
  console.log("User ID = ", event.userName);
  console.log("USER EMAIL IS :", event.request.userAttributes.email);

  // Now lets create a new user in the db based on that initiated in the Cognoto pool
  const now = new Date();
  const newUser = {
    userId: event.userName,
    firstName: "",
    lastName: "",
    email: event.request.userAttributes.email,
    phoneNumber: "",
    phoneType: "",
    address: {
      city: "",
      state: "",
    },
    dateCreated: now.toISOString(),
    surveyStatus: "NOT-STARTED",
    profileStatus: false,
    lastLoggedIn: "",
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.SURVEY_USER_TABLE,
        Item: newUser,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  // Return to Amazon Cognito
  callback(null, event);
}

export const handler = newCognitoUser;

//https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-authentication.html

//https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
/*
exports.handler = (event, context, callback) => {

    // Send post authentication data to Cloudwatch logs
    console.log ("Authentication successful");
    console.log ("Trigger function =", event.triggerSource);
    console.log ("User pool = ", event.userPoolId);
    console.log ("App client ID = ", event.callerContext.clientId);
    console.log ("User ID = ", event.userName);

    // Return to Amazon Cognito
    callback(null, event);
};

*/

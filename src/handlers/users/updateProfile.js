import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateProfile(event, context) {
  const { id } = event.pathParameters;
  let userUpdate;
  const today = new Date().toLocaleDateString();

  const {
    firstName,
    lastName,
    phoneNumber,
    phoneType,
    address,
    //addressCity,
    //addressState,
  } = event.body;

  if (firstName && lastName && phoneNumber === undefined) {
    throw new createError.BadRequest(
      " firstName,lastName and phoneNumber are required!"
    );
  }
  //const updatedAttributes = [];
  //const expressionAttributeValues = {};
  //address = :address, addressCity = :addressCity, addressState = :addressState

  const params = {
    TableName: process.env.SURVEY_USER_TABLE,
    Key: { userId: id },
    ExpressionAttributeValues: {
      ":firstName": firstName,
      ":lastName": lastName,
      ":phoneNumber": phoneNumber,
      ":phoneType": phoneType,
      ":address": address,
      ":profileStatus": true,
      ":lastLoggedIn": today,
    },
    UpdateExpression:
      "SET firstName = :firstName, lastName = :lastName, address = :address, phoneNumber = :phoneNumber, phoneType = :phoneType, profileStatus = :profileStatus, lastLoggedIn = :lastLoggedIn",
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();
    userUpdate = result.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(userUpdate),
  };
}

export const handler = commonMiddleware(updateProfile);

/*
  updatProfile:
    handler: src/handlers/users/updateProfile.handler
    events:
      - http:
          method: PATCH
          path: /user/{id}/profile
          cors: true

*/

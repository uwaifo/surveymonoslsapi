import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateProfile(event, context) {
  const { id } = event.pathParameters;
  let userUpdate;

  const {
    firstName,
    lastName,
    phoneNumber,
    //phoneType,
    address,
    //city,
    //state,
  } = event.body;

  if (firstName && lastName && phoneNumber === undefined) {
    throw new createError.BadRequest(
      " firstName,lastName and phoneNumber are required!"
    );
  }
  //const updatedAttributes = [];
  //const expressionAttributeValues = {};

  const params = {
    TableName: process.env.SURVEY_USER_TABLE,
    Key: { userId: id },
    ExpressionAttributeValues: {
      ":firstName": firstName,
      ":lastName": lastName,
      ":phoneNumber": phoneNumber,
      ":profileStatus": true,
      ":address": address,
    },
    UpdateExpression:
      "SET firstName = :firstName, lastName = :lastName, phoneNumber = :phoneNumber,address = :address, profileStatus = :profileStatus",
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

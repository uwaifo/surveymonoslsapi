import AWS from "aws-sdk";
//import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getUserById(event, context) {
  let user;
  const { id } = event.pathParameters;
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.SURVEY_USER_TABLE,
        Key: { userId: id },
      })
      .promise();

    user = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!user) {
    throw new createError.NotFound(`A user with the ID ${id} was not found`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
}

export const handler = commonMiddleware(getUserById);

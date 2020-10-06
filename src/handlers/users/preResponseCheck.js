import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function preResponseCheck(event, context) {
  const { userId, questionId, respState } = event.body;

  let respObj = {
    userId,
    questionId,
    respState,
  };

  const params = {};

  try {
    const result = await dynamodb.query(params).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(respObj),
  };
}
export const handler = commonMiddleware(preResponseCheck);

import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function userSurveyResponse(event, context, callback) {
  const { questionId, userId, response } = event.body;
  const now = new Date();
  const surveyResponse = {
    userId,
    questionId,
    response,
    createdAt: now.toLocaleDateString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.SURVEY_RESPONSE_TABLE,
        Item: surveyResponse,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(surveyResponse),
  };
}

export const handler = commonMiddleware(userSurveyResponse);

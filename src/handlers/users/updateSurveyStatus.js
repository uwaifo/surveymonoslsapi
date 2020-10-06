import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateSurveyStatus(event, context) {
  const { userId, surveyStatus } = event.body;

  let statusUpdate = {
    userId,
    surveyStatus,
  };

  const params = {
    TableName: process.env.SURVEY_USER_TABLE,
    Key: { userId },
    ExpressionAttributeValues: {
      ":surveyStatus": surveyStatus,
    },
    UpdateExpression: "SET surveyStatus = :surveyStatus",
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();
    statusUpdate = result.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(statusUpdate),
  };
}

export const handler = commonMiddleware(updateSurveyStatus);

import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addUserSurveyResponse(event, context, callback) {
  //const { id } = event.pathParameters;

  const { questionId, userId, response } = event.body;
  const now = new Date();
  let question_response = {
    userId,
    questionId,
    response,
    createdAt: now.toLocaleDateString(),
  };

  try {
    const result = await dynamodb
      .update({
        TableName: process.env.SURVEY_USER_TABLE,
        Key: { userId },
        ReturnValues: "ALL_NEW",
        UpdateExpression:
          "set #surveyResponse = list_append(if_not_exists(#surveyResponse, :empty_list), :question_response)",
        ExpressionAttributeNames: {
          "#surveyResponse": "surveyResponse",
        },
        ExpressionAttributeValues: {
          ":question_response": [question_response],
          ":empty_list": [],
        },
      })
      .promise();
    question_response = result.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(question_response),
  };
}

export const handler = commonMiddleware(addUserSurveyResponse);
//https://stackoverflow.com/questions/41400538/append-a-new-object-to-a-json-array-in-dynamodb-using-nodejs

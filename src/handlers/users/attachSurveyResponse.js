import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function attachSurveyResponse(event, context) {
  const { questionId, userId, response } = event.body;
  const now = new Date();
  const surveyResponse = {
    userId,
    questionId,
    response,
    createdAt: now.toLocaleDateString(),
  };
  //y;

  if (questionId && userId === undefined && response.length < 1) {
    throw new createError.BadRequest(
      " userId,questionId and response are required!"
    );
  }
  //const updatedAttributes = [];
  //const expressionAttributeValues = {};
  //address = :address, addressCity = :addressCity, addressState = :addressState

  const params = {
    TableName: process.env.SURVEY_USER_TABLE,
    Key: { userId: id },
    ExpressionAttributeValues: {
      ":userId": userId,
      ":questionId": questionId,
      ":response": response,
    },
    UpdateExpression:
      "SET userId = :userId, questionId = :questionId, address = :address, phoneNumber = :phoneNumber, phoneType = :phoneType, profileStatus = :profileStatus, lastLoggedIn = :lastLoggedIn",
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

export const handler = commonMiddleware(attachSurveyResponse);

/*
  updatProfile:
    handler: src/handlers/users/updateProfile.handler
    events:
      - http:
          method: PATCH
          path: /user/{id}/profile
          cors: true

*/

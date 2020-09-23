import AWS from "aws-sdk";
//import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getQuestions(event, context) {
  let questions;
  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.SURVEY_QUEST_TABLE,
      })
      .promise();

    questions = result.Items;
  } catch (error) {
    console.log(error);
    //NOTE. Only show your internal server errors in dev and debuginhg stage . Never in production

    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(questions),
  };
}

//export const handler = commonMiddleware(createQuestion);
export const handler = commonMiddleware(getQuestions);

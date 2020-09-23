import AWS from "aws-sdk";
//import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getQuestionById(event, context) {
  let question;
  const { id } = event.pathParameters;
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.SURVEY_QUEST_TABLE,
        Key: { questionId: id },
      })
      .promise();

    question = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!question) {
    throw new createError.NotFound(`Question with ID ${id} not found . `);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(question),
  };
}

//export const handler = commonMiddleware(createQuestion);
export const handler = commonMiddleware(getQuestionById);

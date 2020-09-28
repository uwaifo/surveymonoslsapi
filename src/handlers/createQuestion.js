import AWS from "aws-sdk";
import createError from "http-errors";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createQuestion(event, context) {
  const { questionText, questionType } = event.body;
  const now = new Date();
  const questionTypes = [
    "INPUT",
    "MULTIPLE-CHOICE",
    "DROPDOWN",
    "SINGLE-CHOICE",
  ];
  const question = {
    questionId: uuid(),
    questionText,
    questionType,
    sequenceNumber: 0,
    statusActive: true,
    createdAt: now.toLocaleDateString(),
  };

  if (!questionTypes.includes(questionType)) {
    return {
      message: `Invalid question type .Please choose from ${questionTypes}.`,
    };
  }

  try {
    await dynamodb
      .put({
        //TableName: "irr-d0-surveyQuestions",
        TableName: process.env.SURVEY_QUEST_TABLE,
        Item: question,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(question),
  };
}

export const handler = commonMiddleware(createQuestion);

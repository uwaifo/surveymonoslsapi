import AWS from "aws-sdk";
//import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getQuestionBySeq(event, context) {
  let question;
  const { id } = event.pathParameters;
  const params = {
    TableName: "irr-d0-surveyQuestions-dev",
    ScanIndexForward: true,
    FilterExpression: "#DYNOBASE_sequenceNumber = :sequenceNumber",
    ExpressionAttributeNames: {
      "#DYNOBASE_sequenceNumber": "sequenceNumber",
    },
    ExpressionAttributeValues: {
      ":sequenceNumber": id,
    },
  };
  try {
    const result = await dynamodb.scan(params).promise();

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
export const handler = commonMiddleware(getQuestionBySeq);
/*
aws dynamodb query --table-name irr-d0-surveyQuestions-dev --index-name searchBySequence --key-condition-expression "sequenceNumber = :name" --expression-attribute-values  '{":name":{"N":6}}'

    aws dynamodb query --table-name irr-d0-surveyQuestions-dev --key-condition-expression 'sequenceNumber = :idval' --expression-attribute-values '{":idval":{"N":"6"}}'
*/

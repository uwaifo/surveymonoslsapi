import AWS from "aws-sdk";
import createError from "http-errors";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../lib/commonMiddleware";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createUser(event, context) {
  const {
    //userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    phoneType,
    address,
  } = event.body;
  const now = new Date();

  const user = {
    userId: uuid(),
    firstName,
    lastName,
    email,
    phoneNumber,
    phoneType,
    address,
    surveyStatus: "NOT-STARTED",
    dateCreated: now.toLocaleDateString(),
    lastLoggedIn: "",
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.SURVEY_USER_TABLE,
        Item: user,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(user),
  };
}

export const handler = commonMiddleware(createUser);
/*
{
  "address": {
    "city": "Delhi",
    "line1": "123 Street",
    "state": "AZ",
    "zip": "34975"
  },
  "dateCreated": "09/14/2020",
  "email": "vijay@yahoo.com",
  "firstName": "Vijay",
  "lastName": "Barathwal",
  "phoneNumber": "9043058292",
  "phoneType": "Mobile",
  "surveyStatus": "IN-PROGRESS",
  "userId": "2ac6c9c4-a693-4117-ad3c-1fba15faf516"
}
*/

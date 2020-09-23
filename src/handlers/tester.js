const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

async function main() {
  const params = {
    TableName: "irr-d0-surveyQuestions-dev",
    ScanIndexForward: true,
    FilterExpression: "#DYNOBASE_sequenceNumber = :sequenceNumber",
    ExpressionAttributeNames: {
      "#DYNOBASE_sequenceNumber": "sequenceNumber",
    },
    ExpressionAttributeValues: {
      ":sequenceNumber": "6",
    },
  };

  try {
    const result = await documentClient.scan(params).promise();
    return result;
  } catch (error) {
    console.log(error);
  }

  //return
}

console.log(main());

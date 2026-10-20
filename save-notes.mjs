import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"; // getting aws contect

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({})); // connection to data base

function cors() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*", // permissions 
    "Access-Control-Allow-Methods": "GET,OPTIONS,POST,PUT"
  }
}

export const handler = async (event) => {

  const userId = event.requestContext.authorizer.jwt.claims.sub; // get our user id

  const body = JSON.parse(event.body);
  const note = body.note; // the actuall note we make

  const command = new UpdateCommand({ // Each time the user actually presses  the button it replaces the old note with whats currently there
    TableName: "UserNotes", // I just did that to save DB table space
    Key: {
      UserId: userId // our key in the table
    },
    UpdateExpression: "SET note = :n",
    ExpressionAttributeValues: {
      ":n": note
    }
  });

  await ddb.send(command);

  return {
    statusCode: 200, // quick verification API worked
    headers: cors(),
    body: JSON.stringify({
      message: "Note saved"
    })
  };
};

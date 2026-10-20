import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({})); // connection to database



function cors() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers" : "*", // our permissions
    "Access-Control-Allow-Methods" : "GET,OPTIONS,POST,PUT"
  }
}
export const handler = async (event) => {
const userId = event.requestContext.authorizer.jwt.claims.sub;

const command = new GetCommand({ // how we actually get the notes the user made before 
  TableName: "UserNotes",
  Key: {
    UserId : userId
  }
})

const result = await ddb.send(command);

const note = result.Item?.note ?? "";

return {
    statusCode: 200, // just tellin us the API was recvieved
    headers: cors(),
    body: JSON.stringify({
      note : note
    })
   
}
}

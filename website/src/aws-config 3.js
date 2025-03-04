import AWS from 'aws-sdk';

// AWS Configuration using environment variables
const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const TABLE_NAME = process.env.REACT_APP_DYNAMODB_TABLE || "Dishes";
const MENUS_TABLE_NAME = process.env.REACT_APP_DYNAMODB_MENUS_TABLE || "Menus";

AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export { dynamoDb, TABLE_NAME, MENUS_TABLE_NAME };

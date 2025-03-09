import AWS from 'aws-sdk';

// ✅ Load environment variables
const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const MENUS_TABLE_NAME = process.env.REACT_APP_DYNAMODB_MENUS_TABLE || "Menus";  // ✅ Only fetching Menus 
const TABLE_NAME = process.env.REACT_APP_DYNAMODB_TABLE || "Dishes";

// ✅ Configure AWS SDK
AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export { dynamoDb, MENUS_TABLE_NAME, TABLE_NAME };

import AWS from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

// AWS Configuration
const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const TABLE_NAME = process.env.REACT_APP_DYNAMODB_TABLE || "Dishes";
const MENUS_TABLE_NAME = process.env.REACT_APP_DYNAMODB_MENUS_TABLE || "Menus";

// Cognito Configuration
const USER_POOL_ID = process.env.REACT_APP_COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID;

AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

const getUserRestaurantId = (session) => {
  if (!session) return null;
  try {
    const idToken = session.getIdToken().decodePayload();
    return idToken["custom:restaurantID"] || "Unknown Restaurant"; // Ensure this matches the exact attribute name
  } catch (error) {
    console.error("Error getting user restaurant ID:", error);
    return "Unknown Restaurant"; // Default fallback
  }
};


export { dynamoDb, TABLE_NAME, MENUS_TABLE_NAME, userPool, getUserRestaurantId };

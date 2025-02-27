import { userPool } from "../aws-config";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

export const signIn = (username, password) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
};

export const signOut = () => {
  const sessionUser = userPool.getCurrentUser();
  if (sessionUser) sessionUser.signOut();
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const sessionUser = userPool.getCurrentUser();
    if (!sessionUser) return reject("No user logged in");

    sessionUser.getSession((err, session) => {
      if (err || !session.isValid()) return reject(err);
      resolve(sessionUser);
    });
  });
};

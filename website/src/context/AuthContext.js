import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { userPool } from "../aws-config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null); // ✅ Store session globally
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = () => {
      const currentUser = userPool.getCurrentUser();
      if (currentUser) {
        currentUser.getSession((err, session) => {
          if (!err && session.isValid()) {
            console.log("✅ Restored session for:", currentUser.getUsername());
            setUser(currentUser);
            setSession(session); // ✅ Store session globally
          } else {
            console.log("⚠️ Session expired or invalid");
            setUser(null);
            setSession(null);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signUp = (email, password, restaurantName) => {
    return new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [{ Name: "custom:restaurantID", Value: restaurantName }],
        null,
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  };

  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          console.log("✅ Signed in:", cognitoUser.getUsername());
          setUser(cognitoUser);
          setSession(session); // ✅ Store session globally
          resolve(session);
        },
        onFailure: (err) => reject(err),
      });
    });
  };

  const signOut = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
    setSession(null);
  };

  if (loading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

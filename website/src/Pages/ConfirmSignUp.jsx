import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '../aws-config';
import { useNavigate } from 'react-router-dom';

const ConfirmSignUp = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!email || !code) {
      setError("Please enter your email and verification code.");
      return;
    }

    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setError(err.message || 'Something went wrong');
      } else {
        console.log("✅ Account confirmed!", result);
        alert("✅ Account confirmed! You can now log in.");
        navigate('/signin'); // Redirect to sign-in page
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Confirm Your Account</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Confirm
        </button>

        <p className="text-sm text-center mt-4">
          Didn’t get a code?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up Again
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConfirmSignUp;

import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { CLIENT_APP_URL } from "../constants/websites";

const QRCodeComponent = ({ restaurantID }) => {
  if (!restaurantID) return null;

  const clientLink = `${CLIENT_APP_URL}?restaurant=${encodeURIComponent(
    restaurantID
  )}`;

  return (
    <div className="text-center font-sans">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        Scan to View Live Menu
      </h2>

      <div className="bg-white p-3 rounded-md shadow-sm inline-block">
        <QRCodeCanvas
          value={clientLink}
          size={180}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}
          includeMargin={false}
        />
      </div>

      <div className="mt-4">
        <a
          href={clientLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-base font-medium inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          Open Live Menu
        </a>
      </div>
    </div>
  );
};

export default QRCodeComponent;

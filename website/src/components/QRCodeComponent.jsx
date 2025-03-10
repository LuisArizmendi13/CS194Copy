import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct import 
import { CLIENT_APP_URL} from "../constants/websites";

const QRCodeComponent = ({ restaurantID }) => {
  if (!restaurantID) return null;

  const clientLink = `${CLIENT_APP_URL}?restaurant=${encodeURIComponent(restaurantID)}`;

  return (
    <div className="mt-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800">Scan to View Live Menu</h2>

      {/* ✅ Corrected QR Code usage */}
      <QRCodeCanvas value={clientLink} size={160} className="mt-2 mx-auto" />

      {/* ✅ Direct Link */}
      <div className="mt-4">
        <a href={clientLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-lg">
          Open Live Menu
        </a>
      </div>
    </div>
  );
};

export default QRCodeComponent;

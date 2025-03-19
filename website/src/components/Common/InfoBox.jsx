import React from "react";

/**
 * Info tooltip component with close button
 * Used for displaying help text and tips throughout the application
 */
const InfoBox = ({ title, children, onClose }) => {
  // Helper component for the "X" close button
  const CloseButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Close"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative border-l-4 border-blue-500 text-sm">
      <CloseButton onClick={onClose} />
      <h2 className="text-base font-semibold text-gray-800 mb-1">{title}</h2>
      {children}
    </div>
  );
};

export default InfoBox;
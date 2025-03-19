import React, { useState } from 'react';

const DeleteButtonWithConfirmation = ({
  onConfirm,
  message = "Are you sure you want to delete this item?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  buttonText = "Delete",
  buttonClassName = "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
  modalClassName = "",
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    onConfirm();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <button onClick={handleDeleteClick} className={buttonClassName}>
        {buttonText}
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[100]">
          <div className={`bg-white p-4 rounded shadow-lg max-w-md w-full text-center ${modalClassName}`}>
            <div className="text-gray-800 font-medium mb-4 text-lg">{message}</div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleCancel} 
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                {cancelText}
              </button>
              <button 
                onClick={handleConfirm} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButtonWithConfirmation;
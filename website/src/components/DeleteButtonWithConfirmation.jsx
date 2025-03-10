
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
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className={`bg-white p-4 rounded shadow-md text-center ${modalClassName}`}>
            <p className="mb-4">{message}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={handleConfirm} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                {confirmText}
              </button>
              <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButtonWithConfirmation;

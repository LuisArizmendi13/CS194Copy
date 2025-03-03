import { useNavigate } from "react-router-dom";

const NewMenuButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/create-menu")}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      + New Menu
    </button>
  );
};

export default NewMenuButton;

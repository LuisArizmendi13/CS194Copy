const ErrorMessage = ({ error }) => (
    <div className="max-w-6xl mx-auto p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
      <p className="text-red-700">{error}</p>
    </div>
  );
  
  export default ErrorMessage;
  
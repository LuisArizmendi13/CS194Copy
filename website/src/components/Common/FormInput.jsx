const FormInput = ({ label, type, value, onChange, placeholder }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="border p-2 w-full rounded mt-1"
          placeholder={placeholder}
        />
      </div>
    );
  };
  
  export default FormInput;
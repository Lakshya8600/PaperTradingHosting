import { useState } from "react";

const InputField = ({ type, placeholder, icon, onChange }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="relative mb-4">
      <label htmlFor={placeholder} className="block text-sm text-gray-300 mb-1">
        {placeholder}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src="icon.png" alt="icon" className="w-5 h-5 filter invert" />
          </span>
        )}

        <input
          id={placeholder}
          type={isPasswordShown && type === "password" ? "text" : type}
          placeholder={placeholder}
          required
          onChange={onChange}
          className={`w-full py-2 px-4 ${icon ? 'pl-10' : ''} ${
            type === "password" ? "pr-10" : ""
          } bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setIsPasswordShown((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer focus:outline-none"
          >
            <img
              src={isPasswordShown ? "/eyecross.png" : "/eye.png"}
              alt="Toggle visibility"
              className="w-5 h-5 filter invert"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;

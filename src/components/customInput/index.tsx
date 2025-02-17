import { useState } from "react";

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomInput = ({
  label,
  value,
  onChange,
  placeholder,
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <label
        className={`absolute left-3 transition-all ${
          isFocused || value
            ? "top-1 text-xs text-blue-500"
            : "top-3 text-gray-500"
        }`}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={isFocused ? placeholder : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 pt-5 pb-2 transition-all border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default CustomInput;

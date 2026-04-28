"use client";

import { forwardRef } from "react";

const TextArea = forwardRef(function TextArea(
  {
    id,
    placeholder,
    required = false,
    error,
    ...rest
  },
  ref
) {
  return (
    <div>
      <textarea
        id={id}
        ref={ref}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-green-500"
        }`}
        {...rest}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

export default TextArea;
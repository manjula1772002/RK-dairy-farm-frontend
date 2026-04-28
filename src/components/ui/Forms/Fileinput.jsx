"use client";
import { forwardRef } from "react";

const FileInput = forwardRef(function FileInput(
  { id, onChange, required = false, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      id={id}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      type="file"
      {...rest}
    />
  );
});

export default FileInput;
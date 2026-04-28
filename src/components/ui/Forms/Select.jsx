"use client";

import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { id, required = false, children, ...rest },
  ref,
) {
  return (
    <select
      id={id}
      ref={ref}
      required={required}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...rest}
    >
      <option value="">Select an option</option>
      {children}
    </select>
  );
});

export default Select;
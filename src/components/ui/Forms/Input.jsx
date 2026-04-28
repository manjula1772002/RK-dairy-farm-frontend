export default function Input({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = true,
  error,
  ...rest
}) {
  return (
    <div>
      <input
        type={type}
        id={id}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-green-500"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...rest}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
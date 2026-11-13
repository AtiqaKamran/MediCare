export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 rounded-xl border ${
            error ? "border-red-400" : "border-slate-200"
          } bg-white text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
        />
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
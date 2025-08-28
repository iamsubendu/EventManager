import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  const inputClasses = `block w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-700 text-base ${
    error ? "border-red-300 focus:ring-red-500" : ""
  } ${className}`;

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          {error}
        </div>
      )}
      {helperText && !error && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  helperText,
  className = "",
  children,
  ...props
}: SelectProps) {
  const selectClasses = `block w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-700 text-base ${
    error ? "border-red-300 focus:ring-red-500" : ""
  } ${className}`;

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {children}
      </select>
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          {error}
        </div>
      )}
      {helperText && !error && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

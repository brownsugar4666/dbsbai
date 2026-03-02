import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gov-navy mb-2">
                    {label}
                    {props.required && <span className="text-status-error ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            w-full px-4 py-3 rounded-md
            bg-white border border-border-default
            text-gov-navy placeholder:text-muted
            focus:outline-none focus:border-gov-saffron focus:ring-2 focus:ring-gov-saffron/20
            transition-all duration-200
            ${leftIcon ? 'pl-12' : ''}
            ${error ? 'border-status-error focus:ring-status-error/20' : ''}
            ${className}
          `}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
            </div>
            {error && (
                <p id={`${inputId}-error`} className="mt-2 text-sm text-status-error" role="alert">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-2 text-sm text-muted">{helperText}</p>
            )}
        </div>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gov-navy mb-2">
                    {label}
                    {props.required && <span className="text-status-error ml-1">*</span>}
                </label>
            )}
            <select
                id={selectId}
                className={`
          w-full px-4 py-3 rounded-md
          bg-white border border-border-default
          text-gov-navy
          focus:outline-none focus:border-gov-saffron focus:ring-2 focus:ring-gov-saffron/20
          transition-all duration-200
          ${error ? 'border-status-error focus:ring-status-error/20' : ''}
          ${className}
        `}
                aria-invalid={error ? 'true' : 'false'}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-2 text-sm text-status-error" role="alert">{error}</p>}
        </div>
    );
};

export default Input;

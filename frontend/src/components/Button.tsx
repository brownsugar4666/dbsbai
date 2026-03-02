import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium rounded-md
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
  `;

    const variants = {
        primary: `
      bg-gov-saffron text-gov-navy
      hover:bg-saffron-dark
      focus:ring-gov-saffron
    `,
        secondary: `
      bg-white text-gov-navy border-2 border-gov-navy
      hover:bg-gov-navy hover:text-white
      focus:ring-gov-navy
    `,
        ghost: `
      bg-transparent text-secondary
      hover:bg-surface-subtle hover:text-gov-navy
      focus:ring-gov-navy
    `,
    };

    const sizes = {
        sm: 'text-sm px-4 py-2',
        md: 'text-sm px-6 py-3',
        lg: 'text-base px-8 py-3.5',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : leftIcon ? (
                <span className="w-4 h-4 flex items-center justify-center">{leftIcon}</span>
            ) : null}
            {children}
            {rightIcon && <span className="w-4 h-4 flex items-center justify-center">{rightIcon}</span>}
        </button>
    );
};

export default Button;

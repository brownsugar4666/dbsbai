import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    elevated?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    elevated = false,
    padding = 'md',
}) => {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-white rounded-lg border border-border-light
        ${elevated ? 'shadow-sm hover:shadow-md transition-shadow duration-300' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => (
    <div className="flex items-start justify-between mb-6">
        <div>
            <h3 className="text-lg font-semibold text-gov-navy">{title}</h3>
            {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <div className={className}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <div className={`mt-6 pt-6 border-t border-border-light ${className}`}>{children}</div>
);

export default Card;

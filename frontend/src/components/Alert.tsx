import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertType = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
    type: AlertType;
    title: string;
    message?: string;
    onClose?: () => void;
    className?: string;
}

const alertConfig = {
    success: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        icon: CheckCircle,
    },
    warning: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        icon: AlertTriangle,
    },
    error: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        icon: AlertCircle,
    },
    info: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        icon: Info,
    },
};

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose, className = '' }) => {
    const config = alertConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={`${config.bg} border rounded-lg p-4 ${className}`}
            role="alert"
        >
            <div className="flex gap-3">
                <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm ${config.text}`}>{title}</h4>
                    {message && (
                        <p className="mt-1 text-sm text-secondary">{message}</p>
                    )}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-secondary transition-colors flex-shrink-0"
                        aria-label="Dismiss alert"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;

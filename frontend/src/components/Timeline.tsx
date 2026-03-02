import React from 'react';
import { Check } from 'lucide-react';

interface TimelineStep {
    id: string;
    title: string;
    description?: string;
    status: 'completed' | 'current' | 'upcoming';
}

interface StepTimelineProps {
    steps: TimelineStep[];
    className?: string;
}

export const StepTimeline: React.FC<StepTimelineProps> = ({ steps, className = '' }) => {
    const completedCount = steps.filter(s => s.status === 'completed').length;
    const currentIndex = steps.findIndex(s => s.status === 'current');
    const progressPercent = currentIndex >= 0
        ? ((completedCount) / (steps.length - 1)) * 100
        : completedCount === steps.length
            ? 100
            : 0;

    return (
        <div className={`w-full ${className}`} role="navigation" aria-label="Progress">
            <div className="relative flex items-start justify-between">
                {/* Background line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border-light" aria-hidden="true" />

                {/* Progress line */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-gov-saffron transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                    aria-hidden="true"
                />

                {/* Steps */}
                <ol className="relative flex w-full justify-between">
                    {steps.map((step, index) => (
                        <li
                            key={step.id}
                            className="relative flex flex-col items-center"
                            style={{ width: `${100 / steps.length}%` }}
                        >
                            {/* Step indicator */}
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 ease-out z-10
                  ${step.status === 'completed'
                                        ? 'bg-gov-saffron text-gov-navy'
                                        : step.status === 'current'
                                            ? 'bg-gov-navy text-white ring-4 ring-gov-navy/20'
                                            : 'bg-white border-2 border-border-default text-muted'
                                    }
                `}
                                aria-current={step.status === 'current' ? 'step' : undefined}
                            >
                                {step.status === 'completed' ? (
                                    <Check className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
                                ) : (
                                    <span className="text-sm font-semibold">{index + 1}</span>
                                )}
                            </div>

                            {/* Label */}
                            <div className="mt-3 text-center">
                                <p className={`
                  text-sm font-medium
                  ${step.status === 'upcoming' ? 'text-muted' : 'text-gov-navy'}
                `}>
                                    {step.title}
                                </p>
                                {step.description && (
                                    <p className="text-xs text-muted mt-0.5 max-w-[100px]">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

// Compact version
export const CompactTimeline: React.FC<StepTimelineProps> = ({ steps, className = '' }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`} role="navigation" aria-label="Progress">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
            transition-all duration-300
            ${step.status === 'completed'
                            ? 'bg-gov-saffron text-gov-navy'
                            : step.status === 'current'
                                ? 'bg-gov-navy text-white'
                                : 'bg-surface-subtle text-muted border border-border-default'
                        }
          `}>
                        {step.status === 'completed' ? (
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                        ) : (
                            index + 1
                        )}
                    </div>

                    {index < steps.length - 1 && (
                        <div className={`
              flex-1 h-0.5 min-w-[24px] transition-colors duration-300
              ${step.status === 'completed' ? 'bg-gov-saffron' : 'bg-border-light'}
            `} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export const Timeline = StepTimeline;

export default StepTimeline;

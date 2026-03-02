import React from 'react';
import { Check } from 'lucide-react';

interface Candidate {
    id: string;
    name: string;
    party: string;
    symbol: string;
    color: string;
}

interface VoteCardProps {
    candidate: Candidate;
    isSelected: boolean;
    onSelect: (id: string) => void;
    disabled?: boolean;
}

export const VoteCard: React.FC<VoteCardProps> = ({
    candidate,
    isSelected,
    onSelect,
    disabled = false,
}) => {
    return (
        <button
            onClick={() => onSelect(candidate.id)}
            disabled={disabled}
            className={`
        w-full p-5 rounded-lg border-2 text-left
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-gov-saffron focus:ring-offset-2
        ${isSelected
                    ? 'border-gov-navy bg-gov-navy/5'
                    : 'border-border-light bg-white hover:border-gov-navy/30 hover:shadow-sm'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}
      `}
            aria-pressed={isSelected}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Symbol */}
                    <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-surface-subtle"
                    >
                        {candidate.symbol}
                    </div>

                    <div>
                        <h3 className="font-semibold text-gov-navy">{candidate.name}</h3>
                        <p className="text-sm text-muted">{candidate.party}</p>
                    </div>
                </div>

                {/* Selection indicator */}
                <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${isSelected
                        ? 'border-gov-saffron bg-gov-saffron'
                        : 'border-border-default'
                    }
        `}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-gov-navy" strokeWidth={3} />}
                </div>
            </div>
        </button>
    );
};

// Demo candidates
export const demoCandidates: Candidate[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        party: 'Progressive Alliance',
        symbol: '🌻',
        color: '#f59e0b',
    },
    {
        id: '2',
        name: 'Rajesh Kumar',
        party: 'Green Future Party',
        symbol: '🌳',
        color: '#10b981',
    },
    {
        id: '3',
        name: 'Ananya Patel',
        party: 'Unity Front',
        symbol: '🕊️',
        color: '#3b82f6',
    },
    {
        id: '4',
        name: 'Vikram Singh',
        party: 'People\'s Movement',
        symbol: '⚙️',
        color: '#8b5cf6',
    },
];

export default VoteCard;

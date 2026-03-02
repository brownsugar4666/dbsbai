import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Check, X, ExternalLink, Clock, Hash } from 'lucide-react';
import { Button, Card, Input, Alert } from '../components';
import { useElectionStore } from '../lib/store';

interface Vote {
    id: string;
    timestamp: number;
    txHash: string;
    voteCiphertext: string;
}

export const Verify: React.FC = () => {
    const { getVoteByReceipt, votes } = useElectionStore();

    const [receiptId, setReceiptId] = useState('');
    const [searchResult, setSearchResult] = useState<'found' | 'not-found' | null>(null);
    const [voteData, setVoteData] = useState<Vote | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!receiptId.trim()) return;

        setIsSearching(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const vote = getVoteByReceipt(receiptId.trim());

        if (vote) {
            setSearchResult('found');
            setVoteData({
                id: vote.id,
                timestamp: vote.timestamp,
                txHash: vote.txHash,
                voteCiphertext: vote.voteCiphertext,
            });
        } else {
            setSearchResult('not-found');
            setVoteData(null);
        }

        setIsSearching(false);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <div className="min-h-screen bg-surface-light py-12 animate-fade-in">
            <div className="max-w-lg mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gov-navy">Verify Your Vote</h1>
                    <p className="text-secondary mt-2">Confirm your vote was recorded on blockchain</p>
                </div>

                {/* Search Card */}
                <Card elevated padding="lg" className="mb-6">
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-3">
                        <div className="flex-1">
                            <Input
                                placeholder="Enter vote receipt ID"
                                value={receiptId}
                                onChange={(e) => {
                                    setReceiptId(e.target.value);
                                    setSearchResult(null);
                                }}
                                leftIcon={<Search className="w-4 h-4" />}
                            />
                        </div>
                        <Button
                            type="submit"
                            isLoading={isSearching}
                            disabled={!receiptId.trim()}
                        >
                            Verify
                        </Button>
                    </form>

                    {/* Quick receipts for demo */}
                    {votes.length > 0 && !searchResult && (
                        <div className="mt-4 pt-4 border-t border-border-light">
                            <p className="text-xs text-muted mb-2 uppercase tracking-wide">Recent Receipts (Demo)</p>
                            <div className="flex flex-wrap gap-2">
                                {votes.slice(0, 2).map((vote: Vote) => (
                                    <button
                                        key={vote.id}
                                        onClick={() => setReceiptId(vote.id)}
                                        className="text-xs px-3 py-1.5 bg-surface-subtle rounded border border-border-light hover:border-gov-navy/30 transition-colors truncate max-w-[150px]"
                                    >
                                        {vote.id.slice(0, 12)}...
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Found Result */}
                {searchResult === 'found' && voteData && (
                    <Card elevated padding="lg" className="animate-slide-up">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gov-navy">Vote Verified</h3>
                                <p className="text-sm text-secondary">Successfully recorded on blockchain</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-surface-subtle rounded-lg border border-border-light">
                                <div className="flex items-center gap-2 text-muted mb-1">
                                    <Hash className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">Receipt ID</span>
                                </div>
                                <code className="text-sm text-gov-navy break-all font-mono">{voteData.id}</code>
                            </div>

                            <div className="p-4 bg-surface-subtle rounded-lg border border-border-light">
                                <div className="flex items-center gap-2 text-muted mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">Timestamp</span>
                                </div>
                                <p className="text-sm text-gov-navy">{formatDate(voteData.timestamp)}</p>
                            </div>

                            <div className="p-4 bg-surface-subtle rounded-lg border border-border-light">
                                <div className="flex items-center gap-2 text-muted mb-1">
                                    <ExternalLink className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">Transaction Hash</span>
                                </div>
                                <code className="text-sm text-status-info break-all font-mono">{voteData.txHash}</code>
                            </div>
                        </div>

                        <Alert
                            type="success"
                            title="Verification Complete"
                            message="Your vote is securely recorded and will be counted."
                            className="mt-6"
                        />
                    </Card>
                )}

                {/* Not Found Result */}
                {searchResult === 'not-found' && (
                    <Card elevated padding="lg" className="text-center animate-slide-up">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <X className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-semibold text-gov-navy">Vote Not Found</h3>
                        <p className="text-sm text-secondary mt-1 mb-6">
                            No vote found with this receipt ID
                        </p>

                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setSearchResult(null)}
                            >
                                Try Again
                            </Button>
                            <Link to="/vote" className="flex-1">
                                <Button className="w-full">
                                    Cast Your Vote
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}

                {/* Info */}
                {!searchResult && (
                    <Card className="mt-6" padding="lg">
                        <h3 className="font-semibold text-gov-navy mb-4">How Verification Works</h3>
                        <ol className="space-y-4 text-sm text-secondary">
                            <li className="flex items-start gap-4">
                                <span className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">1</span>
                                <span>All votes are encrypted and stored on the blockchain</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">2</span>
                                <span>Each vote generates a unique receipt ID</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">3</span>
                                <span>Verify anytime without revealing your choice</span>
                            </li>
                        </ol>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Verify;

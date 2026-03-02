import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, Check, ArrowRight, Lock } from 'lucide-react';
import { Button, Card, Alert, StepTimeline, VoteCard, demoCandidates } from '../components';
import { useVoterStore, useElectionStore } from '../lib/store';
import { generateNullifierHash, encryptVote, hashData } from '../lib/crypto';

export const Vote: React.FC = () => {
    const navigate = useNavigate();
    const { voter } = useVoterStore();
    const { addVote, hasVoted, getVoteReceipt } = useElectionStore();

    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [step, setStep] = useState<'select' | 'review' | 'submitting' | 'success'>('select');
    const [voteReceipt, setVoteReceipt] = useState<string | null>(null);

    const alreadyVoted = voter ? hasVoted(voter.id) : false;
    const existingReceipt = voter ? getVoteReceipt(voter.id) : null;

    const timelineSteps = [
        { id: '1', title: 'Select', status: step === 'select' ? 'current' as const : 'completed' as const },
        { id: '2', title: 'Review', status: step === 'review' ? 'current' as const : step === 'select' ? 'upcoming' as const : 'completed' as const },
        { id: '3', title: 'Submit', status: step === 'submitting' || step === 'success' ? 'current' as const : 'upcoming' as const },
    ];

    const handleSubmitVote = async () => {
        if (!voter || !selectedCandidate) return;

        setStep('submitting');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const nullifierHash = generateNullifierHash(voter.zkToken);
        const voteCiphertext = encryptVote(selectedCandidate, voter.zkToken);
        const receipt = hashData(voteCiphertext + Date.now());

        addVote({
            id: receipt,
            voterId: voter.id,
            voteCiphertext,
            nullifierHash,
            candidateId: selectedCandidate,
            timestamp: Date.now(),
            txHash: '0x' + hashData(receipt + 'tx').slice(0, 40),
        });

        setVoteReceipt(receipt);
        setStep('success');
    };

    const selectedCandidateData = demoCandidates.find(c => c.id === selectedCandidate);

    // Not registered
    if (!voter) {
        return (
            <div className="min-h-screen bg-surface-light py-16 animate-fade-in">
                <div className="max-w-md mx-auto px-4 sm:px-6">
                    <Card elevated padding="lg" className="text-center">
                        <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-7 h-7 text-yellow-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gov-navy">Registration Required</h2>
                        <p className="text-secondary mt-2 mb-6">
                            Please complete voter registration before casting your vote.
                        </p>
                        <Link to="/register">
                            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                Register Now
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    // Already voted
    if (alreadyVoted && step !== 'success') {
        return (
            <div className="min-h-screen bg-surface-light py-16 animate-fade-in">
                <div className="max-w-md mx-auto px-4 sm:px-6">
                    <Card elevated padding="lg" className="text-center">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-7 h-7 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gov-navy">Vote Already Cast</h2>
                        <p className="text-secondary mt-2">
                            You have already participated in this election.
                        </p>

                        {existingReceipt && (
                            <div className="mt-5 p-4 bg-surface-subtle rounded-lg border border-border-light">
                                <p className="text-xs text-muted mb-1 uppercase tracking-wide">Receipt ID</p>
                                <code className="text-sm text-gov-navy font-mono break-all">{existingReceipt}</code>
                            </div>
                        )}

                        <div className="mt-6 space-y-3">
                            <Link to="/verify" className="block">
                                <Button className="w-full">Verify Your Vote</Button>
                            </Link>
                            <Link to="/results" className="block">
                                <Button variant="secondary" className="w-full">View Results</Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-light py-12 animate-fade-in">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gov-navy">Cast Your Vote</h1>
                    <p className="text-secondary mt-2">Select your preferred candidate</p>
                </div>

                {/* Timeline */}
                <div className="mb-10">
                    <StepTimeline steps={timelineSteps} />
                </div>

                {/* Selection Step */}
                {step === 'select' && (
                    <>
                        <div className="space-y-4 mb-6">
                            {demoCandidates.map((candidate) => (
                                <VoteCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    isSelected={selectedCandidate === candidate.id}
                                    onSelect={setSelectedCandidate}
                                />
                            ))}
                        </div>

                        <Card className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-2 text-sm text-muted">
                                <Lock className="w-4 h-4" />
                                Your vote is encrypted and anonymous
                            </div>
                            <Button
                                onClick={() => setStep('review')}
                                disabled={!selectedCandidate}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Review Selection
                            </Button>
                        </Card>
                    </>
                )}

                {/* Review Step */}
                {step === 'review' && selectedCandidateData && (
                    <Card elevated padding="lg">
                        <h2 className="text-xl font-semibold text-gov-navy mb-6 text-center">
                            Confirm Your Selection
                        </h2>

                        <Alert
                            type="warning"
                            title="This action is final"
                            message="Once submitted, your vote cannot be changed or withdrawn."
                            className="mb-6"
                        />

                        <div className="p-6 bg-surface-subtle rounded-lg border border-border-light mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl bg-white">
                                    {selectedCandidateData.symbol}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gov-navy">{selectedCandidateData.name}</p>
                                    <p className="text-secondary">{selectedCandidateData.party}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setStep('select')}
                            >
                                Go Back
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleSubmitVote}
                            >
                                Submit Vote
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Submitting Step */}
                {step === 'submitting' && (
                    <Card elevated padding="lg" className="text-center">
                        <div className="w-14 h-14 rounded-full bg-gov-navy/10 flex items-center justify-center mx-auto mb-4">
                            <div className="animate-spin w-6 h-6 border-2 border-gov-navy border-t-transparent rounded-full" />
                        </div>
                        <h2 className="text-xl font-semibold text-gov-navy">Processing Vote</h2>
                        <p className="text-secondary mt-2">
                            Encrypting and recording on blockchain...
                        </p>
                    </Card>
                )}

                {/* Success Step */}
                {step === 'success' && (
                    <Card elevated padding="lg" className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gov-saffron flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-gov-navy" strokeWidth={2.5} />
                        </div>

                        <h2 className="text-2xl font-semibold text-gov-navy">Vote Submitted</h2>
                        <p className="text-secondary mt-2">Successfully recorded on blockchain</p>

                        <div className="mt-6 p-4 bg-surface-subtle rounded-lg border border-border-light">
                            <p className="text-xs text-muted mb-1 uppercase tracking-wide">Vote Receipt</p>
                            <code className="text-sm text-gov-navy font-mono break-all">{voteReceipt}</code>
                        </div>

                        <div className="mt-8 space-y-3">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => navigate('/verify')}
                            >
                                Verify Your Vote
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => navigate('/results')}
                            >
                                View Results
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Vote;

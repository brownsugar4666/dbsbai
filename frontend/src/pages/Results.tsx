import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Card, Button } from '../components';
import { useElectionStore } from '../lib/store';
import { demoCandidates } from '../components/VoteCard';

export const Results: React.FC = () => {
    const { votes, getVotesPerCandidate } = useElectionStore();
    const votesPerCandidate = getVotesPerCandidate();

    const totalVotes = votes.length;
    const electionActive = true;

    const chartData = demoCandidates.map((candidate) => ({
        name: candidate.name.split(' ')[0],
        fullName: candidate.name,
        party: candidate.party,
        votes: votesPerCandidate[candidate.id] || 0,
        color: candidate.color,
        symbol: candidate.symbol,
    })).sort((a, b) => b.votes - a.votes);

    const leader = chartData[0];
    const leaderPercent = totalVotes > 0 ? ((leader.votes / totalVotes) * 100).toFixed(1) : '0';

    return (
        <div className="min-h-screen bg-surface-light py-12 animate-fade-in">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gov-navy">Election Results</h1>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${electionActive ? 'bg-status-success animate-pulse' : 'bg-muted'}`} />
                        <span className="text-sm text-secondary">
                            {electionActive ? 'Live Results' : 'Final Results'}
                        </span>
                    </div>
                </div>

                {totalVotes === 0 ? (
                    <Card elevated padding="lg" className="text-center">
                        <Users className="w-14 h-14 text-muted mx-auto mb-4 opacity-40" />
                        <h2 className="text-xl font-semibold text-gov-navy mb-2">No Votes Yet</h2>
                        <p className="text-secondary mb-6">Be the first to participate in this election</p>
                        <Link to="/vote">
                            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                                Cast Your Vote
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 md:gap-6">
                            <Card className="p-5 md:p-6 text-center">
                                <p className="text-3xl md:text-4xl font-bold text-gov-navy">{totalVotes}</p>
                                <p className="text-sm text-secondary mt-1">Total Votes</p>
                            </Card>
                            <Card className="p-5 md:p-6 text-center">
                                <p className="text-3xl md:text-4xl font-bold text-gov-navy">{demoCandidates.length}</p>
                                <p className="text-sm text-secondary mt-1">Candidates</p>
                            </Card>
                            <Card className="p-5 md:p-6 text-center">
                                <p className="text-3xl md:text-4xl font-bold text-gov-saffron">{leaderPercent}%</p>
                                <p className="text-sm text-secondary mt-1">Leading</p>
                            </Card>
                        </div>

                        {/* Leader Card */}
                        {leader.votes > 0 && (
                            <Card elevated padding="lg" className="border-l-4 border-l-gov-saffron">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl bg-surface-subtle">
                                            {leader.symbol}
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted uppercase tracking-wide mb-1">Leading Candidate</p>
                                            <p className="text-xl font-semibold text-gov-navy">{leader.fullName}</p>
                                            <p className="text-secondary">{leader.party}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-gov-saffron">{leader.votes}</p>
                                        <p className="text-sm text-secondary">votes</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Chart */}
                        <Card elevated padding="lg">
                            <h3 className="font-semibold text-gov-navy mb-6">Vote Distribution</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical" barSize={28}>
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={80}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 13, fill: '#4A5568' }}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [`${value} votes`, 'Votes']}
                                            contentStyle={{
                                                background: 'white',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            }}
                                        />
                                        <Bar dataKey="votes" radius={[0, 6, 6, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* All Candidates */}
                        <Card elevated padding="lg">
                            <h3 className="font-semibold text-gov-navy mb-4">All Candidates</h3>
                            <div className="space-y-3">
                                {chartData.map((candidate, index) => {
                                    const percent = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0';
                                    return (
                                        <div
                                            key={candidate.name}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-surface-subtle border border-border-light"
                                        >
                                            <span className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-xs font-semibold text-secondary">
                                                {index + 1}
                                            </span>
                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-white">
                                                {candidate.symbol}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gov-navy truncate">{candidate.fullName}</p>
                                                <p className="text-xs text-muted">{candidate.party}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gov-navy">{candidate.votes}</p>
                                                <p className="text-xs text-muted">{percent}%</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Blockchain Info */}
                        <Card className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gov-navy">Blockchain Verified</p>
                                    <p className="text-sm text-secondary">All votes are cryptographically secured</p>
                                </div>
                                <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                                    View on Explorer
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;

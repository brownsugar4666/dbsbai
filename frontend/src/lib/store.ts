import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Voter Store
interface Voter {
    id: string;
    name: string;
    zkToken: string;
    isVerified: boolean;
    registeredAt: number;
}

interface VoterStore {
    voter: Voter | null;
    setVoter: (voter: Voter) => void;
    clearVoter: () => void;
}

// Use sessionStorage instead of localStorage - data clears when browser closes
export const useVoterStore = create<VoterStore>()(
    persist(
        (set) => ({
            voter: null,
            setVoter: (voter) => set({ voter }),
            clearVoter: () => set({ voter: null }),
        }),
        {
            name: 'bharatvote-voter',
            storage: createJSONStorage(() => sessionStorage), // Use sessionStorage
        }
    )
);

// Election Store
interface Vote {
    id: string;
    voterId: string;
    voteCiphertext: string;
    nullifierHash: string;
    candidateId: string;
    timestamp: number;
    txHash: string;
}

interface AuditLog {
    id: string;
    action: string;
    details: Record<string, unknown>;
    timestamp: number;
    anomalyScore?: number;
}

interface ElectionStore {
    votes: Vote[];
    auditLogs: AuditLog[];
    merkleRoot: string | null;

    addVote: (vote: Vote) => void;
    hasVoted: (voterId: string) => boolean;
    getVoteReceipt: (voterId: string) => string | null;
    getVoteByReceipt: (receiptId: string) => Vote | undefined;
    getVotesPerCandidate: () => Record<string, number>;
    addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
    setMerkleRoot: (root: string) => void;
    clearElection: () => void;
}

// Use sessionStorage - data clears when browser closes
export const useElectionStore = create<ElectionStore>()(
    persist(
        (set, get) => ({
            votes: [],
            auditLogs: [],
            merkleRoot: null,

            addVote: (vote) => {
                const state = get();
                // Check for double voting
                if (state.votes.some(v => v.voterId === vote.voterId)) {
                    console.warn('Double voting attempt detected!');
                    return;
                }
                // Check for duplicate nullifier
                if (state.votes.some(v => v.nullifierHash === vote.nullifierHash)) {
                    console.warn('Duplicate nullifier detected!');
                    return;
                }
                set({ votes: [...state.votes, vote] });

                // Add audit log
                get().addAuditLog({
                    action: 'VOTE_CAST',
                    details: { voteId: vote.id, candidateId: vote.candidateId },
                });
            },

            hasVoted: (voterId) => {
                return get().votes.some(v => v.voterId === voterId);
            },

            getVoteReceipt: (voterId) => {
                const vote = get().votes.find(v => v.voterId === voterId);
                return vote?.id || null;
            },

            getVoteByReceipt: (receiptId) => {
                return get().votes.find(v => v.id === receiptId);
            },

            getVotesPerCandidate: () => {
                const counts: Record<string, number> = {};
                get().votes.forEach(vote => {
                    counts[vote.candidateId] = (counts[vote.candidateId] || 0) + 1;
                });
                return counts;
            },

            addAuditLog: (log) => {
                const auditLog: AuditLog = {
                    ...log,
                    id: Math.random().toString(36).substring(2),
                    timestamp: Date.now(),
                };
                set(state => ({ auditLogs: [...state.auditLogs, auditLog] }));
            },

            setMerkleRoot: (root) => set({ merkleRoot: root }),

            clearElection: () => set({ votes: [], auditLogs: [], merkleRoot: null }),
        }),
        {
            name: 'bharatvote-election',
            storage: createJSONStorage(() => sessionStorage), // Use sessionStorage
        }
    )
);

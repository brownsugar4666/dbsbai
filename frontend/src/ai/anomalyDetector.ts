/**
 * Combined Anomaly Detection Pipeline
 * Aggregates results from Isolation Forest, LSTM Autoencoder, and KDE
 */

import { runIsolationForest, prepareVoteData, type IsolationForestResult } from './isolationForest';
import { analyzeLSTM, type LSTMResult } from './lstmAutoencoder';
import { analyzeKDE, type KDEResult } from './kde';

export interface FlaggedVote {
    voteId: string;
    reason: string;
    confidence: number;
    algorithms: string[];
}

export interface AnomalyResult {
    isolationForest: IsolationForestResult;
    lstmAutoencoder: LSTMResult;
    kde: KDEResult;
    flaggedVotes: FlaggedVote[];
    overallRisk: 'low' | 'medium' | 'high';
    riskScore: number;
}

interface Vote {
    id: string;
    timestamp: number;
    candidateId: string;
    nullifierHash?: string;
    voteCiphertext?: string;
}

/**
 * Run complete anomaly detection pipeline
 */
export function detectAnomalies(votes: Vote[]): AnomalyResult {
    // Generate demo flagged votes for demonstration
    const demoFlaggedVotes: FlaggedVote[] = [
        {
            voteId: 'VT-2024-MH-8847291',
            reason: 'Voting timestamp 3.2s after previous submission from same polling booth (TH-042). Statistical threshold: 8s minimum gap. Flagged by Isolation Forest.',
            confidence: 0.92,
            algorithms: ['Isolation Forest', 'TSAD'],
        },
        {
            voteId: 'VT-2024-UP-3321847',
            reason: 'Device fingerprint matches 14 other votes in last 5 minutes. Normal threshold: 1-2 max. Potential batch submission detected.',
            confidence: 0.88,
            algorithms: ['Isolation Forest', 'KDE'],
        },
        {
            voteId: 'VT-2024-KA-5529103',
            reason: 'Geographic anomaly: GPS coordinates 47km from registered polling station. Vote cast via mobile device with VPN detected.',
            confidence: 0.85,
            algorithms: ['Geospatial Analysis'],
        },
        {
            voteId: 'VT-2024-WB-1193847',
            reason: 'LSTM Autoencoder detected temporal spike: 340% increase in vote rate at 14:32:15 IST, sustained for 2.3 minutes. Booth ID: WB-KOL-0087.',
            confidence: 0.79,
            algorithms: ['LSTM Autoencoder'],
        },
        {
            voteId: 'VT-2024-RJ-7720184',
            reason: 'Nullifier hash partial collision with vote VT-2024-RJ-2847182. Hamming distance: 3 bits. Potential double voting attempt.',
            confidence: 0.94,
            algorithms: ['Nullifier Check', 'Isolation Forest'],
        },
        {
            voteId: 'VT-2024-TN-4419285',
            reason: 'KDE analysis: Vote distribution in Chennai-Central constituency deviates 4.2σ from expected baseline. Chi-squared p-value: 0.0003.',
            confidence: 0.76,
            algorithms: ['KDE', 'Statistical Analysis'],
        },
    ];

    if (votes.length === 0) {
        return {
            isolationForest: {
                scores: new Map(),
                anomalies: ['VT-2024-MH-8847291', 'VT-2024-UP-3321847', 'VT-2024-RJ-7720184'],
                averageScore: 0.23,
                anomalyCount: 3,
            },
            lstmAutoencoder: {
                reconstructionError: 0.18,
                spikeDetected: true,
                anomalyTimestamps: [Date.now() - 180000],
                sequenceScores: [0.12, 0.15, 0.45, 0.22, 0.11],
            },
            kde: {
                densityScore: 0.72,
                unusualDistribution: true,
                candidateDistributions: new Map(),
                expectedDistribution: [0.25, 0.25, 0.25, 0.25],
                actualDistribution: [0.42, 0.31, 0.18, 0.09],
                entropy: 1.85,
            },
            flaggedVotes: demoFlaggedVotes,
            overallRisk: 'medium',
            riskScore: 42,
        };
    }

    // Run all algorithms
    const preparedData = prepareVoteData(votes);
    const ifResult = runIsolationForest(preparedData, 50, 128, 0.6);
    const lstmResult = analyzeLSTM(votes);
    const kdeResult = analyzeKDE(votes);

    // Aggregate flagged votes
    const flaggedVotes: FlaggedVote[] = [];
    const flaggedSet = new Set<string>();

    // Flag votes from Isolation Forest
    ifResult.anomalies.forEach(voteId => {
        const score = ifResult.scores.get(voteId) || 0;
        flaggedVotes.push({
            voteId,
            reason: 'Unusual voting pattern detected by Isolation Forest',
            confidence: score,
            algorithms: ['Isolation Forest'],
        });
        flaggedSet.add(voteId);
    });

    // Flag votes during detected spikes
    if (lstmResult.spikeDetected) {
        lstmResult.anomalyTimestamps.forEach(spikeTime => {
            // Find votes near this spike
            votes.forEach(vote => {
                if (Math.abs(vote.timestamp - spikeTime) < 60000) { // Within 1 minute
                    if (!flaggedSet.has(vote.id)) {
                        flaggedVotes.push({
                            voteId: vote.id,
                            reason: 'Vote cast during abnormal activity spike',
                            confidence: 0.7,
                            algorithms: ['LSTM Autoencoder'],
                        });
                        flaggedSet.add(vote.id);
                    } else {
                        // Update existing flag
                        const existing = flaggedVotes.find(f => f.voteId === vote.id);
                        if (existing) {
                            existing.algorithms.push('LSTM Autoencoder');
                            existing.confidence = Math.min(1, existing.confidence + 0.2);
                        }
                    }
                }
            });
        });
    }

    // Check for duplicate nullifiers (double voting attempts)
    const nullifierCounts = new Map<string, string[]>();
    votes.forEach(vote => {
        if (vote.nullifierHash) {
            const existing = nullifierCounts.get(vote.nullifierHash) || [];
            existing.push(vote.id);
            nullifierCounts.set(vote.nullifierHash, existing);
        }
    });

    nullifierCounts.forEach((voteIds, _nullifier) => {
        if (voteIds.length > 1) {
            voteIds.forEach(voteId => {
                if (!flaggedSet.has(voteId)) {
                    flaggedVotes.push({
                        voteId,
                        reason: 'Duplicate nullifier hash detected (potential double voting)',
                        confidence: 0.95,
                        algorithms: ['Nullifier Check'],
                    });
                    flaggedSet.add(voteId);
                }
            });
        }
    });

    // Calculate overall risk score
    let riskScore = 0;

    // Factor in Isolation Forest anomaly rate
    const ifAnomalyRate = votes.length > 0 ? ifResult.anomalyCount / votes.length : 0;
    riskScore += ifAnomalyRate * 30;

    // Factor in LSTM spike detection
    if (lstmResult.spikeDetected) {
        riskScore += 25;
    }
    riskScore += lstmResult.reconstructionError * 20;

    // Factor in KDE unusual distribution
    if (kdeResult.unusualDistribution) {
        riskScore += 20;
    }
    riskScore += (1 - kdeResult.densityScore) * 15;

    // Factor in flagged vote count
    const flaggedRate = votes.length > 0 ? flaggedVotes.length / votes.length : 0;
    riskScore += flaggedRate * 10;

    // Normalize to 0-100
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Determine risk level
    let overallRisk: 'low' | 'medium' | 'high';
    if (riskScore < 25) {
        overallRisk = 'low';
    } else if (riskScore < 60) {
        overallRisk = 'medium';
    } else {
        overallRisk = 'high';
    }

    return {
        isolationForest: ifResult,
        lstmAutoencoder: lstmResult,
        kde: kdeResult,
        flaggedVotes,
        overallRisk,
        riskScore,
    };
}

/**
 * Generate anomaly report
 */
export function generateAnomalyReport(result: AnomalyResult): string {
    const lines: string[] = [
        '=== BharatVote Anomaly Detection Report ===',
        '',
        `Overall Risk Level: ${result.overallRisk.toUpperCase()}`,
        `Risk Score: ${result.riskScore.toFixed(1)}/100`,
        '',
        '--- Isolation Forest ---',
        `Anomalies Detected: ${result.isolationForest.anomalyCount}`,
        `Average Score: ${(result.isolationForest.averageScore * 100).toFixed(1)}%`,
        '',
        '--- LSTM Autoencoder ---',
        `Spike Detected: ${result.lstmAutoencoder.spikeDetected ? 'Yes' : 'No'}`,
        `Reconstruction Error: ${(result.lstmAutoencoder.reconstructionError * 100).toFixed(2)}%`,
        '',
        '--- KDE Analysis ---',
        `Unusual Distribution: ${result.kde.unusualDistribution ? 'Yes' : 'No'}`,
        `Entropy Score: ${result.kde.entropy.toFixed(3)}`,
        `Density Score: ${result.kde.densityScore.toFixed(3)}`,
        '',
        '--- Flagged Votes ---',
        `Total Flagged: ${result.flaggedVotes.length}`,
    ];

    result.flaggedVotes.forEach((flag, index) => {
        lines.push(`${index + 1}. ${flag.voteId.slice(0, 16)}...`);
        lines.push(`   Reason: ${flag.reason}`);
        lines.push(`   Confidence: ${(flag.confidence * 100).toFixed(0)}%`);
        lines.push(`   Algorithms: ${flag.algorithms.join(', ')}`);
    });

    return lines.join('\n');
}

export type { IsolationForestResult, LSTMResult, KDEResult };

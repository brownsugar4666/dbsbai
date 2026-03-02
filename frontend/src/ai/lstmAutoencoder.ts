/**
 * LSTM Autoencoder (Simplified)
 * Used for detecting time-series anomalies in voting patterns
 * 
 * This is a simplified simulation for the prototype
 * In production, use TensorFlow.js for actual neural network inference
 */

export interface LSTMResult {
    reconstructionError: number;
    spikeDetected: boolean;
    anomalyTimestamps: number[];
    sequenceScores: number[];
}

/**
 * Calculate reconstruction error for a time series
 * Higher error indicates potential anomaly
 */
function calculateReconstructionError(sequence: number[]): number {
    if (sequence.length < 2) return 0;

    // Calculate expected pattern (simple moving average as baseline)
    const windowSize = Math.min(3, sequence.length);
    const predictions: number[] = [];

    for (let i = windowSize; i < sequence.length; i++) {
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
            sum += sequence[i - j - 1];
        }
        predictions.push(sum / windowSize);
    }

    // Calculate mean squared error
    let mse = 0;
    for (let i = 0; i < predictions.length; i++) {
        const actual = sequence[i + windowSize];
        const diff = actual - predictions[i];
        mse += diff * diff;
    }

    return predictions.length > 0 ? Math.sqrt(mse / predictions.length) : 0;
}

/**
 * Detect spikes in voting activity
 * A spike is when vote rate exceeds normal by a large margin
 */
function detectSpikes(voteCounts: number[], threshold: number = 2): number[] {
    if (voteCounts.length < 3) return [];

    // Calculate mean and standard deviation
    const mean = voteCounts.reduce((a, b) => a + b, 0) / voteCounts.length;
    const variance = voteCounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / voteCounts.length;
    const std = Math.sqrt(variance);

    // Find spikes (values more than threshold standard deviations from mean)
    const spikeIndices: number[] = [];
    voteCounts.forEach((count, index) => {
        if (std > 0 && Math.abs(count - mean) > threshold * std) {
            spikeIndices.push(index);
        }
    });

    return spikeIndices;
}

/**
 * Analyze voting patterns using LSTM-like approach
 */
export function analyzeLSTM(votes: { timestamp: number }[]): LSTMResult {
    if (votes.length === 0) {
        return {
            reconstructionError: 0,
            spikeDetected: false,
            anomalyTimestamps: [],
            sequenceScores: [],
        };
    }

    // Group votes by time intervals (e.g., per minute)
    const intervalMs = 60000; // 1 minute
    const sortedVotes = [...votes].sort((a, b) => a.timestamp - b.timestamp);
    const minTime = sortedVotes[0].timestamp;
    const maxTime = sortedVotes[sortedVotes.length - 1].timestamp;

    const numIntervals = Math.max(1, Math.ceil((maxTime - minTime) / intervalMs) + 1);
    const voteCounts: number[] = new Array(numIntervals).fill(0);

    sortedVotes.forEach(vote => {
        const intervalIndex = Math.floor((vote.timestamp - minTime) / intervalMs);
        if (intervalIndex >= 0 && intervalIndex < numIntervals) {
            voteCounts[intervalIndex]++;
        }
    });

    // Calculate reconstruction error
    const error = calculateReconstructionError(voteCounts);

    // Detect spikes
    const spikeIndices = detectSpikes(voteCounts);
    const anomalyTimestamps = spikeIndices.map(idx => minTime + idx * intervalMs);

    // Calculate sequence scores (normalized vote counts)
    const maxCount = Math.max(...voteCounts, 1);
    const sequenceScores = voteCounts.map(count => count / maxCount);

    return {
        reconstructionError: error / Math.max(...voteCounts, 1), // Normalize
        spikeDetected: spikeIndices.length > 0,
        anomalyTimestamps,
        sequenceScores,
    };
}

/**
 * Prepare time series data for LSTM analysis
 */
export function prepareTimeSeriesData(
    votes: { timestamp: number }[],
    intervalMs: number = 60000
): { time: number; count: number }[] {
    if (votes.length === 0) return [];

    const sortedVotes = [...votes].sort((a, b) => a.timestamp - b.timestamp);
    const minTime = sortedVotes[0].timestamp;
    const maxTime = sortedVotes[sortedVotes.length - 1].timestamp;

    const result: { time: number; count: number }[] = [];

    for (let t = minTime; t <= maxTime; t += intervalMs) {
        const count = sortedVotes.filter(
            v => v.timestamp >= t && v.timestamp < t + intervalMs
        ).length;
        result.push({ time: t, count });
    }

    return result;
}

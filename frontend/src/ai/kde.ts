/**
 * Kernel Density Estimation (KDE)
 * Used for analyzing the distribution of voting patterns
 * 
 * Detects unusual voting distributions that may indicate fraud
 */

export interface KDEResult {
    densityScore: number;
    unusualDistribution: boolean;
    candidateDistributions: Map<string, number>;
    expectedDistribution: number[];
    actualDistribution: number[];
    entropy: number;
}

/**
 * Gaussian kernel function
 */
function gaussian(x: number): number {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate KDE for a set of values
 */
function kde(values: number[], bandwidth: number, point: number): number {
    if (values.length === 0) return 0;

    let sum = 0;
    for (const value of values) {
        sum += gaussian((point - value) / bandwidth);
    }
    return sum / (values.length * bandwidth);
}

/**
 * Calculate entropy of a distribution
 * Lower entropy = more concentrated votes (potentially suspicious)
 */
function calculateEntropy(distribution: number[]): number {
    const total = distribution.reduce((a, b) => a + b, 0);
    if (total === 0) return 0;

    let entropy = 0;
    for (const count of distribution) {
        if (count > 0) {
            const p = count / total;
            entropy -= p * Math.log2(p);
        }
    }
    return entropy;
}

/**
 * Calculate expected uniform distribution
 */
function expectedUniformEntropy(numCategories: number): number {
    if (numCategories <= 1) return 0;
    return Math.log2(numCategories);
}

/**
 * Analyze vote distribution using KDE
 */
export function analyzeKDE(votes: { candidateId: string; timestamp: number }[]): KDEResult {
    if (votes.length === 0) {
        return {
            densityScore: 0,
            unusualDistribution: false,
            candidateDistributions: new Map(),
            expectedDistribution: [],
            actualDistribution: [],
            entropy: 0,
        };
    }

    // Count votes per candidate
    const candidateCounts = new Map<string, number>();
    votes.forEach(vote => {
        candidateCounts.set(
            vote.candidateId,
            (candidateCounts.get(vote.candidateId) || 0) + 1
        );
    });

    // Get unique candidates
    const candidates = Array.from(candidateCounts.keys()).sort();
    const actualDistribution = candidates.map(c => candidateCounts.get(c) || 0);

    // Calculate expected uniform distribution
    const numCandidates = candidates.length;
    const expectedPerCandidate = votes.length / numCandidates;
    const expectedDistribution = new Array(numCandidates).fill(expectedPerCandidate);

    // Calculate entropy
    const entropy = calculateEntropy(actualDistribution);
    const maxEntropy = expectedUniformEntropy(numCandidates);

    // Entropy ratio: 0 = all votes for one candidate, 1 = perfectly uniform
    const entropyRatio = maxEntropy > 0 ? entropy / maxEntropy : 1;

    // KDE-based density analysis on vote timestamps
    // Detect if votes are clustered in time (potential coordinated voting)
    const timestamps = votes.map(v => v.timestamp);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeRange = maxTime - minTime || 1;

    // Normalize timestamps to [0, 1]
    const normalizedTimes = timestamps.map(t => (t - minTime) / timeRange);

    // Calculate bandwidth using Silverman's rule
    const n = normalizedTimes.length;
    const std = Math.sqrt(
        normalizedTimes.reduce((sum, t) => {
            const mean = 0.5;
            return sum + Math.pow(t - mean, 2);
        }, 0) / n
    );
    const bandwidth = 1.06 * std * Math.pow(n, -0.2) || 0.1;

    // Sample density at multiple points
    const numSamples = 10;
    let densitySum = 0;
    let densityMax = 0;

    for (let i = 0; i < numSamples; i++) {
        const point = i / (numSamples - 1);
        const density = kde(normalizedTimes, bandwidth, point);
        densitySum += density;
        densityMax = Math.max(densityMax, density);
    }

    // High density peak relative to mean indicates clustering
    const avgDensity = densitySum / numSamples;
    const densityScore = avgDensity > 0 ? densityMax / avgDensity : 1;

    // Determine if distribution is unusual
    // Either entropy is too low (vote concentration) or density is too high (time clustering)
    const unusualDistribution = entropyRatio < 0.5 || densityScore > 3;

    return {
        densityScore: entropyRatio,
        unusualDistribution,
        candidateDistributions: candidateCounts,
        expectedDistribution,
        actualDistribution,
        entropy,
    };
}

/**
 * Compare two distributions using Chi-squared test
 */
export function chiSquaredTest(observed: number[], expected: number[]): number {
    if (observed.length !== expected.length || observed.length === 0) {
        return 0;
    }

    let chiSquared = 0;
    for (let i = 0; i < observed.length; i++) {
        if (expected[i] > 0) {
            const diff = observed[i] - expected[i];
            chiSquared += (diff * diff) / expected[i];
        }
    }

    return chiSquared;
}

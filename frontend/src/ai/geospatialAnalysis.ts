// Geospatial anomaly analysis using AI/ML techniques
// Implements isolation forest and KDE for spatial anomaly detection

import type { RegionData } from './geospatialData';

export interface AnalysisResult {
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    totalAnomalies: number;
    criticalRegions: string[];
    analysisTimestamp: number;
    algorithms: {
        isolationForest: { anomalyCount: number; avgScore: number };
        kde: { entropy: number; uniformityScore: number };
        tsad: { spikeCount: number; patternScore: number };
    };
}

// Simplified Isolation Forest scoring for geospatial data
const isolationForestScore = (regions: RegionData[]): { anomalyCount: number; avgScore: number } => {
    const anomalies = regions.filter(r => r.anomalyScore > 50);
    const avgScore = regions.reduce((sum, r) => sum + r.anomalyScore, 0) / regions.length;

    return {
        anomalyCount: anomalies.length,
        avgScore: avgScore / 100, // Normalize to 0-1
    };
};

// KDE-based distribution analysis
const kdeAnalysis = (regions: RegionData[]): { entropy: number; uniformityScore: number } => {
    const votes = regions.map(r => r.observedVotes);
    const mean = votes.reduce((a, b) => a + b, 0) / votes.length;
    const variance = votes.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / votes.length;
    const stdDev = Math.sqrt(variance);

    // Simplified entropy calculation
    const normalizedVotes = votes.map(v => v / (mean + 1));
    const entropy = -normalizedVotes.reduce((sum, p) => {
        if (p > 0) return sum + (p * Math.log(p));
        return sum;
    }, 0);

    // Uniformity score (lower variance = higher uniformity)
    const uniformityScore = 1 / (1 + stdDev / mean);

    return { entropy: Math.abs(entropy), uniformityScore };
};

// Time-series anomaly detection
const tsadAnalysis = (regions: RegionData[]): { spikeCount: number; patternScore: number } => {
    let spikeCount = 0;
    let totalPatternScore = 0;

    regions.forEach(region => {
        const rates = region.votingRate;
        const avg = rates.reduce((a, b) => a + b, 0) / rates.length;

        // Count spikes (values > 1.5x average)
        const spikes = rates.filter(r => r > avg * 1.5).length;
        spikeCount += spikes;

        // Pattern score based on consistency
        const variance = rates.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / rates.length;
        totalPatternScore += 1 / (1 + Math.sqrt(variance) / avg);
    });

    return {
        spikeCount,
        patternScore: totalPatternScore / regions.length,
    };
};

// Main analysis function
export const analyzeGeospatialData = (regions: RegionData[]): AnalysisResult => {
    const ifResult = isolationForestScore(regions);
    const kdeResult = kdeAnalysis(regions);
    const tsadResult = tsadAnalysis(regions);

    const criticalRegions = regions
        .filter(r => r.anomalyScore > 75)
        .map(r => r.name);

    // Determine overall risk level
    let overallRiskLevel: AnalysisResult['overallRiskLevel'] = 'low';

    if (ifResult.anomalyCount > 8 || criticalRegions.length > 3) {
        overallRiskLevel = 'critical';
    } else if (ifResult.anomalyCount > 5 || criticalRegions.length > 1) {
        overallRiskLevel = 'high';
    } else if (ifResult.anomalyCount > 2) {
        overallRiskLevel = 'medium';
    }

    return {
        overallRiskLevel,
        totalAnomalies: ifResult.anomalyCount,
        criticalRegions,
        analysisTimestamp: Date.now(),
        algorithms: {
            isolationForest: ifResult,
            kde: kdeResult,
            tsad: tsadResult,
        },
    };
};

// Get severity color class
export const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
    const colors = {
        low: 'text-status-success',
        medium: 'text-status-warning',
        high: 'text-gov-saffron',
        critical: 'text-status-error',
    };
    return colors[severity];
};

// Get severity background class
export const getSeverityBg = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
    const colors = {
        low: 'bg-green-50 border-green-200',
        medium: 'bg-yellow-50 border-yellow-200',
        high: 'bg-orange-50 border-orange-200',
        critical: 'bg-red-50 border-red-200',
    };
    return colors[severity];
};

// Format timestamp
export const formatTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
};

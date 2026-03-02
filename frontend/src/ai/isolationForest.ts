/**
 * Isolation Forest Algorithm Implementation
 * Used for detecting outlier voting patterns
 * 
 * This is a simplified JavaScript implementation suitable for browser execution
 */

interface DataPoint {
    features: number[];
    id: string;
}

interface IsolationTree {
    splitFeature?: number;
    splitValue?: number;
    left?: IsolationTree;
    right?: IsolationTree;
    size?: number;
}

// Average path length for a dataset of size n
function averagePathLength(n: number): number {
    if (n <= 1) return 0;
    if (n === 2) return 1;
    const H = Math.log(n - 1) + 0.5772156649; // Euler-Mascheroni constant
    return 2 * H - (2 * (n - 1)) / n;
}

// Build a single isolation tree
function buildTree(data: DataPoint[], height: number, maxHeight: number): IsolationTree {
    if (height >= maxHeight || data.length <= 1) {
        return { size: data.length };
    }

    // Random feature selection
    const numFeatures = data[0].features.length;
    const featureIndex = Math.floor(Math.random() * numFeatures);

    // Get min and max for the selected feature
    const values = data.map(d => d.features[featureIndex]);
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
        return { size: data.length };
    }

    // Random split value
    const splitValue = min + Math.random() * (max - min);

    // Partition data
    const left = data.filter(d => d.features[featureIndex] < splitValue);
    const right = data.filter(d => d.features[featureIndex] >= splitValue);

    return {
        splitFeature: featureIndex,
        splitValue,
        left: buildTree(left, height + 1, maxHeight),
        right: buildTree(right, height + 1, maxHeight),
    };
}

// Calculate path length for a single point
function pathLength(point: DataPoint, tree: IsolationTree, height: number): number {
    if (tree.size !== undefined) {
        return height + averagePathLength(tree.size);
    }

    if (tree.splitFeature === undefined || tree.splitValue === undefined) {
        return height;
    }

    const value = point.features[tree.splitFeature];
    if (value < tree.splitValue) {
        return pathLength(point, tree.left!, height + 1);
    } else {
        return pathLength(point, tree.right!, height + 1);
    }
}

// Calculate anomaly score
function anomalyScore(point: DataPoint, forest: IsolationTree[], n: number): number {
    const avgPathLength = forest.reduce((sum, tree) => sum + pathLength(point, tree, 0), 0) / forest.length;
    const c = averagePathLength(n);
    return Math.pow(2, -avgPathLength / c);
}

export interface IsolationForestResult {
    scores: Map<string, number>;
    anomalies: string[];
    averageScore: number;
    anomalyCount: number;
}

/**
 * Run Isolation Forest algorithm on voting data
 * Returns anomaly scores for each vote
 */
export function runIsolationForest(
    data: DataPoint[],
    numTrees: number = 100,
    sampleSize: number = 256,
    threshold: number = 0.6
): IsolationForestResult {
    if (data.length === 0) {
        return {
            scores: new Map(),
            anomalies: [],
            averageScore: 0,
            anomalyCount: 0,
        };
    }

    const maxHeight = Math.ceil(Math.log2(Math.min(sampleSize, data.length)));
    const forest: IsolationTree[] = [];

    // Build forest
    for (let i = 0; i < numTrees; i++) {
        // Sample data
        const sample: DataPoint[] = [];
        const actualSampleSize = Math.min(sampleSize, data.length);
        const indices = new Set<number>();

        while (indices.size < actualSampleSize) {
            indices.add(Math.floor(Math.random() * data.length));
        }

        indices.forEach(idx => sample.push(data[idx]));

        forest.push(buildTree(sample, 0, maxHeight));
    }

    // Calculate scores for all points
    const scores = new Map<string, number>();
    let totalScore = 0;
    const anomalies: string[] = [];

    data.forEach(point => {
        const score = anomalyScore(point, forest, data.length);
        scores.set(point.id, score);
        totalScore += score;

        if (score > threshold) {
            anomalies.push(point.id);
        }
    });

    return {
        scores,
        anomalies,
        averageScore: data.length > 0 ? totalScore / data.length : 0,
        anomalyCount: anomalies.length,
    };
}

/**
 * Prepare vote data for Isolation Forest
 * Extracts numerical features from vote records
 */
export function prepareVoteData(votes: {
    id: string;
    timestamp: number;
    candidateId: string;
}[]): DataPoint[] {
    if (votes.length === 0) return [];

    const minTime = Math.min(...votes.map(v => v.timestamp));
    const maxTime = Math.max(...votes.map(v => v.timestamp));
    const timeRange = maxTime - minTime || 1;

    return votes.map((vote, index) => {
        // Calculate features
        const normalizedTime = (vote.timestamp - minTime) / timeRange;

        // Time gap from previous vote
        const prevVote = index > 0 ? votes[index - 1] : vote;
        const timeGap = (vote.timestamp - prevVote.timestamp) / 1000; // in seconds
        const normalizedGap = Math.min(timeGap / 60, 1); // normalize to 0-1 (max 60 sec)

        // Candidate distribution
        const candidateNum = parseInt(vote.candidateId) || 0;
        const normalizedCandidate = candidateNum / 10;

        return {
            id: vote.id,
            features: [normalizedTime, normalizedGap, normalizedCandidate],
        };
    });
}

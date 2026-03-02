// Synthetic geospatial data for Indian states/regions
// Used for demo purposes - no real election data

export interface RegionData {
    id: string;
    name: string;
    code: string;
    centroid: { x: number; y: number };
    expectedVotes: number;
    observedVotes: number;
    anomalyScore: number;
    anomalyType: 'none' | 'spike' | 'drop' | 'temporal' | 'cluster';
    lastUpdated: number;
    votingRate: number[]; // Last 12 intervals
}

export interface AnomalyAlert {
    id: string;
    regionId: string;
    regionName: string;
    type: 'spike' | 'drop' | 'temporal' | 'cluster';
    score: number;
    reasoning: string;
    timestamp: number;
    severity: 'low' | 'medium' | 'high';
}

// Indian states with simplified map coordinates
export const indianStates: Omit<RegionData, 'expectedVotes' | 'observedVotes' | 'anomalyScore' | 'anomalyType' | 'lastUpdated' | 'votingRate'>[] = [
    { id: 'AP', name: 'Andhra Pradesh', code: 'AP', centroid: { x: 280, y: 380 } },
    { id: 'AR', name: 'Arunachal Pradesh', code: 'AR', centroid: { x: 450, y: 150 } },
    { id: 'AS', name: 'Assam', code: 'AS', centroid: { x: 420, y: 180 } },
    { id: 'BR', name: 'Bihar', code: 'BR', centroid: { x: 330, y: 220 } },
    { id: 'CG', name: 'Chhattisgarh', code: 'CG', centroid: { x: 280, y: 290 } },
    { id: 'GA', name: 'Goa', code: 'GA', centroid: { x: 170, y: 390 } },
    { id: 'GJ', name: 'Gujarat', code: 'GJ', centroid: { x: 140, y: 280 } },
    { id: 'HR', name: 'Haryana', code: 'HR', centroid: { x: 200, y: 170 } },
    { id: 'HP', name: 'Himachal Pradesh', code: 'HP', centroid: { x: 210, y: 120 } },
    { id: 'JK', name: 'Jammu & Kashmir', code: 'JK', centroid: { x: 180, y: 80 } },
    { id: 'JH', name: 'Jharkhand', code: 'JH', centroid: { x: 330, y: 260 } },
    { id: 'KA', name: 'Karnataka', code: 'KA', centroid: { x: 200, y: 400 } },
    { id: 'KL', name: 'Kerala', code: 'KL', centroid: { x: 200, y: 470 } },
    { id: 'MP', name: 'Madhya Pradesh', code: 'MP', centroid: { x: 230, y: 270 } },
    { id: 'MH', name: 'Maharashtra', code: 'MH', centroid: { x: 195, y: 330 } },
    { id: 'MN', name: 'Manipur', code: 'MN', centroid: { x: 450, y: 220 } },
    { id: 'ML', name: 'Meghalaya', code: 'ML', centroid: { x: 400, y: 200 } },
    { id: 'MZ', name: 'Mizoram', code: 'MZ', centroid: { x: 440, y: 250 } },
    { id: 'NL', name: 'Nagaland', code: 'NL', centroid: { x: 460, y: 190 } },
    { id: 'OD', name: 'Odisha', code: 'OD', centroid: { x: 320, y: 320 } },
    { id: 'PB', name: 'Punjab', code: 'PB', centroid: { x: 185, y: 140 } },
    { id: 'RJ', name: 'Rajasthan', code: 'RJ', centroid: { x: 160, y: 220 } },
    { id: 'SK', name: 'Sikkim', code: 'SK', centroid: { x: 370, y: 180 } },
    { id: 'TN', name: 'Tamil Nadu', code: 'TN', centroid: { x: 230, y: 460 } },
    { id: 'TS', name: 'Telangana', code: 'TS', centroid: { x: 250, y: 350 } },
    { id: 'TR', name: 'Tripura', code: 'TR', centroid: { x: 420, y: 240 } },
    { id: 'UP', name: 'Uttar Pradesh', code: 'UP', centroid: { x: 265, y: 210 } },
    { id: 'UK', name: 'Uttarakhand', code: 'UK', centroid: { x: 235, y: 140 } },
    { id: 'WB', name: 'West Bengal', code: 'WB', centroid: { x: 370, y: 260 } },
    { id: 'DL', name: 'Delhi', code: 'DL', centroid: { x: 215, y: 175 } },
];

// Generate random voting rate history
const generateVotingHistory = (): number[] => {
    const baseline = 50 + Math.random() * 100;
    return Array.from({ length: 12 }, () =>
        Math.max(0, baseline + (Math.random() - 0.5) * 40)
    );
};

// Generate synthetic region data with random anomalies
export const generateRegionData = (): RegionData[] => {
    return indianStates.map(state => {
        const expectedVotes = Math.floor(10000 + Math.random() * 50000);
        const hasAnomaly = Math.random() < 0.25; // 25% chance of anomaly

        let observedVotes = expectedVotes;
        let anomalyType: RegionData['anomalyType'] = 'none';
        let anomalyScore = Math.random() * 20; // Low baseline score

        if (hasAnomaly) {
            const anomalyTypes: RegionData['anomalyType'][] = ['spike', 'drop', 'temporal', 'cluster'];
            anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];

            switch (anomalyType) {
                case 'spike':
                    observedVotes = Math.floor(expectedVotes * (1.3 + Math.random() * 0.5));
                    anomalyScore = 60 + Math.random() * 35;
                    break;
                case 'drop':
                    observedVotes = Math.floor(expectedVotes * (0.4 + Math.random() * 0.3));
                    anomalyScore = 50 + Math.random() * 30;
                    break;
                case 'temporal':
                    observedVotes = Math.floor(expectedVotes * (0.9 + Math.random() * 0.2));
                    anomalyScore = 40 + Math.random() * 35;
                    break;
                case 'cluster':
                    observedVotes = Math.floor(expectedVotes * (1.1 + Math.random() * 0.3));
                    anomalyScore = 55 + Math.random() * 30;
                    break;
            }
        }

        return {
            ...state,
            expectedVotes,
            observedVotes,
            anomalyScore,
            anomalyType,
            lastUpdated: Date.now(),
            votingRate: generateVotingHistory(),
        };
    });
};

// Generate alerts from region data
export const generateAlerts = (regions: RegionData[]): AnomalyAlert[] => {
    const anomalousRegions = regions.filter(r => r.anomalyType !== 'none');

    const reasonings: Record<string, string[]> = {
        spike: [
            'Sudden 40% increase in voting rate detected in last 30 minutes',
            'Voting pattern deviates significantly from historical baseline',
            'Unusual surge in ballot submissions from single polling stations',
        ],
        drop: [
            'Voting rate dropped below expected threshold by 35%',
            'Multiple polling booths reporting lower than expected turnout',
            'Temporal gap detected in voting submissions',
        ],
        temporal: [
            'Voting timestamps show irregular clustering patterns',
            'Time-series analysis detected burst patterns inconsistent with normal flow',
            'LSTM autoencoder flagged sequence anomaly',
        ],
        cluster: [
            'Geographic cluster of similar voting patterns detected',
            'Adjacent constituencies showing correlated anomalies',
            'Spatial autocorrelation exceeds normal variance',
        ],
    };

    return anomalousRegions.map(region => ({
        id: `alert-${region.id}-${Date.now()}`,
        regionId: region.id,
        regionName: region.name,
        type: region.anomalyType as 'spike' | 'drop' | 'temporal' | 'cluster',
        score: region.anomalyScore,
        reasoning: reasonings[region.anomalyType]?.[Math.floor(Math.random() * 3)] || 'Anomaly detected',
        timestamp: Date.now() - Math.floor(Math.random() * 600000), // Random time in last 10 min
        severity: region.anomalyScore > 75 ? 'high' : region.anomalyScore > 50 ? 'medium' : 'low',
    }));
};

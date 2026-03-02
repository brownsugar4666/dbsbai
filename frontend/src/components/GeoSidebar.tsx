import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, MapPin, ChevronRight } from 'lucide-react';
import type { AnomalyAlert, RegionData } from '../ai/geospatialData';
import type { AnalysisResult } from '../ai/geospatialAnalysis';
import { getSeverityBg, formatTime } from '../ai/geospatialAnalysis';
import { Card, CardHeader, Button } from './index';

interface GeoSidebarProps {
    alerts: AnomalyAlert[];
    selectedRegion: RegionData | null;
    analysis: AnalysisResult | null;
    onAlertClick: (regionId: string) => void;
}

// Mini sparkline chart
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-20 h-8" preserveAspectRatio="none">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export const GeoSidebar: React.FC<GeoSidebarProps> = ({
    alerts,
    selectedRegion,
    analysis,
    onAlertClick,
}) => {
    const getAnomalyIcon = (type: string) => {
        switch (type) {
            case 'spike': return <TrendingUp className="w-4 h-4 text-status-error" />;
            case 'drop': return <TrendingDown className="w-4 h-4 text-status-warning" />;
            case 'temporal': return <Clock className="w-4 h-4 text-gov-saffron" />;
            case 'cluster': return <MapPin className="w-4 h-4 text-status-info" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-4 h-full overflow-y-auto">
            {/* Analysis Summary */}
            {analysis && (
                <Card className="p-4">
                    <CardHeader title="System Analysis" />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-surface-subtle rounded-lg">
                            <p className="text-xs text-muted uppercase tracking-wide">Risk Level</p>
                            <p className={`text-lg font-bold capitalize ${analysis.overallRiskLevel === 'critical' ? 'text-status-error' :
                                    analysis.overallRiskLevel === 'high' ? 'text-gov-saffron' :
                                        analysis.overallRiskLevel === 'medium' ? 'text-status-warning' :
                                            'text-status-success'
                                }`}>
                                {analysis.overallRiskLevel}
                            </p>
                        </div>
                        <div className="p-3 bg-surface-subtle rounded-lg">
                            <p className="text-xs text-muted uppercase tracking-wide">Anomalies</p>
                            <p className="text-lg font-bold text-gov-navy">{analysis.totalAnomalies}</p>
                        </div>
                    </div>

                    {/* Algorithm scores */}
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">Isolation Forest</span>
                            <span className="text-gov-navy font-medium">
                                {(analysis.algorithms.isolationForest.avgScore * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">KDE Entropy</span>
                            <span className="text-gov-navy font-medium">
                                {analysis.algorithms.kde.entropy.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">TSAD Spikes</span>
                            <span className="text-gov-navy font-medium">
                                {analysis.algorithms.tsad.spikeCount}
                            </span>
                        </div>
                    </div>
                </Card>
            )}

            {/* Selected Region Detail */}
            {selectedRegion && (
                <Card className="p-4 border-l-4 border-l-gov-saffron">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h4 className="font-semibold text-gov-navy">{selectedRegion.name}</h4>
                            <p className="text-xs text-muted">Region: {selectedRegion.code}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${selectedRegion.anomalyScore > 75 ? 'bg-red-100 text-red-700' :
                                selectedRegion.anomalyScore > 50 ? 'bg-orange-100 text-orange-700' :
                                    'bg-green-100 text-green-700'
                            }`}>
                            Score: {selectedRegion.anomalyScore.toFixed(0)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-muted">Expected</p>
                            <p className="font-semibold text-gov-navy">{selectedRegion.expectedVotes.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-muted">Observed</p>
                            <p className="font-semibold text-gov-navy">{selectedRegion.observedVotes.toLocaleString()}</p>
                        </div>
                    </div>

                    {selectedRegion.anomalyType !== 'none' && (
                        <div className="mt-3 p-3 bg-surface-subtle rounded-lg">
                            <p className="text-xs text-muted uppercase tracking-wide mb-1">Anomaly Type</p>
                            <p className="text-sm font-medium text-gov-saffron capitalize">{selectedRegion.anomalyType}</p>
                        </div>
                    )}

                    {/* Mini trendline */}
                    <div className="mt-3">
                        <p className="text-xs text-muted mb-2">Voting Rate (Last 12 intervals)</p>
                        <Sparkline
                            data={selectedRegion.votingRate}
                            color={selectedRegion.anomalyType !== 'none' ? '#FF9933' : '#0A1A2F'}
                        />
                    </div>

                    <Button variant="secondary" className="w-full mt-4" size="sm">
                        View Detailed Audit
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </Card>
            )}

            {/* Alerts List */}
            <Card className="p-4">
                <CardHeader
                    title="Active Alerts"
                    subtitle={`${alerts.length} anomalies detected`}
                />

                {alerts.length === 0 ? (
                    <div className="text-center py-6">
                        <AlertTriangle className="w-8 h-8 mx-auto text-muted opacity-40 mb-2" />
                        <p className="text-sm text-muted">No anomalies detected</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {alerts.slice(0, 8).map((alert) => (
                            <button
                                key={alert.id}
                                onClick={() => onAlertClick(alert.regionId)}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getSeverityBg(alert.severity)}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {getAnomalyIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium text-gov-navy text-sm truncate">{alert.regionName}</p>
                                            <span className="text-xs text-muted whitespace-nowrap">{formatTime(alert.timestamp)}</span>
                                        </div>
                                        <p className="text-xs text-secondary mt-1 line-clamp-2">{alert.reasoning}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default GeoSidebar;

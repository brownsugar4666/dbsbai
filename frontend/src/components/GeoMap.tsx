import React, { useState } from 'react';
import type { RegionData } from '../ai/geospatialData';

interface GeoMapProps {
    regions: RegionData[];
    selectedRegion: string | null;
    onRegionSelect: (regionId: string | null) => void;
}

export const GeoMap: React.FC<GeoMapProps> = ({ regions, selectedRegion, onRegionSelect }) => {
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    const getRegionColor = (region: RegionData) => {
        if (region.anomalyType === 'none') {
            return '#1A2E4A'; // Navy light
        }

        // Color based on anomaly score
        if (region.anomalyScore > 75) return '#EF4444'; // Red - critical
        if (region.anomalyScore > 50) return '#FF9933'; // Saffron - high
        return '#EAB308'; // Yellow - medium
    };

    const getRegionGlow = (region: RegionData) => {
        if (region.anomalyType === 'none') return 'none';
        if (region.anomalyScore > 75) return '0 0 20px rgba(239, 68, 68, 0.6)';
        if (region.anomalyScore > 50) return '0 0 15px rgba(255, 153, 51, 0.5)';
        return '0 0 10px rgba(234, 179, 8, 0.4)';
    };

    const hoveredData = hoveredRegion ? regions.find(r => r.id === hoveredRegion) : null;

    return (
        <div className="relative bg-gov-navy rounded-xl p-4 md:p-6 h-full min-h-[400px]">
            {/* Map Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">India - Voting Regions</h3>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-gov-navy-light" />
                        <span className="text-white/60">Normal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-gov-saffron" />
                        <span className="text-white/60">Suspicious</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-status-error" />
                        <span className="text-white/60">Critical</span>
                    </div>
                </div>
            </div>

            {/* SVG Map Container */}
            <div className="relative aspect-[4/5] max-h-[500px]">
                <svg
                    viewBox="0 0 500 550"
                    className="w-full h-full"
                    aria-label="Interactive map of India showing voting anomalies"
                >
                    {/* India outline (simplified) */}
                    <path
                        d="M180 60 L150 80 L130 120 L100 150 L90 200 L100 250 L80 300 L100 350 
               L130 380 L150 420 L180 470 L220 510 L260 520 L300 500 L340 460 
               L360 400 L380 350 L400 300 L420 250 L450 200 L470 150 L450 120 
               L420 100 L380 90 L340 80 L300 70 L260 60 L220 55 Z"
                        fill="#0F2744"
                        stroke="#1A2E4A"
                        strokeWidth="2"
                    />

                    {/* State/Region dots */}
                    {regions.map((region) => {
                        const isSelected = selectedRegion === region.id;
                        const isHovered = hoveredRegion === region.id;
                        const hasAnomaly = region.anomalyType !== 'none';

                        return (
                            <g key={region.id}>
                                {/* Glow effect for anomalies */}
                                {hasAnomaly && (
                                    <circle
                                        cx={region.centroid.x}
                                        cy={region.centroid.y}
                                        r={isHovered || isSelected ? 28 : 22}
                                        fill={getRegionColor(region)}
                                        opacity={0.3}
                                        className="animate-pulse"
                                    />
                                )}

                                {/* Main dot */}
                                <circle
                                    cx={region.centroid.x}
                                    cy={region.centroid.y}
                                    r={isHovered || isSelected ? 14 : 10}
                                    fill={getRegionColor(region)}
                                    stroke={isSelected ? 'white' : 'transparent'}
                                    strokeWidth={2}
                                    style={{
                                        cursor: 'pointer',
                                        filter: hasAnomaly ? getRegionGlow(region) : 'none',
                                        transition: 'all 0.2s ease-out',
                                    }}
                                    onMouseEnter={() => setHoveredRegion(region.id)}
                                    onMouseLeave={() => setHoveredRegion(null)}
                                    onClick={() => onRegionSelect(isSelected ? null : region.id)}
                                />

                                {/* State code label */}
                                <text
                                    x={region.centroid.x}
                                    y={region.centroid.y + 4}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="8"
                                    fontWeight="600"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {region.code}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip */}
                {hoveredData && (
                    <div
                        className="absolute bg-white rounded-lg shadow-lg p-4 z-10 pointer-events-none animate-fade-in"
                        style={{
                            left: Math.min(hoveredData.centroid.x * 0.8, 280),
                            top: Math.min(hoveredData.centroid.y * 0.75, 350),
                            minWidth: '200px',
                        }}
                    >
                        <p className="font-semibold text-gov-navy">{hoveredData.name}</p>
                        <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted">Expected:</span>
                                <span className="text-gov-navy font-medium">{hoveredData.expectedVotes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Observed:</span>
                                <span className="text-gov-navy font-medium">{hoveredData.observedVotes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Anomaly Score:</span>
                                <span className={`font-semibold ${hoveredData.anomalyScore > 75 ? 'text-status-error' :
                                        hoveredData.anomalyScore > 50 ? 'text-gov-saffron' :
                                            'text-status-success'
                                    }`}>
                                    {hoveredData.anomalyScore.toFixed(0)}
                                </span>
                            </div>
                            {hoveredData.anomalyType !== 'none' && (
                                <div className="flex justify-between">
                                    <span className="text-muted">Type:</span>
                                    <span className="text-gov-saffron capitalize">{hoveredData.anomalyType}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Live indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span className="text-xs text-white/60">Live Monitoring</span>
            </div>
        </div>
    );
};

export default GeoMap;

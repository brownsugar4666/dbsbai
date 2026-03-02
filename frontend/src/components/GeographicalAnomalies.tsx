import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, MapPin } from 'lucide-react';
import { GeoMap } from './GeoMap';
import { GeoSidebar } from './GeoSidebar';
import { Button, Card } from './index';
import { generateRegionData, generateAlerts, type RegionData, type AnomalyAlert } from '../ai/geospatialData';
import { analyzeGeospatialData, type AnalysisResult } from '../ai/geospatialAnalysis';

export const GeographicalAnomalies: React.FC = () => {
    const [regions, setRegions] = useState<RegionData[]>([]);
    const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Generate initial data
    const refreshData = useCallback(async () => {
        setIsRefreshing(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newRegions = generateRegionData();
        const newAlerts = generateAlerts(newRegions);
        const newAnalysis = analyzeGeospatialData(newRegions);

        setRegions(newRegions);
        setAlerts(newAlerts.sort((a, b) => b.score - a.score)); // Sort by severity
        setAnalysis(newAnalysis);
        setLastUpdate(new Date());
        setIsRefreshing(false);
    }, []);

    // Initial load
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Auto-refresh every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 15000);

        return () => clearInterval(interval);
    }, [refreshData]);

    const handleRegionSelect = (regionId: string | null) => {
        setSelectedRegion(regionId);
    };

    const handleAlertClick = (regionId: string) => {
        setSelectedRegion(regionId);
    };

    const selectedRegionData = selectedRegion
        ? regions.find(r => r.id === selectedRegion) || null
        : null;

    return (
        <section className="py-8 animate-fade-in">
            {/* Section Header */}
            <Card className="p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gov-navy flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gov-navy">Geographical Anomalies</h2>
                            <p className="text-sm text-muted">AI-powered geospatial voting pattern analysis</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted">
                            Last update: {lastUpdate.toLocaleTimeString('en-IN')}
                        </div>
                        <Button
                            onClick={refreshData}
                            isLoading={isRefreshing}
                            leftIcon={<RefreshCw className="w-4 h-4" />}
                            size="sm"
                        >
                            Refresh
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map - Left Side (2 cols) */}
                <div className="lg:col-span-2">
                    <GeoMap
                        regions={regions}
                        selectedRegion={selectedRegion}
                        onRegionSelect={handleRegionSelect}
                    />
                </div>

                {/* Sidebar - Right Side (1 col) */}
                <div className="lg:col-span-1">
                    <GeoSidebar
                        alerts={alerts}
                        selectedRegion={selectedRegionData}
                        analysis={analysis}
                        onAlertClick={handleAlertClick}
                    />
                </div>
            </div>

            {/* Critical Regions Banner */}
            {analysis && analysis.criticalRegions.length > 0 && (
                <Card className="mt-6 p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-status-error flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">{analysis.criticalRegions.length}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-red-800">Critical Regions Detected</p>
                            <p className="text-sm text-red-700">
                                {analysis.criticalRegions.join(', ')} require immediate attention
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </section>
    );
};

export default GeographicalAnomalies;

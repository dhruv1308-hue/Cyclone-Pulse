import React, { useState, useMemo } from 'react';
import { CycloneScenario } from '../types/cyclone';
import { EvaluatedSimulation, analyzeWindPatterns } from '../utils/simulationEngine';
import { Download, Radio, Waves, RefreshCw, Zap, MapPin, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  scenarios: CycloneScenario[];
  activeScenario: CycloneScenario;
  onSelectScenario: (id: string) => void;
  evaluated: EvaluatedSimulation;
  onOpenSitrep: () => void;
  onOpenLocationSearch: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  activeScenario,
  onSelectScenario,
  evaluated,
  onOpenSitrep,
  onOpenLocationSearch,
  onReset
}) => {
  const { activePoint } = evaluated;
  const [selectedMode, setSelectedMode] = useState<'real-time' | 'prediction' | 'historical'>('real-time');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const analysis = useMemo(() => {
    if (!activePoint) return null;
    return analyzeWindPatterns(
      scenarios.find(s => s.id === selectedScenarioId)?.track || [],
      -6, // current hour offset
      28.5 // assumed sea surface temp
    );
  }, [selectedScenarioId]);

  const handleModeChange = (mode: 'real-time' | 'prediction' | 'historical') => {
    setSelectedMode(mode);
    // When switching modes, keep the same scenario but may affect display
    if (mode === 'historical') {
      // Show historical cyclones - could filter or show different options
      setSelectedScenarioId(scenarios[0].id);
    }
  };

  // Get the selected scenario

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Mission Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Waves className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              CyclonePulse
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Coastal Infrastructure Vulnerability & Evacuation Intelligence Platform
          </p>
        </div>
      </div>

      {/* Prediction Mode & Scenario Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Prediction Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-400">Mode:</span>
          <select
            value={selectedMode}
            onChange={(e) => handleModeChange(e.target.value as 'real-time' | 'prediction' | 'historical')}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="real-time">Real-time</option>
            <option value="prediction">Wind Pattern Prediction</option>
            <option value="historical">Historical Comparison</option>
          </select>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-400">Cyclone:</span>
          <select
            value={selectedScenarioId}
            onChange={(e) => {
              setSelectedScenarioId(e.target.value);
              onSelectScenario(e.target.value);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[200px] truncate"
          >
            {scenarios.map(sc => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Live Storm Intensity Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-semibold">{activePoint.windSpeedKmh} km/h</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300">
            {activePoint.centralPressureHpa} hPa
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-cyan-400 font-semibold">
            +{activePoint.estimatedSurgeHeightM}m Surge
          </div>
        </div>

        {/* Prediction Insights (shown in prediction mode) */}
        {selectedMode === 'prediction' && analysis && (
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-medium text-orange-300">
              {analysis.predictedIntensityChange}
            </span>
            <span className="text-slate-500 text-[10px]"> in {analysis.predictionHorizonHours}h
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSitrep}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-medium text-xs px-3 py-2 rounded-lg transition-all shadow-md shadow-cyan-900/30 active:scale-95"
            title="Generate Common Alerting Protocol & SITREP PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate SITREP</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Simulation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useMemo } from 'react';
import { SCENARIOS } from './data/scenarios';
import { CycloneScenario, SimulationState } from './types/cyclone';
import { runCycloneSimulation } from './utils/simulationEngine';
import { Header } from './components/Header';
import { SimulationControls } from './components/SimulationControls';
import { InteractiveMap } from './components/InteractiveMap';
import { VulnerabilityMetrics } from './components/VulnerabilityMetrics';
import { EvacuationRouter } from './components/EvacuationRouter';
import { MultilingualAlerts } from './components/MultilingualAlerts';
import { DisasterCopilot } from './components/DisasterCopilot';
import { SituationReportModal } from './components/SituationReportModal';
import { LocationSearchModal } from './components/LocationSearchModal';
import { CycloneWebGL } from './components/CycloneWebGL';
import { BarChart3, Navigation, Radio, Bot, ShieldAlert, Circle } from 'lucide-react';

export function App() {
  const [scenariosList, setScenariosList] = useState<CycloneScenario[]>(SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [isSitrepOpen, setIsSitrepOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'vulnerability' | 'evacuation' | 'alerts' | 'copilot' | 'webgl'>('vulnerability');

  // Initial simulation parameters
  const [simState, setSimState] = useState<SimulationState>({
    currentHourOffset: -6, // 6 hours prior to landfall by default
    categoryMultiplier: 1.0,
    forwardSpeedKmh: 18,
    tidalPhase: 'Spring High Tide',
    tideAddonMeters: 1.8,
    activeScenarioId: SCENARIOS[0].id,
    isPlaying: false,
    layers: {
      windCone: true,
      surgeInundation: true,
      wardsVulnerability: true,
      shelters: true,
      criticalAssets: true,
      evacuationRoutes: true
    }
  });

  const activeScenario = useMemo(() => {
    return scenariosList.find(s => s.id === activeScenarioId) || scenariosList[0];
  }, [activeScenarioId, scenariosList]);

  // Run the physics & SVI simulation whenever parameters or scenario change
  const evaluated = useMemo(() => {
    return runCycloneSimulation(activeScenario, simState);
  }, [activeScenario, simState]);

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setSelectedWardId(null);
    setSimState(prev => ({
      ...prev,
      activeScenarioId: id,
      currentHourOffset: -6,
      isPlaying: false
    }));
  };

  const handleApplyCustomScenario = (scenario: CycloneScenario) => {
    setScenariosList(prev => {
      const exists = prev.some(s => s.id === scenario.id);
      return exists ? prev : [scenario, ...prev];
    });
    setActiveScenarioId(scenario.id);
    setSelectedWardId(null);
    setSimState(prev => ({
      ...prev,
      activeScenarioId: scenario.id,
      currentHourOffset: -6,
      isPlaying: false
    }));
  };

  const handleReset = () => {
    setSimState({
      currentHourOffset: -6,
      categoryMultiplier: 1.0,
      forwardSpeedKmh: 18,
      tidalPhase: 'Spring High Tide',
      tideAddonMeters: 1.8,
      activeScenarioId: activeScenario.id,
      isPlaying: false,
      layers: {
        windCone: true,
        surgeInundation: true,
        wardsVulnerability: true,
        shelters: true,
        criticalAssets: true,
        evacuationRoutes: true
      }
    });
    setSelectedWardId(null);
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header bar */}
      <Header
        scenarios={scenariosList}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        evaluated={evaluated}
        onOpenSitrep={() => setIsSitrepOpen(true)}
        onOpenLocationSearch={() => setIsLocationModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Mission Control Layout */}
      <main className="flex-1 p-3 md:p-5 max-w-[1720px] w-full mx-auto space-y-4">
        {/* Simulation Timeline & Intensification Controls */}
        <SimulationControls
          simState={simState}
          setSimState={setSimState}
          evaluated={evaluated}
        />

        {/* Primary Command Grid: Map & Operational Panes */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Geospatial Map View (takes 7 columns on desktop) */}
          <div className="xl:col-span-7 flex flex-col h-[560px] xl:h-[640px]">
            <InteractiveMap
              scenario={activeScenario}
              simState={simState}
              evaluated={evaluated}
              onSelectWard={(id) => setSelectedWardId(id)}
              selectedWardId={selectedWardId}
            />
          </div>

          {/* Incident Operations Command Tabs (takes 5 columns on desktop) */}
          <div className="xl:col-span-5 flex flex-col h-[560px] xl:h-[640px] bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Tab Navigation */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/80 p-1.5 gap-1 text-xs">
              <button
                onClick={() => setActiveTab('vulnerability')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'vulnerability'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>SVI & Assets</span>
              </button>

              <button
                onClick={() => setActiveTab('evacuation')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'evacuation'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Evacuation & Shelters</span>
              </button>

              <button
                onClick={() => setActiveTab('alerts')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'alerts'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>CAP Broadcast</span>
              </button>

              <button
                onClick={() => setActiveTab('copilot')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'copilot'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Copilot</span>
              </button>
              <button
                onClick={() => setActiveTab('webgl')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'webgl'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>Cyclone Viz</span>
              </button>
            </div>

            {/* Tab Content Panes */}
            <div className="flex-1 p-3 overflow-y-auto">
              {activeTab === 'vulnerability' && (
                <VulnerabilityMetrics
                  evaluated={evaluated}
                  selectedWardId={selectedWardId}
                  onSelectWard={(id) => setSelectedWardId(id)}
                />
              )}

              {activeTab === 'evacuation' && (
                <EvacuationRouter
                  evaluated={evaluated}
                />
              )}

              {activeTab === 'alerts' && (
                <MultilingualAlerts
                  scenario={activeScenario}
                  evaluated={evaluated}
                />
              )}

              {activeTab === 'copilot' && (
                <DisasterCopilot
                  scenario={activeScenario}
                  simState={simState}
                  evaluated={evaluated}
                />
              )}

              {activeTab === 'webgl' && (
                <CycloneWebGL
                  baseColor="#FF1E1E"
                  accentColor="#EB8787"
                  density={50}
                  dotSize={156}
                  speed={100}
                  distance={220}
                  drag={100}
                  armTightness={3.4}
                  bulgeDensity={100}
                  bulgeSize={100}
                  bulgeBrightness={5}
                  discDensity={48}
                  discBrightness={112}
                  haloDensity={124}
                  haloSize={135}
                  haloBrightness={100}
                />
              )}
            </div>
          </div>
        </div>

        {/* Global Bottom Ribbon: Emergency Guidelines & Life Safety Advisory */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>
              <b className="text-slate-200">NDMA Standard Operating Procedure:</b> Zero-Casualty Mandate active. Inundation zones with SVI &gt;65 must achieve 100% evacuation 6 hours before storm eye landfall.
            </span>
          </div>
          <div className="font-mono text-[11px] text-cyan-400">
            Hydrodynamic Surge Physics + SVI Machine Classification Active
          </div>
        </div>
      </main>

      {/* Situation Report Modal */}
      <SituationReportModal
        isOpen={isSitrepOpen}
        onClose={() => setIsSitrepOpen(false)}
        scenario={activeScenario}
        simState={simState}
        evaluated={evaluated}
      />

      {/* City Search / GPS Coordinates Modal */}
      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onApplyScenario={handleApplyCustomScenario}
      />
    </div>
  );
}

export default App;

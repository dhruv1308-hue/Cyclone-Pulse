import React, { useEffect } from 'react';
import { SimulationState, TidalPhase } from '../types/cyclone';
import { EvaluatedSimulation } from '../utils/simulationEngine';
import { Play, Pause, SkipBack, SkipForward, Clock, Wind, Waves, Gauge, AlertCircle } from 'lucide-react';

interface SimulationControlsProps {
  simState: SimulationState;
  setSimState: React.Dispatch<React.SetStateAction<SimulationState>>;
  evaluated: EvaluatedSimulation;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  simState,
  setSimState,
  evaluated
}) => {
  const { activePoint } = evaluated;

  // Auto-play interval
  useEffect(() => {
    if (!simState.isPlaying) return;

    const interval = setInterval(() => {
      setSimState(prev => {
        if (prev.currentHourOffset >= 12) {
          return { ...prev, isPlaying: false };
        }
        return { ...prev, currentHourOffset: Math.min(12, prev.currentHourOffset + 1) };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [simState.isPlaying, setSimState]);

  const togglePlay = () => {
    setSimState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleHourChange = (newHour: number) => {
    setSimState(prev => ({ ...prev, currentHourOffset: newHour }));
  };

  const handleIntensityChange = (multiplier: number) => {
    setSimState(prev => ({ ...prev, categoryMultiplier: multiplier }));
  };

  const handleTidalPhaseChange = (phase: TidalPhase) => {
    let tideAddon = 1.0;
    if (phase === 'Spring High Tide') tideAddon = 1.8;
    else if (phase === 'Mean High Tide') tideAddon = 1.0;
    else if (phase === 'Neap Tide') tideAddon = 0.0;
    else if (phase === 'Low Tide') tideAddon = -0.6;

    setSimState(prev => ({
      ...prev,
      tidalPhase: phase,
      tideAddonMeters: tideAddon
    }));
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Top Bar: Playback Controls & Time Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleHourChange(Math.max(-24, simState.currentHourOffset - 2))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Step Back 2 Hours"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              simState.isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {simState.isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE RUN</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>SIMULATE</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleHourChange(Math.min(12, simState.currentHourOffset + 2))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Step Forward 2 Hours"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Timeline:</span>
            <span className={`font-bold ${
              simState.currentHourOffset === 0 ? 'text-red-400' :
              simState.currentHourOffset < 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {simState.currentHourOffset === 0 ? 'LANDFALL (T=0h)' :
               simState.currentHourOffset < 0 ? `T${simState.currentHourOffset}h Pre-Landfall` :
               `T+${simState.currentHourOffset}h Post-Landfall`}
            </span>
          </div>
        </div>

        {/* Dynamic Storm Category Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Storm State:</span>
          <div className="px-2.5 py-1 rounded-md text-xs font-bold font-mono tracking-wide bg-red-950/80 border border-red-800/80 text-red-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            {activePoint.category}
          </div>
        </div>
      </div>

      {/* Main Timeline Scrubber Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span className="text-cyan-400">T-24h (Deep Sea Approach)</span>
          <span className="text-amber-400 font-bold">T-12h (Shelf Crossing)</span>
          <span className="text-red-400 font-bold underline">T-0h (Landfall Impact)</span>
          <span className="text-emerald-400">T+6h (Inland Attenuation)</span>
          <span className="text-slate-500">T+12h (Dissipation)</span>
        </div>
        <input
          type="range"
          min={-24}
          max={12}
          step={0.5}
          value={simState.currentHourOffset}
          onChange={(e) => handleHourChange(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
        />
      </div>

      {/* "What-If" Scenario Sliders: Intensity & Tidal Phase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
        {/* Rapid Intensification Multiplier */}
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Intensity Multiplier:
            </span>
            <span className="font-mono font-bold text-cyan-400">
              {simState.categoryMultiplier.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min={0.8}
            max={1.3}
            step={0.05}
            value={simState.categoryMultiplier}
            onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Weakening (0.8x)</span>
            <span>Standard (1.0x)</span>
            <span className="text-rose-400">Rapid (1.3x)</span>
          </div>
        </div>

        {/* Astronomical Tidal Phase Selector */}
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Waves className="w-3.5 h-3.5 text-sky-400" />
              Astronomical Tidal Phase:
            </span>
            <span className="font-mono font-bold text-sky-400">
              {simState.tideAddonMeters >= 0 ? `+${simState.tideAddonMeters}m` : `${simState.tideAddonMeters}m`}
            </span>
          </div>
          <select
            value={simState.tidalPhase}
            onChange={(e) => handleTidalPhaseChange(e.target.value as TidalPhase)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="Spring High Tide">Spring High Tide (+1.8m Astronomical)</option>
            <option value="Mean High Tide">Mean High Tide (+1.0m Normal)</option>
            <option value="Neap Tide">Neap Tide (0.0m Baseline)</option>
            <option value="Low Tide">Low Tide (-0.6m Minimum)</option>
          </select>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span>High tide concurrent with landfall doubles flood inundation zone</span>
          </div>
        </div>

        {/* Forward Speed & Landfall Timing */}
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              Forward Track Speed:
            </span>
            <span className="font-mono font-bold text-amber-400">
              {simState.forwardSpeedKmh} km/h
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={35}
            step={2}
            value={simState.forwardSpeedKmh}
            onChange={(e) => setSimState(prev => ({ ...prev, forwardSpeedKmh: parseInt(e.target.value) }))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Slow Stalling (10 km/h)</span>
            <span>Normal (18 km/h)</span>
            <span>Fast (35 km/h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CycloneScenario, SimulationState } from '../types/cyclone';
import { EvaluatedSimulation } from '../utils/simulationEngine';
import { X, Printer, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface SituationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: CycloneScenario;
  simState: SimulationState;
  evaluated: EvaluatedSimulation;
}

export const SituationReportModal: React.FC<SituationReportModalProps> = ({
  isOpen,
  onClose,
  scenario,
  simState,
  evaluated
}) => {
  if (!isOpen) return null;

  const { activePoint, totalExposedPopulation, totalKutchaRoofRiskCount, floodedAssetsCount, submergedRoutesCount, evaluatedWards, logistics, shelterUtilizationPct } = evaluated;

  const handlePrint = () => {
    window.print();
  };

  const reportId = `SITREP-CYC-2026-${Math.abs(Math.round(simState.currentHourOffset * 10))}`;
  const timestamp = new Date().toLocaleString();

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Header */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>OFFICIAL SITUATION REPORT (SITREP) — RESTRICTED OPERATIONAL BRIEF</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 font-sans print:bg-white print:text-black print:p-0">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-700 pb-4 print:border-black">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wider text-white print:text-black">
                  State Disaster Management Authority — Incident Command
                </h1>
                <p className="text-xs text-slate-400 print:text-gray-600">
                  Integrated Multi-Hazard Cyclone & Coastal Surge Vulnerability Assessment
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="font-bold text-cyan-400 print:text-black">{reportId}</div>
                <div className="text-slate-400 print:text-gray-600">{timestamp}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Storm Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 print:bg-gray-100 print:border-gray-300">
            <div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">Active System</div>
              <div className="font-bold text-white print:text-black">{scenario.name}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">Intensity Category</div>
              <div className="font-bold text-rose-400 print:text-red-700">{activePoint.category}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">Max Sustained Wind</div>
              <div className="font-bold font-mono text-white print:text-black">{activePoint.windSpeedKmh} km/h ({activePoint.windSpeedKts} kts)</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">Peak Hydrodynamic Surge</div>
              <div className="font-bold font-mono text-cyan-400 print:text-blue-700">+{activePoint.estimatedSurgeHeightM} meters MSL</div>
            </div>
          </div>

          {/* Section 2: Impact Summary Matrix */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 print:text-black">
              1. Hyperlocal Impact Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-gray-300">
                <div className="text-slate-400 print:text-gray-600">Exposed Population</div>
                <div className="text-lg font-bold text-white print:text-black">{totalExposedPopulation.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-gray-300">
                <div className="text-slate-400 print:text-gray-600">Kutcha Dwellings at Risk</div>
                <div className="text-lg font-bold text-rose-400 print:text-red-700">{totalKutchaRoofRiskCount.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-gray-300">
                <div className="text-slate-400 print:text-gray-600">Inundated Power/PHCs</div>
                <div className="text-lg font-bold text-amber-400 print:text-amber-700">{floodedAssetsCount} Assets</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-gray-300">
                <div className="text-slate-400 print:text-gray-600">Shelter Utilization</div>
                <div className="text-lg font-bold text-emerald-400 print:text-green-700">{shelterUtilizationPct}%</div>
              </div>
            </div>
          </div>

          {/* Section 3: Ward SVI Ranking */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 print:text-black">
              2. Structural Vulnerability Index (SVI) by Coastal Ward
            </h3>
            <table className="w-full text-left text-xs border border-slate-800 print:border-gray-400">
              <thead className="bg-slate-950 text-slate-400 font-semibold print:bg-gray-200 print:text-black">
                <tr>
                  <th className="p-2 border-b border-slate-800">Ward</th>
                  <th className="p-2 border-b border-slate-800">District</th>
                  <th className="p-2 border-b border-slate-800">Population</th>
                  <th className="p-2 border-b border-slate-800">Elevation</th>
                  <th className="p-2 border-b border-slate-800">Surge Level</th>
                  <th className="p-2 border-b border-slate-800">SVI Score</th>
                  <th className="p-2 border-b border-slate-800">Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono print:divide-gray-300">
                {evaluatedWards.map(w => (
                  <tr key={w.id}>
                    <td className="p-2 font-sans text-white print:text-black">{w.name}</td>
                    <td className="p-2">{w.district}</td>
                    <td className="p-2">{w.population.toLocaleString()}</td>
                    <td className="p-2">{w.avgElevationM}m</td>
                    <td className="p-2 text-cyan-400 print:text-black">+{w.surgeDepthM || 0}m</td>
                    <td className="p-2 font-bold">{w.vulnerabilityScore}/100</td>
                    <td className="p-2 font-bold uppercase text-rose-400 print:text-black">{w.evacuationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Sphere Logistics Requisition */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 print:text-black">
              3. Humanitarian Logistics & Relief Requisition (Sphere Standards)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 print:bg-white print:border-gray-300">
              <div>Potable Water: <b>{logistics.potableWaterLitersPerDay.toLocaleString()} L/day</b></div>
              <div>Dry Food Rations: <b>{logistics.dryRationPackets.toLocaleString()} Packs</b></div>
              <div>NDRF Rescue Boats: <b>{logistics.ndrfRescueBoats} Boats</b></div>
              <div>Dewatering Pumps: <b>{logistics.dewateringPumps} Units</b></div>
            </div>
          </div>

          {/* Section 5: Signature & Authorization */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400 print:border-black print:text-black">
            <div>
              <div>Generated by: <b>CyclonePulse AI Incident Command Engine</b></div>
              <div>Classification: RESTRICTED / OPERATIONAL DISASTER RESPONSE</div>
            </div>
            <div className="text-right">
              <div className="h-8 border-b border-slate-600 w-48 mb-1"></div>
              <div>Incident Commander / District Magistrate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

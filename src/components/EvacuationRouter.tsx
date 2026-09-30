import React from 'react';
import { EvaluatedSimulation } from '../utils/simulationEngine';
import { Navigation, Building2, Droplets, Package, Anchor, Power, ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface EvacuationRouterProps {
  evaluated: EvaluatedSimulation;
}

export const EvacuationRouter: React.FC<EvacuationRouterProps> = ({ evaluated }) => {
  const { evaluatedRoutes, evaluatedShelters, logistics } = evaluated;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Dynamic Evacuation Corridors */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Evacuation Corridors & Chokepoint Status
              </h3>
            </div>
            <span className="text-xs text-slate-400">Live flood clearance</span>
          </div>

          <div className="space-y-2.5">
            {evaluatedRoutes.map(route => {
              const isSubmerged = route.status === 'Submerged';
              const isCaution = route.status === 'Caution';

              return (
                <div
                  key={route.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isSubmerged
                      ? 'bg-red-950/30 border-red-800/80 text-red-200'
                      : isCaution
                      ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                        {isSubmerged ? (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        ) : isCaution ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                        <span>{route.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Origin: <b className="text-slate-300">{route.originWard}</b> → Destination: <b className="text-slate-300">{route.destinationShelter}</b>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isSubmerged ? 'bg-red-900/60 text-red-300 border border-red-700' :
                      isCaution ? 'bg-amber-900/60 text-amber-300 border border-amber-700' :
                      'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/60 font-mono text-slate-400">
                    <div>Min Road Elevation: <b className="text-slate-200">{route.elevationMinM}m</b></div>
                    <div>Distance: <b className="text-slate-200">{route.distanceKm} km</b></div>
                    <div>
                      Transit: <b className={route.safeForVehicles ? 'text-emerald-400' : 'text-red-400'}>
                        {route.safeForVehicles ? 'Vehicles Clear' : 'Impassable (Water >0.5m)'}
                      </b>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Shelter Capacities & Critical Readiness */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Multi-Purpose Cyclone Shelters (MPCS)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Capacity & Lifeline Status</span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {evaluatedShelters.map(shelter => {
              const occPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
              const isFull = occPct >= 95;
              const isCrowded = occPct >= 70;

              return (
                <div
                  key={shelter.id}
                  className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-lg space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-white">{shelter.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Occupancy: <span className="font-mono font-bold text-slate-200">{shelter.currentOccupancy.toLocaleString()}</span> / {shelter.capacity.toLocaleString()}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isFull ? 'bg-red-950 text-red-300 border border-red-800' :
                      isCrowded ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {occPct}% Full
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-red-500' : isCrowded ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occPct)}%` }}
                    ></div>
                  </div>

                  {/* Resilience Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] pt-1 text-slate-300">
                    <span className={`px-1.5 py-0.5 rounded border ${
                      shelter.hasElevatedPlinth ? 'bg-slate-900 border-cyan-800 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {shelter.hasElevatedPlinth ? '✓ Plinth +1.5m' : '✗ Ground Level'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded border ${
                      shelter.hasSolarOrGenset ? 'bg-slate-900 border-amber-800 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {shelter.hasSolarOrGenset ? '✓ Backup Power' : '✗ No Generator'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded border bg-slate-900 border-slate-800 text-slate-400">
                      💧 {shelter.waterSupplyDays}d Water Stock
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Sphere Standards Relief & Dispatch Estimator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Sphere Humanitarian Standards — Relief & Resource Deployment Forecast
            </h3>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono">NDMA / UN-OCHA Compliance</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 font-mono text-center">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{(logistics.potableWaterLitersPerDay / 1000).toFixed(1)}k L</div>
            <div className="text-[10px] font-sans text-slate-400">Clean Water / Day</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <Package className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{(logistics.dryRationPackets / 1000).toFixed(1)}k</div>
            <div className="text-[10px] font-sans text-slate-400">Dry Rations</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <ShieldAlert className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{logistics.babyNutritionUnits.toLocaleString()}</div>
            <div className="text-[10px] font-sans text-slate-400">Infant Nutrition</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <Anchor className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{logistics.ndrfRescueBoats} Units</div>
            <div className="text-[10px] font-sans text-slate-400">NDRF Rescue Boats</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <Droplets className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{logistics.dewateringPumps} Sets</div>
            <div className="text-[10px] font-sans text-slate-400">High-Cap Pumps</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <Power className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{logistics.mobileDieselGenerators} Units</div>
            <div className="text-[10px] font-sans text-slate-400">Mobile Gensets</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <ShieldAlert className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{logistics.emergencyMedicalKits} Kits</div>
            <div className="text-[10px] font-sans text-slate-400">First-Response Kits</div>
          </div>
        </div>
      </div>
    </div>
  );
};

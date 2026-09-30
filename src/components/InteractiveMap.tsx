import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CycloneScenario, SimulationState } from '../types/cyclone';
import { Layers, ShieldCheck } from 'lucide-react';
import { EvaluatedSimulation, analyzeWindPatterns, WindPatternAnalysis } from '../utils/simulationEngine';

interface InteractiveMapProps {
  scenario: CycloneScenario;
  simState: SimulationState;
  evaluated: EvaluatedSimulation;
  onSelectWard: (wardId: string) => void;
  selectedWardId: string | null;
}

type BasemapStyle = 'dark' | 'voyager' | 'positron' | 'satellite';

const BASEMAP_URLS: Record<BasemapStyle, { url: string; label: string; subdomains: string; maxZoom: number }> = {
  dark: {
    url: 'https://{s}.tile.openaerialmap.org/tiles/256/{z}/{x}/{y}.png?attribution=© OpenAerialMap',
    label: 'Dark Matter',
    subdomains: 'abcd',
    maxZoom: 19
  },
  voyager: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?style=night',
    label: 'Voyager',
    subdomains: 'abcd',
    maxZoom: 19
  },
  positron: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    label: 'Positron',
    subdomains: 'abcd',
    maxZoom: 19
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    label: 'Satellite',
    subdomains: 'abcd',
    maxZoom: 18
  }
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  scenario,
  simState,
  evaluated,
  onSelectWard,
  selectedWardId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('dark');
  const [windAnalysis, setWindAnalysis] = useState<WindPatternAnalysis | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: scenario.mapCenter,
      zoom: scenario.zoom,
      zoomControl: false,
      attributionControl: false
    });

    // Add initial Tile Layer
    const tileConfig = BASEMAP_URLS[basemapStyle];
    const tileLayer = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [scenario.id]);

  // Handle Basemap Style Switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = BASEMAP_URLS[basemapStyle];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    }).addTo(map);

    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [basemapStyle]);

  // Update map center when scenario changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(scenario.mapCenter, scenario.zoom, { animate: true });
    }
  }, [scenario.id, scenario.mapCenter, scenario.zoom]);

  // Analyze wind patterns for prediction
  useEffect(() => {
    const currentHour = simState.currentHourOffset;
    const scenarioTrack = scenario.track;
    setWindAnalysis(analyzeWindPatterns(scenarioTrack, currentHour, 28.5));
  }, [scenario.id, simState.currentHourOffset]);

  // Redraw dynamic layers on simulation updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const { activePoint } = evaluated;

    // 1. Storm Track Line
    const trackLatLngs: L.LatLngTuple[] = scenario.track.map(p => [p.lat, p.lng]);
    const trackLine = L.polyline(trackLatLngs, {
      color: basemapStyle === 'positron' ? '#475569' : '#94a3b8',
      weight: 2,
      dashArray: '6, 6',
      opacity: 0.75
    });
    layerGroup.addLayer(trackLine);

    // Track historical & forecast points
    scenario.track.forEach(p => {
      const isPast = p.timeOffsetHours < simState.currentHourOffset;
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: isPast ? 3 : 5,
        fillColor: isPast ? '#64748b' : '#f59e0b',
        color: '#ffffff',
        weight: 1,
        fillOpacity: isPast ? 0.4 : 0.9
      });
      marker.bindTooltip(`<b>${p.label}</b><br/>Wind: ${p.windSpeedKmh} km/h<br/>Pressure: ${p.centralPressureHpa} hPa`, {
        className: 'dark-tooltip'
      });
      layerGroup.addLayer(marker);
    });

    // 2. Wind Envelopes & Cone of Uncertainty (Doppler Radii)
    if (simState.layers.windCone) {
      // R34 Knot radius (Gale Wind Swath)
      const r34Circle = L.circle([activePoint.lat, activePoint.lng], {
        radius: activePoint.radiusMaxWindKm * 2800,
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: 0.05,
        weight: 1.2,
        dashArray: '5, 5'
      });
      layerGroup.addLayer(r34Circle);

      // R50 Knot radius (Storm Force Wind Swath)
      const r50Circle = L.circle([activePoint.lat, activePoint.lng], {
        radius: activePoint.radiusMaxWindKm * 1800,
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.09,
        weight: 1.4,
        dashArray: '4, 4'
      });
      layerGroup.addLayer(r50Circle);

      // R64 Knot radius (Eyewall Hurricane Core)
      const r64Circle = L.circle([activePoint.lat, activePoint.lng], {
        radius: activePoint.radiusMaxWindKm * 1000,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.16,
        weight: 1.8
      });
      layerGroup.addLayer(r64Circle);
    }

    // 3. Realistic Satellite & Radar Cyclone Vortex (Spiral Rainbands & Eyewall)
    const realisticCycloneIcon = L.divIcon({
      className: 'realistic-cyclone-container',
      html: `
        <div class="relative w-[340px] h-[340px] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <!-- Swirling Cloud Deck & Spiral Rainbands -->
          <svg viewBox="0 0 320 320" class="w-full h-full cyclone-vortex-animated" style="filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.4));">
            <defs>
              <!-- Radial gradient for cirrus cloud canopy -->
              <radialGradient id="cloudCanopyGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#020617" stop-opacity="0" />
                <stop offset="9%" stop-color="#020617" stop-opacity="0" />
                <stop offset="14%" stop-color="#ffffff" stop-opacity="0.95" />
                <stop offset="26%" stop-color="#ef4444" stop-opacity="0.8" />
                <stop offset="42%" stop-color="#f59e0b" stop-opacity="0.55" />
                <stop offset="62%" stop-color="#38bdf8" stop-opacity="0.38" />
                <stop offset="85%" stop-color="#bae6fd" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0" />
              </radialGradient>

              <!-- Spiral Arm Gradients -->
              <linearGradient id="spiralArm1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98" />
                <stop offset="35%" stop-color="#f43f5e" stop-opacity="0.85" />
                <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0" />
              </linearGradient>

              <linearGradient id="spiralArm2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
                <stop offset="30%" stop-color="#f59e0b" stop-opacity="0.8" />
                <stop offset="75%" stop-color="#06b6d4" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0" />
              </linearGradient>

              <filter id="cycloneSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
            </defs>

            <!-- Translucent Outflow Cloud Canopy -->
            <circle cx="160" cy="160" r="148" fill="url(#cloudCanopyGrad)" filter="url(#cycloneSoftGlow)" />

            <!-- Spiral Rainband 1 (Primary Northern Inflow Band) -->
            <path d="M 160 148 C 174 132, 202 128, 230 142 C 268 162, 290 210, 272 258 C 260 288, 226 310, 188 312" 
                  fill="none" stroke="url(#spiralArm1)" stroke-width="16" stroke-linecap="round" filter="url(#cycloneSoftGlow)" />
            <path d="M 160 148 C 174 132, 202 128, 230 142 C 268 162, 290 210, 272 258 C 260 288, 226 310, 188 312" 
                  fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity="0.9" />

            <!-- Spiral Rainband 2 (Southern Trailing Band) -->
            <path d="M 160 172 C 146 188, 118 192, 90 178 C 52 158, 30 110, 48 62 C 60 32, 94 10, 132 8" 
                  fill="none" stroke="url(#spiralArm2)" stroke-width="16" stroke-linecap="round" filter="url(#cycloneSoftGlow)" />
            <path d="M 160 172 C 146 188, 118 192, 90 178 C 52 158, 30 110, 48 62 C 60 32, 94 10, 132 8" 
                  fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity="0.9" />

            <!-- Spiral Rainband 3 (Eastern Inflow Feeder) -->
            <path d="M 172 160 C 188 174, 196 195, 188 218 C 174 246, 138 262, 106 250 C 68 238, 36 200, 32 160" 
                  fill="none" stroke="url(#spiralArm1)" stroke-width="11" stroke-linecap="round" filter="url(#cycloneSoftGlow)" />

            <!-- Spiral Rainband 4 (Western Inflow Feeder) -->
            <path d="M 148 160 C 132 146, 124 125, 132 102 C 146 74, 182 58, 214 70 C 252 82, 284 120, 288 160" 
                  fill="none" stroke="url(#spiralArm2)" stroke-width="11" stroke-linecap="round" filter="url(#cycloneSoftGlow)" />

            <!-- Deep Convective Eyewall Cloud Ring -->
            <circle cx="160" cy="160" r="28" fill="none" stroke="#f43f5e" stroke-width="10" opacity="0.9" filter="url(#cycloneSoftGlow)" />
            <circle cx="160" cy="160" r="26" fill="none" stroke="#ffffff" stroke-width="3.5" opacity="0.95" />

            <!-- Distinct Calm Central Eye -->
            <circle cx="160" cy="160" r="14" fill="#020617" stroke="#38bdf8" stroke-width="2" />
            <circle cx="160" cy="160" r="4" fill="#ef4444" />
          </svg>

          <!-- Fixed Directional Radar Rings & Eye Core -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-16 h-16 rounded-full border border-red-500/70 radar-ring"></div>
            <div class="w-28 h-28 rounded-full border border-cyan-400/50 radar-ring" style="animation-delay: 0.8s;"></div>
          </div>
        </div>
      `,
      iconSize: [0, 0]
    });

    const cycloneMarker = L.marker([activePoint.lat, activePoint.lng], { icon: realisticCycloneIcon });
    cycloneMarker.bindTooltip(
      `<div class="text-xs font-mono p-1">
        <div class="font-bold text-red-400 uppercase tracking-wider">${activePoint.category}</div>
        <div>Max Wind: <b>${activePoint.windSpeedKmh} km/h</b> (${activePoint.windSpeedKts} kts)</div>
        <div>Core Pressure: <b>${activePoint.centralPressureHpa} hPa</b></div>
        <div>Peak Surge: <b class="text-cyan-400">+${activePoint.estimatedSurgeHeightM}m</b></div>
      </div>`,
      { permanent: false, direction: 'top', offset: [0, -22] }
    );
    layerGroup.addLayer(cycloneMarker);

    // 4. Coastal Wards Vulnerability (Choropleth)
    if (simState.layers.wardsVulnerability) {
      evaluated.evaluatedWards.forEach(ward => {
        const isSelected = ward.id === selectedWardId;
        const svi = ward.vulnerabilityScore || 0;

        let fillColor = '#10b981'; // Low
        if (svi >= 75) fillColor = '#ef4444'; // Severe
        else if (svi >= 60) fillColor = '#f97316'; // High
        else if (svi >= 40) fillColor = '#eab308'; // Moderate

        const polygon = L.polygon(ward.coordinates as L.LatLngTuple[], {
          fillColor,
          fillOpacity: isSelected ? 0.65 : (ward.isInundated ? 0.45 : 0.28),
          color: isSelected ? '#38bdf8' : (ward.isInundated ? '#06b6d4' : fillColor),
          weight: isSelected ? 3 : (ward.isInundated ? 2 : 1.2),
          dashArray: ward.isInundated ? '3, 3' : undefined
        });

        polygon.on('click', () => {
          onSelectWard(ward.id);
        });

        polygon.bindTooltip(`
          <div class="p-1 space-y-1 text-xs">
            <div class="font-bold text-slate-100 flex items-center justify-between gap-2">
              <span>${ward.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono ${
                svi >= 75 ? 'bg-red-950 text-red-300' :
                svi >= 60 ? 'bg-orange-950 text-orange-300' :
                svi >= 40 ? 'bg-amber-950 text-amber-300' :
                'bg-emerald-950 text-emerald-300'
              }">SVI: ${svi}/100</span>
            </div>
            <div class="text-slate-300">Pop: <b>${ward.population.toLocaleString()}</b> | Elev: <b>${ward.avgElevationM}m</b></div>
            <div class="text-slate-300">Kutcha Roofs: <b>${ward.kutchaHousesPct}%</b></div>
            <div class="${ward.isInundated ? 'text-cyan-300 font-semibold' : 'text-slate-400'}">
              Surge Depth: <b>${ward.surgeDepthM || 0}m</b> ${ward.isInundated ? '(Inundated)' : ''}
            </div>
            <div class="pt-0.5 font-bold uppercase tracking-wider text-[10px] ${
              ward.evacuationStatus === 'Urgent Evacuate' ? 'text-red-400 animate-pulse' :
              ward.evacuationStatus === 'Advisory' ? 'text-amber-400' : 'text-emerald-400'
            }">Status: ${ward.evacuationStatus}</div>
          </div>
        `, { sticky: true });

        layerGroup.addLayer(polygon);
      });
    }

    // 5. Surge Inundation Zones
    if (simState.layers.surgeInundation && activePoint.estimatedSurgeHeightM > 0.8) {
      evaluated.evaluatedWards.forEach(ward => {
        if (ward.surgeDepthM && ward.surgeDepthM > 0.1) {
          const surgeZone = L.circle([ward.lat, ward.lng], {
            radius: Math.max(1200, (ward.surgeDepthM / 4) * 3500),
            color: '#38bdf8',
            fillColor: '#0284c7',
            fillOpacity: Math.min(0.5, 0.15 + (ward.surgeDepthM / 6)),
            weight: 1.5,
            dashArray: '2, 4'
          });
          layerGroup.addLayer(surgeZone);
        }
      });
    }

    // 6. Shelters
    if (simState.layers.shelters) {
      evaluated.evaluatedShelters.forEach(shelter => {
        const occPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        let badgeColor = 'bg-emerald-500';
        if (occPct >= 95) badgeColor = 'bg-red-500';
        else if (occPct >= 65) badgeColor = 'bg-amber-500';

        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div class="group relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
              <div class="w-6 h-6 rounded-md bg-slate-900 border border-slate-600 flex items-center justify-center shadow-md">
                <span class="text-xs">🏠</span>
              </div>
              <span class="absolute -top-2 -right-2 px-1 py-0.2 rounded-full text-[9px] font-mono text-white ${badgeColor}">
                ${occPct}%
              </span>
            </div>
          `,
          iconSize: [0, 0]
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon });
        marker.bindTooltip(`
          <div class="text-xs p-1 space-y-1">
            <div class="font-bold text-slate-100">${shelter.name}</div>
            <div class="text-slate-300">Occupancy: <b>${shelter.currentOccupancy} / ${shelter.capacity}</b> (${occPct}%)</div>
            <div class="text-slate-300">Elevated Plinth: <b>${shelter.hasElevatedPlinth ? 'Yes (Flood Proof)' : 'No'}</b></div>
            <div class="text-slate-300">Genset/Solar: <b>${shelter.hasSolarOrGenset ? 'Active' : 'None'}</b></div>
            <div class="text-slate-300">Water Supply: <b>${shelter.waterSupplyDays} Days</b></div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 7. Critical Assets
    if (simState.layers.criticalAssets) {
      evaluated.evaluatedAssets.forEach(asset => {
        let assetSymbol = '⚡';
        if (asset.type === 'Hospital') assetSymbol = '🏥';
        else if (asset.type === 'Water Treatment') assetSymbol = '💧';
        else if (asset.type === 'Telecom Tower') assetSymbol = '📡';

        const isFlooded = asset.isFlooded;
        const icon = L.divIcon({
          className: 'custom-asset-marker',
          html: `
            <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
              ${isFlooded ? '<div class="absolute w-8 h-8 rounded-full border-2 border-red-500 animate-ping"></div>' : ''}
              <div class="w-6 h-6 rounded-full ${isFlooded ? 'bg-red-950 border-red-500 text-red-300' : 'bg-slate-900 border-slate-600'} border flex items-center justify-center text-xs shadow-md">
                ${assetSymbol}
              </div>
            </div>
          `,
          iconSize: [0, 0]
        });

        const marker = L.marker([asset.lat, asset.lng], { icon });
        marker.bindTooltip(`
          <div class="text-xs p-1 space-y-1">
            <div class="font-bold text-slate-100">${asset.name}</div>
            <div class="text-slate-300">Type: <b>${asset.type}</b></div>
            <div class="text-slate-300">Ground Elevation: <b>${asset.elevationM}m</b></div>
            <div class="text-slate-300">Backup Gen: <b>${asset.backupPower ? 'Available' : 'Unprotected'}</b></div>
            <div class="font-bold ${isFlooded ? 'text-red-400' : 'text-emerald-400'}">
              Risk: ${asset.riskLevel} ${isFlooded ? '(Submersion Hazard)' : ''}
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 8. Evacuation Routes
    if (simState.layers.evacuationRoutes) {
      evaluated.evaluatedRoutes.forEach(route => {
        let color = '#10b981'; // Clear
        let dashArray: string | undefined = undefined;

        if (route.status === 'Submerged') {
          color = '#ef4444';
          dashArray = '5, 5';
        } else if (route.status === 'Caution') {
          color = '#f59e0b';
          dashArray = '8, 4';
        }

        const polyline = L.polyline(route.points as L.LatLngTuple[], {
          color,
          weight: route.status === 'Submerged' ? 4 : 3,
          opacity: 0.85,
          dashArray
        });

        polyline.bindTooltip(`
          <div class="text-xs p-1 space-y-1">
            <div class="font-bold text-slate-100">${route.name}</div>
            <div class="text-slate-300">Min Elevation: <b>${route.elevationMinM}m</b> | Dist: <b>${route.distanceKm} km</b></div>
            <div class="font-bold ${
              route.status === 'Submerged' ? 'text-red-400' :
              route.status === 'Caution' ? 'text-amber-400' : 'text-emerald-400'
            }">
              Corridor Status: ${route.status} ${route.status === 'Submerged' ? '(Impassable to Light Vehicles)' : ''}
            </div>
          </div>
        `);
        layerGroup.addLayer(polyline);
      });
    }

  }, [scenario, simState, evaluated, selectedWardId, basemapStyle]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend & Layer Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/70 p-3 rounded-lg shadow-xl text-xs space-y-2.5 max-w-[230px]">
        {/* CARTO Basemap Switcher */}
        <div className="space-y-1.5 pb-2 border-b border-slate-700/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              Basemap Style
            </span>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              Map Key
            </span>
            {windAnalysis && (
              <div className="text-[10px] text-slate-400 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded ${windAnalysis.predictedIntensityChange === 'intensifying' ? 'bg-red-500' : windAnalysis.predictedIntensityChange === 'weakening' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                  <span>{windAnalysis.predictedIntensityChange}</span>
                </div>
                <div className="text-[8px] mt-0.5">
                  <span>Shear: {windAnalysis.windShearKmh.toFixed(1)} km/km</span>
                  <span>|</span>
                  <span>Convergence: {((windAnalysis.convergenceIndex * 100)|0)}%</span>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1 text-center">
            {(['dark', 'voyager', 'positron', 'satellite'] as BasemapStyle[]).map(style => (
              <button
                key={style}
                onClick={() => setBasemapStyle(style)}
                className={`py-1 px-1.5 text-[10px] rounded font-medium capitalize transition-all ${
                  basemapStyle === style
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {style === 'dark' ? 'Dark Matter' : style}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Map Overlays</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        
        <div className="space-y-1.5 text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={simState.layers.windCone} 
              onChange={() => simState.layers.windCone = !simState.layers.windCone} 
              className="accent-cyan-500 rounded" 
            />
            <span>Wind Swath (R34/50/64)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={simState.layers.surgeInundation} 
              onChange={() => simState.layers.surgeInundation = !simState.layers.surgeInundation} 
              className="accent-cyan-500 rounded" 
            />
            <span>Storm Surge Inundation</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={simState.layers.wardsVulnerability} 
              onChange={() => simState.layers.wardsVulnerability = !simState.layers.wardsVulnerability} 
              className="accent-cyan-500 rounded" 
            />
            <span>Ward SVI Choropleth</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={simState.layers.shelters} 
              onChange={() => simState.layers.shelters = !simState.layers.shelters} 
              className="accent-cyan-500 rounded" 
            />
            <span>Cyclone Shelters (MPCS)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={simState.layers.criticalAssets} 
              onChange={() => simState.layers.criticalAssets = !simState.layers.criticalAssets} 
              className="accent-cyan-500 rounded" 
            />
            <span>Substations & Hospitals</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input 
              type="checkbox" 
              checked={simState.layers.evacuationRoutes} 
              onChange={() => simState.layers.evacuationRoutes = !simState.layers.evacuationRoutes} 
              className="accent-cyan-500 rounded" 
            />
            <span>Evacuation Corridors</span>
          </label>
        </div>

        {/* Legend color chips */}
        <div className="pt-2 border-t border-slate-700/60 text-[10px] space-y-1 text-slate-400">
          <div className="font-semibold text-slate-300">Vulnerability (SVI)</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Low (&lt;40)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Mod (40-60)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-orange-500"></span> High (60-75)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> Severe (&gt;75)</div>
          </div>
        </div>
      </div>

      {/* Floating Center Radar Coordinates */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-md shadow-lg text-[11px] font-mono text-slate-400 flex items-center gap-3">
        <div>EYE: <span className="text-cyan-400 font-bold">{evaluated.activePoint.lat.toFixed(2)}°N, {evaluated.activePoint.lng.toFixed(2)}°E</span></div>
        <div className="w-px h-3 bg-slate-700"></div>
        <div>LANDFALL OFFSET: <span className="text-amber-400 font-bold">{simState.currentHourOffset >= 0 ? `+${simState.currentHourOffset}h` : `${simState.currentHourOffset}h`}</span></div>
      </div>
    </div>
  );
};

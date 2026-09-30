import React, { useState } from 'react';
import { CycloneScenario } from '../types/cyclone';
import { generateCustomScenario } from '../utils/scenarioGenerator';
import { MapPin, Search, Crosshair, Compass, X, Loader2, Globe } from 'lucide-react';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (scenario: CycloneScenario) => void;
}

const IPGEOLOCATION_API_KEY = '1db7f412d4b946f9a62ebcc5eb762b50';

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onApplyScenario
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [manualLat, setManualLat] = useState('17.686');
  const [manualLng, setManualLng] = useState('83.218');
  const [manualCity, setManualCity] = useState('Visakhapatnam');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Search cities using Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Nominatim search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto detect user location via ipgeolocation.io
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setDetectStatus('Querying IPGeolocation API...');
    try {
      const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEOLOCATION_API_KEY}`);
      if (!res.ok) throw new Error(`IPGeolocation error ${res.status}`);
      const data = await res.json();

      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      const city = data.city || data.district || 'My Location';
      const state = data.state_prov || data.country_name || '';

      setManualLat(lat.toFixed(3));
      setManualLng(lng.toFixed(3));
      setManualCity(city);

      setDetectStatus(`Detected: ${city}, ${state} (${lat.toFixed(2)}, ${lng.toFixed(2)})`);

      const customScenario = generateCustomScenario(city, lat, lng, state);
      onApplyScenario(customScenario);
      onClose();
    } catch (err) {
      console.error('IPGeolocation detection error:', err);
      setDetectStatus('Could not detect location. Please search or enter manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectCityResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const parts = item.display_name.split(',');
    const cityName = parts[0].trim();
    const stateName = parts.length > 2 ? parts[2].trim() : '';

    const scenario = generateCustomScenario(cityName, lat, lng, stateName);
    onApplyScenario(scenario);
    onClose();
  };

  const handleApplyManual = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) return;

    const cityName = manualCity.trim() || `Zone (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    const scenario = generateCustomScenario(cityName, lat, lng);
    onApplyScenario(scenario);
    onClose();
  };

  // Preset Iconic Coastal Cities
  const popularHubs = [
    { name: 'Puri Seafront', state: 'Odisha', lat: 19.813, lng: 85.831 },
    { name: 'Visakhapatnam Port', state: 'Andhra Pradesh', lat: 17.686, lng: 83.218 },
    { name: 'Chennai Coastal Marina', state: 'Tamil Nadu', lat: 13.082, lng: 80.270 },
    { name: 'Mumbai Colaba Point', state: 'Maharashtra', lat: 18.922, lng: 72.834 },
    { name: 'Kochi Marine Drive', state: 'Kerala', lat: 9.931, lng: 76.267 },
    { name: 'Sagar Island Delta', state: 'West Bengal', lat: 21.650, lng: 88.080 },
    { name: 'Tampa Bay Coast', state: 'Florida, USA', lat: 27.950, lng: -82.457 }
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <Compass className="w-4 h-4" />
            <span>Select Target Coastal City or Enter Coordinates</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs text-slate-300 max-h-[80vh] overflow-y-auto">
          {/* Method 1: Search by City Name */}
          <div className="space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Any Coastal City / District</span>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Visakhapatnam, Chennai, Mumbai, Surat, Tampa, Chittagong..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </form>

            {/* Results dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg divide-y divide-slate-800/80 overflow-hidden shadow-lg">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCityResult(item)}
                    className="w-full text-left p-2.5 hover:bg-slate-800/60 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-slate-200">{item.display_name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400">
                      {parseFloat(item.lat).toFixed(2)}°, {parseFloat(item.lon).toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Method 2: Auto Detect Location via ipgeolocation.io */}
          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Detect Location (ipgeolocation.io)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Uses your Geolocation API key to pinpoint coordinates and simulate local coastal hazard.
              </p>
              {detectStatus && (
                <div className="text-[11px] text-cyan-300 font-mono pt-1">
                  {detectStatus}
                </div>
              )}
            </div>
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              {isDetecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              <span>Detect My City</span>
            </button>
          </div>

          {/* Method 3: Manual Coordinate Inputs */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Enter Exact GPS Coordinates</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">City / Label</label>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="e.g. Visakhapatnam"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.001"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="e.g. 17.686"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.001"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="e.g. 83.218"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <button
              onClick={handleApplyManual}
              className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold py-2 rounded-lg transition-colors border border-slate-700"
            >
              Simulate Cyclone at These Coordinates
            </button>
          </div>

          {/* Method 4: Popular Coastal Presets */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div className="font-semibold text-slate-300">Quick Select Vulnerable Coastal Ports:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularHubs.map((hub, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const sc = generateCustomScenario(hub.name, hub.lat, hub.lng, hub.state);
                    onApplyScenario(sc);
                    onClose();
                  }}
                  className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-700 rounded-lg text-left transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-cyan-300">{hub.name}</div>
                  <div className="text-[10px] text-slate-400">{hub.state}</div>
                  <div className="text-[9px] font-mono text-cyan-400 mt-1">{hub.lat.toFixed(2)}°, {hub.lng.toFixed(2)}°</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

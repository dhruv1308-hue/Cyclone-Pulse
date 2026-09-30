export type CycloneCategory = 
  | 'Depression' 
  | 'Deep Depression' 
  | 'Cyclonic Storm (CS)' 
  | 'Severe Cyclonic Storm (SCS)' 
  | 'Very Severe Cyclonic Storm (VSCS)' 
  | 'Extremely Severe Cyclonic Storm (ESCS)' 
  | 'Super Cyclonic Storm (SuCS)';

export type TidalPhase = 'Spring High Tide' | 'Mean High Tide' | 'Neap Tide' | 'Low Tide';

export interface StormTrackPoint {
  timeOffsetHours: number; // e.g., -24 to +12
  lat: number;
  lng: number;
  windSpeedKts: number;
  windSpeedKmh: number;
  centralPressureHpa: number;
  category: CycloneCategory;
  radiusMaxWindKm: number;
  estimatedSurgeHeightM: number;
  label: string;
}

export interface CoastalWard {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  coordinates: [number, number][]; // Polygon coordinates
  population: number;
  kutchaHousesPct: number; // % of mud/thatch/unreinforced roofs
  semiPuccaPct: number;
  puccaPct: number;
  avgElevationM: number;
  distToCoastKm: number;
  criticalAssets: {
    hospitals: number;
    substations: number;
    waterPlants: number;
    telecomTowers: number;
    shelters: number;
    shelterCapacity: number;
  };
  // Dynamic computed fields based on simulation
  vulnerabilityScore?: number; // 0 - 100
  isInundated?: boolean;
  surgeDepthM?: number;
  evacuationStatus?: 'Safe' | 'Advisory' | 'Urgent Evacuate' | 'Evacuated';
}

export interface Shelter {
  id: string;
  name: string;
  wardId: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
  hasElevatedPlinth: boolean;
  hasSolarOrGenset: boolean;
  waterSupplyDays: number;
  hasMedicalKit: boolean;
  status: 'Ready' | 'Moderate' | 'Near Capacity' | 'Submerged Route';
}

export interface CriticalAsset {
  id: string;
  name: string;
  type: 'Hospital' | 'Power Substation' | 'Water Treatment' | 'Telecom Tower';
  wardId: string;
  lat: number;
  lng: number;
  elevationM: number;
  backupPower: boolean;
  isFlooded?: boolean;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface EvacuationRoute {
  id: string;
  name: string;
  originWard: string;
  destinationShelter: string;
  points: [number, number][];
  distanceKm: number;
  elevationMinM: number;
  status: 'Clear' | 'Caution' | 'Submerged';
  safeForVehicles: boolean;
}

export interface CycloneScenario {
  id: string;
  name: string;
  region: string;
  baseCategory: CycloneCategory;
  landfallTimeText: string;
  mapCenter: [number, number];
  zoom: number;
  track: StormTrackPoint[];
  wards: CoastalWard[];
  shelters: Shelter[];
  assets: CriticalAsset[];
  routes: EvacuationRoute[];
}

export interface SimulationState {
  currentHourOffset: number; // current playback hour, e.g. -12 to +6
  categoryMultiplier: number; // 0.8 to 1.3 to simulate intensification
  forwardSpeedKmh: number;
  tidalPhase: TidalPhase;
  tideAddonMeters: number;
  activeScenarioId: string;
  isPlaying: boolean;
  layers: {
    windCone: boolean;
    surgeInundation: boolean;
    wardsVulnerability: boolean;
    shelters: boolean;
    criticalAssets: boolean;
    evacuationRoutes: boolean;
  };
}

export interface ReliefLogistics {
  potableWaterLitersPerDay: number;
  dryRationPackets: number;
  babyNutritionUnits: number;
  ndrfRescueBoats: number;
  dewateringPumps: number;
  mobileDieselGenerators: number;
  emergencyMedicalKits: number;
}

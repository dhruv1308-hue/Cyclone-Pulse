import { CycloneScenario, CoastalWard, Shelter, CriticalAsset, EvacuationRoute, StormTrackPoint } from '../types/cyclone';

export function generateCustomScenario(cityName: string, lat: number, lng: number, stateName?: string): CycloneScenario {
  // Determine if location is east coast (approached from SE/East) or west coast (approached from SW/West) or generic
  // Default vector: storm approaches from sea
  const isWestCoast = lng < 77.5; // Roughly divides Indian subcontinent / general ocean orientation
  const lngDirection = isWestCoast ? -1 : 1; 

  const track: StormTrackPoint[] = [
    {
      timeOffsetHours: -24,
      lat: Number((lat - 1.8).toFixed(3)),
      lng: Number((lng + 2.0 * lngDirection).toFixed(3)),
      windSpeedKts: 95,
      windSpeedKmh: 175,
      centralPressureHpa: 952,
      category: 'Very Severe Cyclonic Storm (VSCS)',
      radiusMaxWindKm: 46,
      estimatedSurgeHeightM: 2.4,
      label: 'T-24h (Deep Sea Approach)'
    },
    {
      timeOffsetHours: -12,
      lat: Number((lat - 0.9).toFixed(3)),
      lng: Number((lng + 1.0 * lngDirection).toFixed(3)),
      windSpeedKts: 115,
      windSpeedKmh: 215,
      centralPressureHpa: 938,
      category: 'Extremely Severe Cyclonic Storm (ESCS)',
      radiusMaxWindKm: 38,
      estimatedSurgeHeightM: 3.8,
      label: 'T-12h (Shelf Crossing)'
    },
    {
      timeOffsetHours: 0,
      lat: Number(lat.toFixed(3)),
      lng: Number(lng.toFixed(3)),
      windSpeedKts: 130,
      windSpeedKmh: 240,
      centralPressureHpa: 924,
      category: 'Extremely Severe Cyclonic Storm (ESCS)',
      radiusMaxWindKm: 32,
      estimatedSurgeHeightM: 4.9,
      label: `T-0 Landfall (${cityName})`
    },
    {
      timeOffsetHours: 6,
      lat: Number((lat + 0.6).toFixed(3)),
      lng: Number((lng - 0.4 * lngDirection).toFixed(3)),
      windSpeedKts: 80,
      windSpeedKmh: 150,
      centralPressureHpa: 965,
      category: 'Very Severe Cyclonic Storm (VSCS)',
      radiusMaxWindKm: 45,
      estimatedSurgeHeightM: 2.1,
      label: 'T+6h (Inland Weakening)'
    },
    {
      timeOffsetHours: 12,
      lat: Number((lat + 1.2).toFixed(3)),
      lng: Number((lng - 0.8 * lngDirection).toFixed(3)),
      windSpeedKts: 50,
      windSpeedKmh: 95,
      centralPressureHpa: 986,
      category: 'Cyclonic Storm (CS)',
      radiusMaxWindKm: 55,
      estimatedSurgeHeightM: 0.6,
      label: 'T+12h (Deep Depression)'
    }
  ];

  // Generate 4-5 surrounding coastal wards
  const delta = 0.05;
  const wards: CoastalWard[] = [
    {
      id: `ward-${cityName.toLowerCase().replace(/\s+/g, '-')}-coast`,
      name: `${cityName} Coastal Seafront`,
      district: cityName,
      lat: Number((lat - 0.02).toFixed(3)),
      lng: Number((lng - 0.01).toFixed(3)),
      coordinates: [
        [Number((lat - 0.05).toFixed(3)), Number((lng - 0.04).toFixed(3))],
        [Number((lat - 0.01).toFixed(3)), Number((lng - 0.03).toFixed(3))],
        [Number((lat - 0.02).toFixed(3)), Number((lng + 0.03).toFixed(3))],
        [Number((lat - 0.06).toFixed(3)), Number((lng + 0.02).toFixed(3))]
      ],
      population: 48500,
      kutchaHousesPct: 46,
      semiPuccaPct: 30,
      puccaPct: 24,
      avgElevationM: 1.8,
      distToCoastKm: 0.3,
      criticalAssets: {
        hospitals: 2,
        substations: 2,
        waterPlants: 1,
        telecomTowers: 6,
        shelters: 5,
        shelterCapacity: 13000
      }
    },
    {
      id: `ward-${cityName.toLowerCase().replace(/\s+/g, '-')}-harbor`,
      name: `${cityName} Fishermen Harbor & Estuary`,
      district: cityName,
      lat: Number((lat + 0.03).toFixed(3)),
      lng: Number((lng + 0.02).toFixed(3)),
      coordinates: [
        [Number((lat + 0.01).toFixed(3)), Number((lng - 0.01).toFixed(3))],
        [Number((lat + 0.06).toFixed(3)), Number((lng + 0.01).toFixed(3))],
        [Number((lat + 0.05).toFixed(3)), Number((lng + 0.06).toFixed(3))],
        [Number((lat + 0.00).toFixed(3)), Number((lng + 0.04).toFixed(3))]
      ],
      population: 36200,
      kutchaHousesPct: 62,
      semiPuccaPct: 22,
      puccaPct: 16,
      avgElevationM: 1.2,
      distToCoastKm: 0.1,
      criticalAssets: {
        hospitals: 1,
        substations: 1,
        waterPlants: 0,
        telecomTowers: 4,
        shelters: 6,
        shelterCapacity: 14500
      }
    },
    {
      id: `ward-${cityName.toLowerCase().replace(/\s+/g, '-')}-urban`,
      name: `${cityName} Central Municipal Zone`,
      district: cityName,
      lat: Number((lat + 0.04).toFixed(3)),
      lng: Number((lng - 0.05).toFixed(3)),
      coordinates: [
        [Number((lat + 0.01).toFixed(3)), Number((lng - 0.08).toFixed(3))],
        [Number((lat + 0.07).toFixed(3)), Number((lng - 0.06).toFixed(3))],
        [Number((lat + 0.06).toFixed(3)), Number((lng - 0.02).toFixed(3))],
        [Number((lat + 0.00).toFixed(3)), Number((lng - 0.04).toFixed(3))]
      ],
      population: 82000,
      kutchaHousesPct: 24,
      semiPuccaPct: 28,
      puccaPct: 48,
      avgElevationM: 4.5,
      distToCoastKm: 2.2,
      criticalAssets: {
        hospitals: 4,
        substations: 3,
        waterPlants: 2,
        telecomTowers: 10,
        shelters: 8,
        shelterCapacity: 28000
      }
    },
    {
      id: `ward-${cityName.toLowerCase().replace(/\s+/g, '-')}-inland`,
      name: `${cityName} North Inland Highground`,
      district: cityName,
      lat: Number((lat + 0.10).toFixed(3)),
      lng: Number((lng - 0.04).toFixed(3)),
      coordinates: [
        [Number((lat + 0.07).toFixed(3)), Number((lng - 0.07).toFixed(3))],
        [Number((lat + 0.13).toFixed(3)), Number((lng - 0.05).toFixed(3))],
        [Number((lat + 0.12).toFixed(3)), Number((lng - 0.01).toFixed(3))],
        [Number((lat + 0.06).toFixed(3)), Number((lng - 0.03).toFixed(3))]
      ],
      population: 41000,
      kutchaHousesPct: 28,
      semiPuccaPct: 32,
      puccaPct: 40,
      avgElevationM: 8.2,
      distToCoastKm: 9.0,
      criticalAssets: {
        hospitals: 2,
        substations: 2,
        waterPlants: 1,
        telecomTowers: 6,
        shelters: 7,
        shelterCapacity: 22000
      }
    }
  ];

  // Shelters
  const shelters: Shelter[] = [
    {
      id: `sh-custom-1`,
      name: `${cityName} Marine Drive Multi-Purpose Shelter`,
      wardId: wards[0].id,
      lat: Number((lat - 0.015).toFixed(3)),
      lng: Number((lng + 0.005).toFixed(3)),
      capacity: 3500,
      currentOccupancy: 2400,
      hasElevatedPlinth: true,
      hasSolarOrGenset: true,
      waterSupplyDays: 4,
      hasMedicalKit: true,
      status: 'Moderate'
    },
    {
      id: `sh-custom-2`,
      name: `${cityName} Fishermen Union Disaster Bunker`,
      wardId: wards[1].id,
      lat: Number((lat + 0.025).toFixed(3)),
      lng: Number((lng + 0.028).toFixed(3)),
      capacity: 4200,
      currentOccupancy: 3800,
      hasElevatedPlinth: true,
      hasSolarOrGenset: true,
      waterSupplyDays: 5,
      hasMedicalKit: true,
      status: 'Near Capacity'
    },
    {
      id: `sh-custom-3`,
      name: `${cityName} Municipal Indoor Sports Complex`,
      wardId: wards[2].id,
      lat: Number((lat + 0.045).toFixed(3)),
      lng: Number((lng - 0.045).toFixed(3)),
      capacity: 6500,
      currentOccupancy: 3100,
      hasElevatedPlinth: true,
      hasSolarOrGenset: true,
      waterSupplyDays: 6,
      hasMedicalKit: true,
      status: 'Ready'
    },
    {
      id: `sh-custom-4`,
      name: `${cityName} Inland Regional Refuge Centre`,
      wardId: wards[3].id,
      lat: Number((lat + 0.105).toFixed(3)),
      lng: Number((lng - 0.035).toFixed(3)),
      capacity: 7000,
      currentOccupancy: 1500,
      hasElevatedPlinth: true,
      hasSolarOrGenset: true,
      waterSupplyDays: 7,
      hasMedicalKit: true,
      status: 'Ready'
    }
  ];

  // Critical Assets
  const assets: CriticalAsset[] = [
    {
      id: `ast-custom-1`,
      name: `${cityName} Government Civil Hospital & Trauma Center`,
      type: 'Hospital',
      wardId: wards[2].id,
      lat: Number((lat + 0.042).toFixed(3)),
      lng: Number((lng - 0.048).toFixed(3)),
      elevationM: 4.8,
      backupPower: true,
      riskLevel: 'Moderate'
    },
    {
      id: `ast-custom-2`,
      name: `${cityName} Coastal 132/33kV Grid Substation`,
      type: 'Power Substation',
      wardId: wards[0].id,
      lat: Number((lat - 0.022).toFixed(3)),
      lng: Number((lng - 0.008).toFixed(3)),
      elevationM: 1.5,
      backupPower: false,
      riskLevel: 'Critical'
    },
    {
      id: `ast-custom-3`,
      name: `${cityName} Estuary Water Purification Works`,
      type: 'Water Treatment',
      wardId: wards[1].id,
      lat: Number((lat + 0.028).toFixed(3)),
      lng: Number((lng + 0.018).toFixed(3)),
      elevationM: 1.3,
      backupPower: true,
      riskLevel: 'Critical'
    },
    {
      id: `ast-custom-4`,
      name: `${cityName} Emergency Broadcast VHF Tower`,
      type: 'Telecom Tower',
      wardId: wards[3].id,
      lat: Number((lat + 0.098).toFixed(3)),
      lng: Number((lng - 0.038).toFixed(3)),
      elevationM: 8.5,
      backupPower: true,
      riskLevel: 'Low'
    }
  ];

  // Evacuation Routes
  const routes: EvacuationRoute[] = [
    {
      id: `rt-custom-1`,
      name: `${cityName} Harbor Basti -> Central Sports Complex`,
      originWard: wards[1].name,
      destinationShelter: shelters[2].name,
      points: [
        [Number((lat + 0.025).toFixed(3)), Number((lng + 0.025).toFixed(3))],
        [Number((lat + 0.035).toFixed(3)), Number((lng - 0.010).toFixed(3))],
        [Number((lat + 0.045).toFixed(3)), Number((lng - 0.045).toFixed(3))]
      ],
      distanceKm: 6.2,
      elevationMinM: 1.4,
      status: 'Caution',
      safeForVehicles: true
    },
    {
      id: `rt-custom-2`,
      name: `${cityName} Low Seafront Road -> Inland Refuge Centre`,
      originWard: wards[0].name,
      destinationShelter: shelters[3].name,
      points: [
        [Number((lat - 0.02).toFixed(3)), Number((lng - 0.01).toFixed(3))],
        [Number((lat + 0.03).toFixed(3)), Number((lng - 0.02).toFixed(3))],
        [Number((lat + 0.07).toFixed(3)), Number((lng - 0.03).toFixed(3))],
        [Number((lat + 0.105).toFixed(3)), Number((lng - 0.035).toFixed(3))]
      ],
      distanceKm: 14.5,
      elevationMinM: 1.1,
      status: 'Submerged',
      safeForVehicles: false
    }
  ];

  return {
    id: `custom-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    name: `Cyclone Threat Scenario: ${cityName}`,
    region: `${cityName}${stateName ? `, ${stateName}` : ''} Coastal Zone`,
    baseCategory: 'Extremely Severe Cyclonic Storm (ESCS)',
    landfallTimeText: 'Forecast Landfall in T-6 Hours',
    mapCenter: [lat, lng],
    zoom: 11,
    track,
    wards,
    shelters,
    assets,
    routes
  };
}

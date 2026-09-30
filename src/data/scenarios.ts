import { CycloneScenario } from '../types/cyclone';

export const SCENARIOS: CycloneScenario[] = [
  {
    id: 'cyclone-varuna-odisha',
    name: 'Super Cyclone "Varuna" (Odisha Coast - Puri & Paradip)',
    region: 'Bay of Bengal — Odisha Coastal Corridor',
    baseCategory: 'Extremely Severe Cyclonic Storm (ESCS)',
    landfallTimeText: '2026-09-26 15:30 IST (Near Astaranga/Puri)',
    mapCenter: [19.88, 86.15],
    zoom: 10,
    track: [
      {
        timeOffsetHours: -24,
        lat: 18.25,
        lng: 88.10,
        windSpeedKts: 90,
        windSpeedKmh: 165,
        centralPressureHpa: 955,
        category: 'Very Severe Cyclonic Storm (VSCS)',
        radiusMaxWindKm: 48,
        estimatedSurgeHeightM: 2.1,
        label: 'T-24h (Central Bay)'
      },
      {
        timeOffsetHours: -18,
        lat: 18.65,
        lng: 87.55,
        windSpeedKts: 105,
        windSpeedKmh: 195,
        centralPressureHpa: 942,
        category: 'Extremely Severe Cyclonic Storm (ESCS)',
        radiusMaxWindKm: 42,
        estimatedSurgeHeightM: 3.2,
        label: 'T-18h (Rapid Intensification)'
      },
      {
        timeOffsetHours: -12,
        lat: 19.10,
        lng: 87.00,
        windSpeedKts: 115,
        windSpeedKmh: 215,
        centralPressureHpa: 934,
        category: 'Extremely Severe Cyclonic Storm (ESCS)',
        radiusMaxWindKm: 38,
        estimatedSurgeHeightM: 4.1,
        label: 'T-12h (Approaching Shelf)'
      },
      {
        timeOffsetHours: -6,
        lat: 19.45,
        lng: 86.50,
        windSpeedKts: 120,
        windSpeedKmh: 220,
        centralPressureHpa: 928,
        category: 'Extremely Severe Cyclonic Storm (ESCS)',
        radiusMaxWindKm: 35,
        estimatedSurgeHeightM: 4.8,
        label: 'T-6h (Pre-landfall Surge)'
      },
      {
        timeOffsetHours: 0,
        lat: 19.82,
        lng: 86.08,
        windSpeedKts: 125,
        windSpeedKmh: 230,
        centralPressureHpa: 924,
        category: 'Extremely Severe Cyclonic Storm (ESCS)',
        radiusMaxWindKm: 32,
        estimatedSurgeHeightM: 5.4,
        label: 'T-0 Landfall (Puri/Astaranga)'
      },
      {
        timeOffsetHours: 6,
        lat: 20.25,
        lng: 85.85,
        windSpeedKts: 85,
        windSpeedKmh: 155,
        centralPressureHpa: 960,
        category: 'Very Severe Cyclonic Storm (VSCS)',
        radiusMaxWindKm: 45,
        estimatedSurgeHeightM: 2.3,
        label: 'T+6h (Inland Weakening)'
      },
      {
        timeOffsetHours: 12,
        lat: 20.75,
        lng: 85.55,
        windSpeedKts: 55,
        windSpeedKmh: 100,
        centralPressureHpa: 982,
        category: 'Severe Cyclonic Storm (SCS)',
        radiusMaxWindKm: 55,
        estimatedSurgeHeightM: 0.8,
        label: 'T+12h (Deep Inland)'
      }
    ],
    wards: [
      {
        id: 'ward-puri-coastal',
        name: 'Puri South Sea Ward',
        district: 'Puri',
        lat: 19.79,
        lng: 85.82,
        coordinates: [
          [19.78, 85.78],
          [19.82, 85.81],
          [19.81, 85.87],
          [19.77, 85.84]
        ],
        population: 46200,
        kutchaHousesPct: 38,
        semiPuccaPct: 32,
        puccaPct: 30,
        avgElevationM: 3.2,
        distToCoastKm: 0.4,
        criticalAssets: {
          hospitals: 2,
          substations: 2,
          waterPlants: 1,
          telecomTowers: 6,
          shelters: 5,
          shelterCapacity: 12500
        }
      },
      {
        id: 'ward-astaranga-estuary',
        name: 'Astaranga Mangrove & Delta',
        district: 'Puri',
        lat: 19.98,
        lng: 86.26,
        coordinates: [
          [19.93, 86.21],
          [20.02, 86.25],
          [20.01, 86.32],
          [19.94, 86.29]
        ],
        population: 34100,
        kutchaHousesPct: 58,
        semiPuccaPct: 26,
        puccaPct: 16,
        avgElevationM: 1.8,
        distToCoastKm: 0.2,
        criticalAssets: {
          hospitals: 1,
          substations: 1,
          waterPlants: 1,
          telecomTowers: 4,
          shelters: 6,
          shelterCapacity: 14000
        }
      },
      {
        id: 'ward-konark-heritage',
        name: 'Konark Marine Drive & Chandrabhaga',
        district: 'Puri',
        lat: 19.89,
        lng: 86.11,
        coordinates: [
          [19.85, 86.06],
          [19.92, 86.10],
          [19.91, 86.17],
          [19.86, 86.14]
        ],
        population: 28900,
        kutchaHousesPct: 44,
        semiPuccaPct: 31,
        puccaPct: 25,
        avgElevationM: 2.6,
        distToCoastKm: 0.6,
        criticalAssets: {
          hospitals: 1,
          substations: 1,
          waterPlants: 1,
          telecomTowers: 5,
          shelters: 4,
          shelterCapacity: 9200
        }
      },
      {
        id: 'ward-paradip-port',
        name: 'Paradip Port & Industrial Belt',
        district: 'Jagatsinghpur',
        lat: 20.28,
        lng: 86.68,
        coordinates: [
          [20.24, 86.63],
          [20.31, 86.66],
          [20.32, 86.74],
          [20.26, 86.72]
        ],
        population: 78500,
        kutchaHousesPct: 29,
        semiPuccaPct: 25,
        puccaPct: 46,
        avgElevationM: 2.9,
        distToCoastKm: 0.5,
        criticalAssets: {
          hospitals: 3,
          substations: 4,
          waterPlants: 2,
          telecomTowers: 12,
          shelters: 9,
          shelterCapacity: 26000
        }
      },
      {
        id: 'ward-erasama-coastal',
        name: 'Erasama Cyclone Buffer Zone',
        district: 'Jagatsinghpur',
        lat: 20.15,
        lng: 86.48,
        coordinates: [
          [20.10, 86.42],
          [20.19, 86.46],
          [20.18, 86.55],
          [20.11, 86.51]
        ],
        population: 41200,
        kutchaHousesPct: 62,
        semiPuccaPct: 22,
        puccaPct: 16,
        avgElevationM: 1.5,
        distToCoastKm: 0.3,
        criticalAssets: {
          hospitals: 1,
          substations: 1,
          waterPlants: 0,
          telecomTowers: 3,
          shelters: 8,
          shelterCapacity: 18500
        }
      },
      {
        id: 'ward-kakatpur-inland',
        name: 'Kakatpur Agricultural Plateau',
        district: 'Puri',
        lat: 20.04,
        lng: 86.08,
        coordinates: [
          [20.00, 86.02],
          [20.08, 86.06],
          [20.07, 86.14],
          [20.01, 86.11]
        ],
        population: 31800,
        kutchaHousesPct: 35,
        semiPuccaPct: 35,
        puccaPct: 30,
        avgElevationM: 6.8,
        distToCoastKm: 14.5,
        criticalAssets: {
          hospitals: 2,
          substations: 2,
          waterPlants: 1,
          telecomTowers: 6,
          shelters: 7,
          shelterCapacity: 19000
        }
      }
    ],
    shelters: [
      {
        id: 'sh-1',
        name: 'MPCS Astaranga High School Cyclone Shelter',
        wardId: 'ward-astaranga-estuary',
        lat: 20.01,
        lng: 86.27,
        capacity: 2500,
        currentOccupancy: 1820,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 5,
        hasMedicalKit: true,
        status: 'Moderate'
      },
      {
        id: 'sh-2',
        name: 'Puri District Sports Complex Elevated Shelter',
        wardId: 'ward-puri-coastal',
        lat: 19.82,
        lng: 85.83,
        capacity: 4000,
        currentOccupancy: 3600,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 4,
        hasMedicalKit: true,
        status: 'Near Capacity'
      },
      {
        id: 'sh-3',
        name: 'Chandrabhaga Community Multi-Purpose Center',
        wardId: 'ward-konark-heritage',
        lat: 19.89,
        lng: 86.13,
        capacity: 2200,
        currentOccupancy: 950,
        hasElevatedPlinth: true,
        hasSolarOrGenset: false,
        waterSupplyDays: 3,
        hasMedicalKit: true,
        status: 'Ready'
      },
      {
        id: 'sh-4',
        name: 'Erasama Block Multi-Hazard Shelter Block-A',
        wardId: 'ward-erasama-coastal',
        lat: 20.16,
        lng: 86.49,
        capacity: 3200,
        currentOccupancy: 2850,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 4,
        hasMedicalKit: true,
        status: 'Near Capacity'
      },
      {
        id: 'sh-5',
        name: 'Paradip Port Trust Township Cyclone Bunker',
        wardId: 'ward-paradip-port',
        lat: 20.29,
        lng: 86.67,
        capacity: 6000,
        currentOccupancy: 2900,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 7,
        hasMedicalKit: true,
        status: 'Ready'
      },
      {
        id: 'sh-6',
        name: 'Kakatpur Inland Regional Refuge Hub',
        wardId: 'ward-kakatpur-inland',
        lat: 20.05,
        lng: 86.09,
        capacity: 5500,
        currentOccupancy: 1200,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 6,
        hasMedicalKit: true,
        status: 'Ready'
      }
    ],
    assets: [
      {
        id: 'ast-1',
        name: 'Puri District Headquarters Hospital (DHH)',
        type: 'Hospital',
        wardId: 'ward-puri-coastal',
        lat: 19.815,
        lng: 85.828,
        elevationM: 3.8,
        backupPower: true,
        riskLevel: 'Moderate'
      },
      {
        id: 'ast-2',
        name: 'Astaranga Coastal Substation 132/33kV',
        type: 'Power Substation',
        wardId: 'ward-astaranga-estuary',
        lat: 19.995,
        lng: 86.255,
        elevationM: 1.6,
        backupPower: false,
        riskLevel: 'Critical'
      },
      {
        id: 'ast-3',
        name: 'Paradip Industrial Water Treatment Works',
        type: 'Water Treatment',
        wardId: 'ward-paradip-port',
        lat: 20.275,
        lng: 86.665,
        elevationM: 2.7,
        backupPower: true,
        riskLevel: 'High'
      },
      {
        id: 'ast-4',
        name: 'Erasama Coastal Transmission Tower (5G/VHF)',
        type: 'Telecom Tower',
        wardId: 'ward-erasama-coastal',
        lat: 20.145,
        lng: 86.475,
        elevationM: 1.4,
        backupPower: true,
        riskLevel: 'Critical'
      },
      {
        id: 'ast-5',
        name: 'Konark Sub-Divisional Hospital & Trauma Unit',
        type: 'Hospital',
        wardId: 'ward-konark-heritage',
        lat: 19.892,
        lng: 86.115,
        elevationM: 3.1,
        backupPower: true,
        riskLevel: 'Moderate'
      }
    ],
    routes: [
      {
        id: 'rt-1',
        name: 'Astaranga Fishermen Hamlet -> Inland Refuge Hub',
        originWard: 'Astaranga Mangrove & Delta',
        destinationShelter: 'Kakatpur Inland Regional Refuge Hub',
        points: [
          [19.98, 86.26],
          [20.00, 86.20],
          [20.02, 86.14],
          [20.05, 86.09]
        ],
        distanceKm: 18.4,
        elevationMinM: 1.7,
        status: 'Caution',
        safeForVehicles: true
      },
      {
        id: 'rt-2',
        name: 'Puri Low-lying Basti -> Sports Complex Shelter',
        originWard: 'Puri South Sea Ward',
        destinationShelter: 'Puri District Sports Complex Elevated Shelter',
        points: [
          [19.79, 85.82],
          [19.80, 85.825],
          [19.82, 85.83]
        ],
        distanceKm: 3.8,
        elevationMinM: 2.1,
        status: 'Clear',
        safeForVehicles: true
      },
      {
        id: 'rt-3',
        name: 'Erasama Coastal Marsh Route -> Block A Bunker',
        originWard: 'Erasama Cyclone Buffer Zone',
        destinationShelter: 'Erasama Block Multi-Hazard Shelter Block-A',
        points: [
          [20.12, 86.49],
          [20.14, 86.48],
          [20.16, 86.49]
        ],
        distanceKm: 4.6,
        elevationMinM: 1.2,
        status: 'Submerged',
        safeForVehicles: false
      },
      {
        id: 'rt-4',
        name: 'Paradip Port Slum Quarter -> Township Bunker',
        originWard: 'Paradip Port & Industrial Belt',
        destinationShelter: 'Paradip Port Trust Township Cyclone Bunker',
        points: [
          [20.26, 86.70],
          [20.28, 86.68],
          [20.29, 86.67]
        ],
        distanceKm: 4.2,
        elevationMinM: 2.4,
        status: 'Clear',
        safeForVehicles: true
      }
    ]
  },
  {
    id: 'cyclone-amphan-sundarbans',
    name: 'Super Cyclone "Amphan Replay" (Sundarbans & Sagar Island)',
    region: 'Ganges Delta — West Bengal Coastal Archipelago',
    baseCategory: 'Super Cyclonic Storm (SuCS)',
    landfallTimeText: '2026-10-04 17:00 IST (Near Sagar Island / Kakdwip)',
    mapCenter: [21.80, 88.20],
    zoom: 10,
    track: [
      {
        timeOffsetHours: -24,
        lat: 19.80,
        lng: 87.80,
        windSpeedKts: 120,
        windSpeedKmh: 220,
        centralPressureHpa: 925,
        category: 'Extremely Severe Cyclonic Storm (ESCS)',
        radiusMaxWindKm: 42,
        estimatedSurgeHeightM: 3.8,
        label: 'T-24h (North-bound Tracking)'
      },
      {
        timeOffsetHours: -12,
        lat: 20.80,
        lng: 88.05,
        windSpeedKts: 135,
        windSpeedKmh: 250,
        centralPressureHpa: 915,
        category: 'Super Cyclonic Storm (SuCS)',
        radiusMaxWindKm: 38,
        estimatedSurgeHeightM: 5.2,
        label: 'T-12h (Approaching Delta)'
      },
      {
        timeOffsetHours: 0,
        lat: 21.65,
        lng: 88.15,
        windSpeedKts: 140,
        windSpeedKmh: 260,
        centralPressureHpa: 908,
        category: 'Super Cyclonic Storm (SuCS)',
        radiusMaxWindKm: 32,
        estimatedSurgeHeightM: 6.2,
        label: 'T-0 Landfall (Sagar Island)'
      },
      {
        timeOffsetHours: 6,
        lat: 22.35,
        lng: 88.35,
        windSpeedKts: 95,
        windSpeedKmh: 175,
        centralPressureHpa: 950,
        category: 'Very Severe Cyclonic Storm (VSCS)',
        radiusMaxWindKm: 45,
        estimatedSurgeHeightM: 3.4,
        label: 'T+6h (Sundarbans Mangrove Core)'
      }
    ],
    wards: [
      {
        id: 'ward-sagar-south',
        name: 'Sagar Island South Gangasagar',
        district: 'South 24 Parganas',
        lat: 21.62,
        lng: 88.06,
        coordinates: [
          [21.58, 88.02],
          [21.65, 88.05],
          [21.64, 88.11],
          [21.59, 88.08]
        ],
        population: 52000,
        kutchaHousesPct: 68,
        semiPuccaPct: 22,
        puccaPct: 10,
        avgElevationM: 1.2,
        distToCoastKm: 0.1,
        criticalAssets: {
          hospitals: 1,
          substations: 1,
          waterPlants: 0,
          telecomTowers: 4,
          shelters: 8,
          shelterCapacity: 17000
        }
      },
      {
        id: 'ward-kakdwip-port',
        name: 'Kakdwip Fishing Harbor',
        district: 'South 24 Parganas',
        lat: 21.87,
        lng: 88.18,
        coordinates: [
          [21.83, 88.14],
          [21.91, 88.16],
          [21.90, 88.22],
          [21.84, 88.20]
        ],
        population: 64000,
        kutchaHousesPct: 52,
        semiPuccaPct: 30,
        puccaPct: 18,
        avgElevationM: 2.1,
        distToCoastKm: 0.8,
        criticalAssets: {
          hospitals: 2,
          substations: 2,
          waterPlants: 1,
          telecomTowers: 7,
          shelters: 7,
          shelterCapacity: 19500
        }
      },
      {
        id: 'ward-gosaba-mangrove',
        name: 'Gosaba Tidal Island Buffer',
        district: 'South 24 Parganas',
        lat: 22.16,
        lng: 88.80,
        coordinates: [
          [22.12, 88.75],
          [22.20, 88.78],
          [22.19, 88.86],
          [22.13, 88.83]
        ],
        population: 39500,
        kutchaHousesPct: 74,
        semiPuccaPct: 18,
        puccaPct: 8,
        avgElevationM: 1.0,
        distToCoastKm: 0.2,
        criticalAssets: {
          hospitals: 1,
          substations: 0,
          waterPlants: 0,
          telecomTowers: 3,
          shelters: 6,
          shelterCapacity: 13000
        }
      }
    ],
    shelters: [
      {
        id: 'sh-sb-1',
        name: 'Gangasagar Elevated Pilgrim Complex Shelter',
        wardId: 'ward-sagar-south',
        lat: 21.63,
        lng: 88.07,
        capacity: 4500,
        currentOccupancy: 3900,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 4,
        hasMedicalKit: true,
        status: 'Near Capacity'
      },
      {
        id: 'sh-sb-2',
        name: 'Kakdwip Sub-Divisional Multi-Hazard Shelter',
        wardId: 'ward-kakdwip-port',
        lat: 21.88,
        lng: 88.19,
        capacity: 5000,
        currentOccupancy: 2100,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 5,
        hasMedicalKit: true,
        status: 'Ready'
      }
    ],
    assets: [
      {
        id: 'ast-sb-1',
        name: 'Sagar Island Rural Hospital',
        type: 'Hospital',
        wardId: 'ward-sagar-south',
        lat: 21.625,
        lng: 88.065,
        elevationM: 1.5,
        backupPower: true,
        riskLevel: 'Critical'
      },
      {
        id: 'ast-sb-2',
        name: 'Kakdwip Grid Substation 33/11kV',
        type: 'Power Substation',
        wardId: 'ward-kakdwip-port',
        lat: 21.875,
        lng: 88.175,
        elevationM: 2.0,
        backupPower: false,
        riskLevel: 'High'
      }
    ],
    routes: [
      {
        id: 'rt-sb-1',
        name: 'Gangasagar Beach Embankment -> Pilgrim Shelter',
        originWard: 'Sagar Island South Gangasagar',
        destinationShelter: 'Gangasagar Elevated Pilgrim Complex Shelter',
        points: [
          [21.60, 88.05],
          [21.62, 88.06],
          [21.63, 88.07]
        ],
        distanceKm: 3.5,
        elevationMinM: 0.9,
        status: 'Submerged',
        safeForVehicles: false
      }
    ]
  },
  {
    id: 'cyclone-michaung-andhra-tn',
    name: 'Severe Cyclone "Michaung" (Andhra & TN Coastal Belt)',
    region: 'South Coromandel Coast — Nellore & Machilipatnam',
    baseCategory: 'Very Severe Cyclonic Storm (VSCS)',
    landfallTimeText: '2026-11-12 11:30 IST (Near Bapatla/Machilipatnam)',
    mapCenter: [15.82, 80.35],
    zoom: 10,
    track: [
      {
        timeOffsetHours: -24,
        lat: 14.10,
        lng: 81.20,
        windSpeedKts: 75,
        windSpeedKmh: 140,
        centralPressureHpa: 978,
        category: 'Very Severe Cyclonic Storm (VSCS)',
        radiusMaxWindKm: 50,
        estimatedSurgeHeightM: 1.8,
        label: 'T-24h (Off Nellore Coast)'
      },
      {
        timeOffsetHours: -12,
        lat: 15.00,
        lng: 80.70,
        windSpeedKts: 90,
        windSpeedKmh: 165,
        centralPressureHpa: 965,
        category: 'Very Severe Cyclonic Storm (VSCS)',
        radiusMaxWindKm: 44,
        estimatedSurgeHeightM: 2.8,
        label: 'T-12h (Accelerating North)'
      },
      {
        timeOffsetHours: 0,
        lat: 15.85,
        lng: 80.32,
        windSpeedKts: 100,
        windSpeedKmh: 185,
        centralPressureHpa: 954,
        category: 'Very Severe Cyclonic Storm (VSCS)',
        radiusMaxWindKm: 36,
        estimatedSurgeHeightM: 3.6,
        label: 'T-0 Landfall (Bapatla Coast)'
      },
      {
        timeOffsetHours: 6,
        lat: 16.50,
        lng: 80.15,
        windSpeedKts: 60,
        windSpeedKmh: 110,
        centralPressureHpa: 985,
        category: 'Cyclonic Storm (CS)',
        radiusMaxWindKm: 50,
        estimatedSurgeHeightM: 1.2,
        label: 'T+6h (Guntur/Vijayawada Basin)'
      }
    ],
    wards: [
      {
        id: 'ward-bapatla-beach',
        name: 'Bapatla Suryalanka Coastal Strip',
        district: 'Bapatla',
        lat: 15.86,
        lng: 80.44,
        coordinates: [
          [15.82, 80.40],
          [15.90, 80.43],
          [15.89, 80.50],
          [15.83, 80.47]
        ],
        population: 41000,
        kutchaHousesPct: 42,
        semiPuccaPct: 33,
        puccaPct: 25,
        avgElevationM: 2.8,
        distToCoastKm: 0.3,
        criticalAssets: {
          hospitals: 1,
          substations: 2,
          waterPlants: 1,
          telecomTowers: 6,
          shelters: 5,
          shelterCapacity: 11500
        }
      },
      {
        id: 'ward-nizampatnam-harbor',
        name: 'Nizampatnam Delta & Aquaculture Belt',
        district: 'Bapatla',
        lat: 15.91,
        lng: 80.65,
        coordinates: [
          [15.87, 80.60],
          [15.95, 80.64],
          [15.94, 80.72],
          [15.88, 80.69]
        ],
        population: 38200,
        kutchaHousesPct: 56,
        semiPuccaPct: 28,
        puccaPct: 16,
        avgElevationM: 1.4,
        distToCoastKm: 0.2,
        criticalAssets: {
          hospitals: 1,
          substations: 1,
          waterPlants: 0,
          telecomTowers: 5,
          shelters: 6,
          shelterCapacity: 13500
        }
      }
    ],
    shelters: [
      {
        id: 'sh-ap-1',
        name: 'Bapatla Engineering College Elevated Relief Center',
        wardId: 'ward-bapatla-beach',
        lat: 15.89,
        lng: 80.47,
        capacity: 3500,
        currentOccupancy: 1400,
        hasElevatedPlinth: true,
        hasSolarOrGenset: true,
        waterSupplyDays: 5,
        hasMedicalKit: true,
        status: 'Ready'
      }
    ],
    assets: [
      {
        id: 'ast-ap-1',
        name: 'Bapatla Area Hospital',
        type: 'Hospital',
        wardId: 'ward-bapatla-beach',
        lat: 15.885,
        lng: 80.455,
        elevationM: 3.2,
        backupPower: true,
        riskLevel: 'Moderate'
      }
    ],
    routes: [
      {
        id: 'rt-ap-1',
        name: 'Suryalanka Beach Road -> Relief Center',
        originWard: 'Bapatla Suryalanka Coastal Strip',
        destinationShelter: 'Bapatla Engineering College Elevated Relief Center',
        points: [
          [15.85, 80.42],
          [15.87, 80.44],
          [15.89, 80.47]
        ],
        distanceKm: 5.8,
        elevationMinM: 2.1,
        status: 'Clear',
        safeForVehicles: true
      }
    ]
  }
];

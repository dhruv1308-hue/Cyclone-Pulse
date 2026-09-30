import { CycloneScenario, SimulationState, CoastalWard, Shelter, CriticalAsset, EvacuationRoute, ReliefLogistics, StormTrackPoint } from '../types/cyclone';

export interface EvaluatedSimulation {
  activePoint: StormTrackPoint;
  totalExposedPopulation: number;
  totalKutchaRoofRiskCount: number;
  floodedAssetsCount: number;
  submergedRoutesCount: number;
  shelterUtilizationPct: number;
  evaluatedWards: CoastalWard[];
  evaluatedAssets: CriticalAsset[];
  evaluatedRoutes: EvacuationRoute[];
  evaluatedShelters: Shelter[];
  logistics: ReliefLogistics;
  peakSurgeWaterLevelM: number;
}

/** Analyze wind patterns to predict cyclone development */
export interface WindPatternAnalysis {
  windShearKmh: number;
  convergenceIndex: number;
  vorticity: number;
  seaSurfaceTempInfluence: number;
  predictionHorizonHours: number;
  predictedIntensityChange: 'weakening' | 'stable' | 'intensifying';
  recommendedAction: 'monitor' | 'prepare' | 'urgent_prepare';
}

// Interpolate track point for smooth time-scrubbing
export function interpolateTrackPoint(track: StormTrackPoint[], currentHour: number, categoryMultiplier: number, tideAddonMeters: number): StormTrackPoint {
  if (track.length === 0) {
    throw new Error('Track must contain points');
  }

  // Exact match or clamped bounds
  if (currentHour <= track[0].timeOffsetHours) {
    return adjustPointIntensity(track[0], categoryMultiplier, tideAddonMeters);
  }
  if (currentHour >= track[track.length - 1].timeOffsetHours) {
    return adjustPointIntensity(track[track.length - 1], categoryMultiplier, tideAddonMeters);
  }

  // Find surrounding points
  let p1 = track[0];
  let p2 = track[1];
  for (let i = 0; i < track.length - 1; i++) {
    if (currentHour >= track[i].timeOffsetHours && currentHour <= track[i + 1].timeOffsetHours) {
      p1 = track[i];
      p2 = track[i + 1];
      break;
    }
  }

  const range = p2.timeOffsetHours - p1.timeOffsetHours;
  const progress = range === 0 ? 0 : (currentHour - p1.timeOffsetHours) / range;

  const lat = p1.lat + (p2.lat - p1.lat) * progress;
  const lng = p1.lng + (p2.lng - p1.lng) * progress;
  const rawWindSpeedKts = p1.windSpeedKts + (p2.windSpeedKts - p1.windSpeedKts) * progress;
  const rawWindKmh = p1.windSpeedKmh + (p2.windSpeedKmh - p1.windSpeedKmh) * progress;
  const rawPressure = p1.centralPressureHpa + (p2.centralPressureHpa - p1.centralPressureHpa) * progress;
  const rawSurge = p1.estimatedSurgeHeightM + (p2.estimatedSurgeHeightM - p1.estimatedSurgeHeightM) * progress;
  const rMax = p1.radiusMaxWindKm + (p2.radiusMaxWindKm - p1.radiusMaxWindKm) * progress;

  const interpolated: StormTrackPoint = {
    timeOffsetHours: currentHour,
    lat,
    lng,
    windSpeedKts: Math.round(rawWindSpeedKts),
    windSpeedKmh: Math.round(rawWindKmh),
    centralPressureHpa: Math.round(rawPressure),
    category: p1.category,
    radiusMaxWindKm: Math.round(rMax),
    estimatedSurgeHeightM: Number(rawSurge.toFixed(2)),
    label: `T${currentHour >= 0 ? '+' : ''}${Math.round(currentHour)}h (${progress < 0.5 ? p1.label : p2.label})`
  };

  return adjustPointIntensity(interpolated, categoryMultiplier, tideAddonMeters);
}

function adjustPointIntensity(point: StormTrackPoint, multiplier: number, tideAddon: number): StormTrackPoint {
  const adjustedWindKts = Math.round(point.windSpeedKts * multiplier);
  const adjustedWindKmh = Math.round(point.windSpeedKmh * multiplier);
  const pressureDrop = (1013 - point.centralPressureHpa) * multiplier;
  const adjustedPressure = Math.round(1013 - pressureDrop);
  
  // Hydrodynamic surge approximation with tidal coupling
  const baseSurge = point.estimatedSurgeHeightM * Math.pow(multiplier, 1.4);
  const totalWaterSurge = Number((baseSurge + tideAddon).toFixed(2));

  return {
    ...point,
    windSpeedKts: adjustedWindKts,
    windSpeedKmh: adjustedWindKmh,
    centralPressureHpa: adjustedPressure,
    estimatedSurgeHeightM: Math.max(0.5, totalWaterSurge)
  };
}

// Haversine distance in km
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Analyze wind patterns to predict cyclone development */
export interface WindPatternAnalysis {
  windShearKmh: number; // Difference in wind speed over distance
  convergenceIndex: number; // 0-1, higher = more likely to intensify
  vorticity: number; // Atmospheric vorticity (rotation)
  seaSurfaceTempInfluence: number; // 0-1, warmer water = more intensification
  predictionHorizonHours: number; // How many hours prediction is valid for
  predictedIntensityChange: 'weakening' | 'stable' | 'intensifying';
  recommendedAction: 'monitor' | 'prepare' | 'urgent_prepare';
}

export function analyzeWindPatterns(
  track: StormTrackPoint[],
  currentHour: number,
  seaSurfaceTempC: number
): WindPatternAnalysis {
  // Find current point in track
  let currentPoint = track[0];
  for (const point of track) {
    if (point.timeOffsetHours <= currentHour && (point === track[track.length - 1] || track[track.indexOf(point) + 1].timeOffsetHours > currentHour)) {
      currentPoint = point;
      break;
    }
  }

  // 1. Wind shear analysis (change in wind speed over distance)
  let windShearKmh = 0;
  let shearSamples = 0;
  for (let i = 1; i < Math.min(track.length, 5); i++) {
    const p1 = track[i - 1];
    const p2 = track[i];
    if (p1.timeOffsetHours <= currentHour && p2.timeOffsetHours >= currentHour) {
      const dist = getDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng);
      if (dist > 0) {
        const windDiff = Math.abs(p2.windSpeedKmh - p1.windSpeedKmh);
        windShearKmh += windDiff / dist;
        shearSamples++;
      }
    }
  }
  windShearKmh = shearSamples > 0 ? windShearKmh / shearSamples : 0;

  // 2. Convergence index - based on track curvature and wind patterns
  let convergenceIndex = 0.5; // Default neutral
  if (track.length >= 3) {
    // Calculate track curvature - tighter curves suggest intensification
    let totalCurvature = 0;
    let validSamples = 0;
    for (let i = 1; i < track.length - 1; i++) {
      const p0 = track[i - 1];
      const p1 = track[i];
      const p2 = track[i + 1];
      if (p0.timeOffsetHours <= currentHour && p2.timeOffsetHours >= currentHour) {
        // Simple curvature approximation
        const bearing1 = Math.atan2(p1.lng - p0.lng, p1.lat - p0.lat);
        const bearing2 = Math.atan2(p2.lng - p1.lng, p2.lat - p1.lat);
        const curvature = Math.abs(bearing2 - bearing1) / getDistanceKm(p0.lat, p0.lng, p1.lat, p1.lng);
        totalCurvature += curvature;
        validSamples++;
      }
    }
    convergenceIndex = validSamples > 0 ? Math.min(1, totalCurvature / validSamples / 10) : 0.5;
  }

  // 3. Vorticity estimation (simplified - based on wind speed gradient)
  let vorticity = 0;
  if (track.length >= 3) {
    const recentPoints = track.filter(p => p.timeOffsetHours >= currentHour - 6 && p.timeOffsetHours <= currentHour);
    if (recentPoints.length >= 2) {
      const first = recentPoints[0];
      const last = recentPoints[recentPoints.length - 1];
      const dist = getDistanceKm(first.lat, first.lng, last.lat, last.lng);
      const windChange = last.windSpeedKmh - first.windSpeedKmh;
      vorticity = dist > 0 ? windChange / dist : 0;
      // Normalize to roughly -1 to 1 range
      vorticity = Math.max(-1, Math.min(1, vorticity / 50));
    }
  }

  // 4. Sea surface temperature influence (warmer = more intensification potential)
  // 26-27°C = minimum, 28-30° = moderate, 31+° = high intensification potential
  let seaSurfaceTempInfluence = 0.5;
  if (seaSurfaceTempC >= 28) {
    seaSurfaceTempInfluence = Math.min(1, (seaSurfaceTempC - 27) / 3);
  }

  // 5. Prediction horizon - based on how consistent the patterns are
  const predictionHorizonHours = Math.max(6, 24 - shearSamples * 3);

  // 6. Predicted intensity change
  let predictedIntensityChange: 'weakening' | 'stable' | 'intensifying' = 'stable';
  const intensityFactors = [
    convergenceIndex > 0.6 ? 1 : 0,
    seaSurfaceTempInfluence > 0.7 ? 1 : 0,
    windShearKmh < 5 ? 1 : 0, // Low shear = good for intensification
  ];
  const intensityScore = intensityFactors.filter(Boolean).length;
  if (intensityScore >= 2) {
    predictedIntensityChange = 'intensifying';
  } else if (intensityScore === 0) {
    predictedIntensityChange = 'weakening';
  }

  // 7. Recommended action
  let recommendedAction: 'monitor' | 'prepare' | 'urgent_prepare' = 'monitor';
  if (predictedIntensityChange === 'intensifying' && convergenceIndex > 0.7) {
    recommendedAction = 'urgent_prepare';
  } else if (predictedIntensityChange === 'intensifying' || seaSurfaceTempInfluence > 0.8) {
    recommendedAction = 'prepare';
  }

  return {
    windShearKmh,
    convergenceIndex,
    vorticity,
    seaSurfaceTempInfluence,
    predictionHorizonHours,
    predictedIntensityChange,
    recommendedAction
  };
}

export function runCycloneSimulation(scenario: CycloneScenario, state: SimulationState): EvaluatedSimulation {
  const activePoint = interpolateTrackPoint(
    scenario.track, 
    state.currentHourOffset, 
    state.categoryMultiplier, 
    state.tideAddonMeters
  );

  let totalExposedPop = 0;
  let totalKutchaRisk = 0;

  // 1. Evaluate Wards
  const evaluatedWards: CoastalWard[] = scenario.wards.map(ward => {
    const distToStorm = getDistanceKm(activePoint.lat, activePoint.lng, ward.lat, ward.lng);
    
    // Wind attenuation from storm core
    const windFactor = Math.max(0.3, Math.exp(-distToStorm / (activePoint.radiusMaxWindKm * 2.2)));
    const localWindKmh = activePoint.windSpeedKmh * windFactor;

    // Coastal surge inland penetration decay
    const surgeDecay = Math.exp(-0.35 * Math.max(0, ward.distToCoastKm));
    const potentialSurge = activePoint.estimatedSurgeHeightM * surgeDecay;
    const surgeDepth = Math.max(0, Number((potentialSurge - ward.avgElevationM).toFixed(2)));
    const isInundated = surgeDepth > 0.2;

    // Structural Vulnerability Index (SVI) calculation
    // Combines housing vulnerability, wind stress, surge flooding, and distance to coast
    const roofVulnerabilityScore = (ward.kutchaHousesPct * 1.0) + (ward.semiPuccaPct * 0.45);
    const windStressScore = Math.min(100, (localWindKmh / 220) * 100);
    const surgeStressScore = Math.min(100, (surgeDepth / 3.0) * 100);
    const elevationRiskScore = Math.max(0, (5 - ward.avgElevationM) * 15);

    const svi = Math.round(
      0.35 * roofVulnerabilityScore +
      0.25 * surgeStressScore +
      0.25 * windStressScore +
      0.15 * elevationRiskScore
    );

    const boundedSVI = Math.min(100, Math.max(10, svi));

    let evacStatus: CoastalWard['evacuationStatus'] = 'Safe';
    if (surgeDepth > 1.2 || (boundedSVI > 65 && localWindKmh > 130)) {
      evacStatus = 'Urgent Evacuate';
      totalExposedPop += ward.population;
      totalKutchaRisk += Math.round(ward.population * (ward.kutchaHousesPct / 100));
    } else if (surgeDepth > 0.3 || boundedSVI > 45) {
      evacStatus = 'Advisory';
      totalExposedPop += Math.round(ward.population * 0.4);
      totalKutchaRisk += Math.round(ward.population * 0.4 * (ward.kutchaHousesPct / 100));
    }

    return {
      ...ward,
      vulnerabilityScore: boundedSVI,
      isInundated,
      surgeDepthM: surgeDepth,
      evacuationStatus: evacStatus
    };
  });

  // 2. Evaluate Critical Assets
  let floodedAssetsCount = 0;
  const evaluatedAssets: CriticalAsset[] = scenario.assets.map(asset => {
    // Find parent ward
    const parentWard = evaluatedWards.find(w => w.id === asset.wardId);
    const surgeAtAsset = parentWard ? (parentWard.surgeDepthM || 0) : 0;
    const isFlooded = surgeAtAsset > 0.3 || (asset.elevationM < activePoint.estimatedSurgeHeightM * 0.8 && getDistanceKm(activePoint.lat, activePoint.lng, asset.lat, asset.lng) < 60);

    let riskLevel: CriticalAsset['riskLevel'] = 'Low';
    if (isFlooded) {
      floodedAssetsCount++;
      riskLevel = asset.backupPower ? 'High' : 'Critical';
    } else if (parentWard && parentWard.vulnerabilityScore && parentWard.vulnerabilityScore > 60) {
      riskLevel = 'Moderate';
    }

    return {
      ...asset,
      isFlooded,
      riskLevel
    };
  });

  // 3. Evaluate Evacuation Routes
  let submergedRoutesCount = 0;
  const evaluatedRoutes: EvacuationRoute[] = scenario.routes.map(route => {
    const isUnderSurge = route.elevationMinM < (activePoint.estimatedSurgeHeightM * 0.85);
    let status: EvacuationRoute['status'] = 'Clear';
    let safeForVehicles = true;

    if (isUnderSurge && state.currentHourOffset >= -6 && state.currentHourOffset <= 6) {
      status = 'Submerged';
      safeForVehicles = false;
      submergedRoutesCount++;
    } else if (route.elevationMinM < 2.5 && state.currentHourOffset >= -10) {
      status = 'Caution';
    }

    return {
      ...route,
      status,
      safeForVehicles
    };
  });

  // 4. Evaluate Shelters and capacities
  let totalShelterCapacity = 0;
  let totalShelterOccupancy = 0;
  const evaluatedShelters: Shelter[] = scenario.shelters.map(shelter => {
    totalShelterCapacity += shelter.capacity;
    
    // As landfall draws closer, occupancy surges
    const hoursToLandfall = Math.abs(state.currentHourOffset);
    let occupancyMultiplier = 1.0;
    if (hoursToLandfall < 6) {
      occupancyMultiplier = 1.45;
    } else if (hoursToLandfall < 12) {
      occupancyMultiplier = 1.2;
    }

    const projectedOccupancy = Math.min(shelter.capacity, Math.round(shelter.currentOccupancy * occupancyMultiplier));
    totalShelterOccupancy += projectedOccupancy;

    const occupancyRate = projectedOccupancy / shelter.capacity;
    let status: Shelter['status'] = 'Ready';
    if (occupancyRate >= 0.95) {
      status = 'Near Capacity';
    } else if (occupancyRate >= 0.6) {
      status = 'Moderate';
    }

    return {
      ...shelter,
      currentOccupancy: projectedOccupancy,
      status
    };
  });

  // 5. Compute Relief Logistics (Sphere Standards)
  const logistics: ReliefLogistics = {
    potableWaterLitersPerDay: Math.round(totalExposedPop * 3.5),
    dryRationPackets: Math.round(totalExposedPop * 1.5),
    babyNutritionUnits: Math.round(totalExposedPop * 0.08),
    ndrfRescueBoats: Math.max(4, Math.ceil(totalExposedPop / 1800)),
    dewateringPumps: Math.max(6, Math.ceil(floodedAssetsCount * 2 + totalExposedPop / 3500)),
    mobileDieselGenerators: Math.max(5, floodedAssetsCount + 3),
    emergencyMedicalKits: Math.max(10, Math.ceil(totalExposedPop / 1200))
  };

  const shelterUtilizationPct = totalShelterCapacity > 0 
    ? Math.round((totalShelterOccupancy / totalShelterCapacity) * 100) 
    : 0;

  return {
    activePoint,
    totalExposedPopulation: totalExposedPop,
    totalKutchaRoofRiskCount: totalKutchaRisk,
    floodedAssetsCount,
    submergedRoutesCount,
    shelterUtilizationPct,
    evaluatedWards,
    evaluatedAssets,
    evaluatedRoutes,
    evaluatedShelters,
    logistics,
    peakSurgeWaterLevelM: activePoint.estimatedSurgeHeightM
  };
}

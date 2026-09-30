import { CycloneScenario } from '../types/cyclone';
import { EvaluatedSimulation } from '../utils/simulationEngine';

const NVIDIA_API_KEY = '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';
const NVIDIA_MODEL = 'meta-llama/llama-3.1-8b-instruct';

export interface CopilotResponse {
  reply: string;
  actionPoints: string[];
}

export async function queryNvidiaCopilot(
  userQuery: string,
  scenario: CycloneScenario,
  evaluated: EvaluatedSimulation
): Promise<CopilotResponse> {
  const {
    activePoint,
    evaluatedWards,
    evaluatedAssets,
    evaluatedRoutes,
    evaluatedShelters,
    totalExposedPopulation,
    totalKutchaRoofRiskCount,
    shelterUtilizationPct
  } = evaluated;

  const criticalWards = evaluatedWards.filter(w => (w.vulnerabilityScore || 0) > 60).map(w => `${w.name} (SVI: ${w.vulnerabilityScore}, Surge: +${w.surgeDepthM || 0}m)`);
  const floodedAssets = evaluatedAssets.filter(a => a.isFlooded).map(a => `${a.name} (${a.type}, Elev: ${a.elevationM}m)`);
  const submergedRoutes = evaluatedRoutes.filter(r => r.status === 'Submerged').map(r => r.name);
  const crowdedShelters = evaluatedShelters.filter(s => (s.currentOccupancy / s.capacity) > 0.85).map(s => `${s.name} (${s.currentOccupancy}/${s.capacity})`);

  const systemPrompt = `You are CyclonePulse AI, an advanced Incident Command Tactical Copilot.
You are actively analyzing a live cyclone simulation.

LIVE SIMULATION METRICS:
- Scenario: ${scenario.name} (${scenario.region})
- Storm Category: ${activePoint.category}
- Current Wind Speed: ${activePoint.windSpeedKmh} km/h (${activePoint.windSpeedKts} knots)
- Central Barometric Pressure: ${activePoint.centralPressureHpa} hPa
- Peak Storm Surge Water Level: +${activePoint.estimatedSurgeHeightM} meters above MSL
- Total Exposed Population: ${totalExposedPopulation.toLocaleString()}
- Kutcha Dwellings at High Roof Failure Risk: ${totalKutchaRoofRiskCount.toLocaleString()}
- Multi-Purpose Shelter Utilization: ${shelterUtilizationPct}%
- Wards with High Vulnerability: ${criticalWards.join('; ') || 'None critical yet'}
- Compromised/Flooded Critical Infrastructure: ${floodedAssets.join('; ') || 'None flooded'}
- Submerged Evacuation Corridors: ${submergedRoutes.join('; ') || 'All corridors currently passable'}
- Near Capacity Shelters: ${crowdedShelters.join('; ') || 'All shelters have spare capacity'}

TASK:
Provide an authoritative, concise, and tactical response to the Incident Commander's query.
Cite specific numbers from the live metrics.
At the end of your response, provide 2 to 4 bullet points formatted with "• " summarizing concrete, immediate life-safety action items.`;

  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.3,
        max_tokens: 450
      })
    });

    if (!res.ok) {
      throw new Error(`NVIDIA NIM API responded with ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content || '';

    // Extract bullet points from response
    const lines = content.split('\n');
    const actionPoints: string[] = [];
    const textLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        actionPoints.push(trimmed.replace(/^[•\-\d\.]\s*/, ''));
      } else if (trimmed) {
        textLines.push(trimmed);
      }
    }

    return {
      reply: textLines.join(' ') || content,
      actionPoints: actionPoints.length > 0 ? actionPoints : [
        `Pre-deploy rescue boats to ${criticalWards[0] || 'coastal wards'}.`,
        `Maintain continuous VHF radio broadcast on all emergency channels.`
      ]
    };
  } catch (err) {
    console.warn('NVIDIA NIM API call fallback:', err);
    // Fallback if network blocked or rate limited
    return fallbackResponse(userQuery, scenario, evaluated);
  }
}

function fallbackResponse(
  userQuery: string,
  scenario: CycloneScenario,
  evaluated: EvaluatedSimulation
): CopilotResponse {
  const { activePoint, evaluatedWards, evaluatedAssets, evaluatedRoutes, logistics, totalExposedPopulation } = evaluated;
  const flooded = evaluatedAssets.filter(a => a.isFlooded);
  const lower = userQuery.toLowerCase();

  if (lower.includes('hospital') || lower.includes('substation') || lower.includes('grid')) {
    return {
      reply: `Analysis of critical assets under current ${activePoint.windSpeedKmh} km/h wind and +${activePoint.estimatedSurgeHeightM}m surge shows ${flooded.length} assets compromised or in high flood hazard zones.`,
      actionPoints: flooded.length > 0 ? [
        `CRITICAL: ${flooded.map(a => a.name).join(', ')} in flood zone. Switch to elevated emergency generators immediately.`,
        `Deploy portable dewatering pumps (${logistics.dewateringPumps} allocated) to prevent substation failure.`
      ] : [
        'All primary substations currently remain above the active tidal surge contour.',
        'Pre-position mobile diesel generators at coastal clinics.'
      ]
    };
  }

  return {
    reply: `Tactical assessment for ${scenario.name}: Storm eye approaching with ${activePoint.windSpeedKmh} km/h sustained winds and peak surge of +${activePoint.estimatedSurgeHeightM}m. Total exposed population is ${totalExposedPopulation.toLocaleString()}.`,
    actionPoints: [
      `Enforce mandatory evacuation in wards with SVI > 60.`,
      `Verify that ${logistics.ndrfRescueBoats} NDRF inflatable rescue boats are pre-positioned along estuarine corridors.`,
      `Stockpile ${(logistics.potableWaterLitersPerDay / 1000).toFixed(1)}k liters/day of clean drinking water.`
    ]
  };
}

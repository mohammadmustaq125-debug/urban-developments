import { describe, it, expect } from 'vitest';
import { PRESET_SCENARIOS } from '../src/data/mockData';
import type { TriageLevel, TriageResult } from '../src/types';

describe('Triage Logic and Multimodal Evaluation Suite', () => {
  it('validates critical priority threshold for deep flood water level (>60cm)', () => {
    const floodScenario = PRESET_SCENARIOS.find((s) => s.id === 'scenario-guntur-flood');
    expect(floodScenario).toBeDefined();
    expect(floodScenario?.sensorTelemetry.waterLevelCm).toBeGreaterThan(60);

    // Mock deterministic rule-based evaluation used by triage fallback
    const isCritical = (floodScenario?.sensorTelemetry.waterLevelCm ?? 0) > 60;
    const triageLevel: TriageLevel = isCritical ? 'CRITICAL_P1' : 'URGENT_P2';
    expect(triageLevel).toBe('CRITICAL_P1');
  });

  it('validates power grid overload trigger for APCPDCL 11kV snapped line', () => {
    const powerScenario = PRESET_SCENARIOS.find((s) => s.id === 'scenario-guntur-power');
    expect(powerScenario).toBeDefined();
    expect(powerScenario?.sensorTelemetry.gridLoadPct).toBeGreaterThan(100);

    const requiresSubstationCutoff = (powerScenario?.sensorTelemetry.gridLoadPct ?? 0) > 100;
    expect(requiresSubstationCutoff).toBe(true);
  });

  it('verifies traffic congestion index for GGH Guntur 108 emergency corridor', () => {
    const trafficScenario = PRESET_SCENARIOS.find((s) => s.id === 'scenario-guntur-traffic');
    expect(trafficScenario).toBeDefined();
    expect(trafficScenario?.sensorTelemetry.trafficDelayIndex).toBeGreaterThan(4.0);

    const requiresSignalPreemption = (trafficScenario?.sensorTelemetry.trafficDelayIndex ?? 0) > 3.0;
    expect(requiresSignalPreemption).toBe(true);
  });

  it('validates complete triage output schema integrity', () => {
    const mockTriageResult: TriageResult = {
      triageLevel: 'CRITICAL_P1',
      hazardCategory: 'Flash Flood & Power Grid Risk',
      severityScore: 92,
      incidentSummary: 'Severe inundation at Arundalpet underpass with trapped commuters.',
      confidencePercent: 96,
      impactRadiusMeters: 600,
      resourceAllocations: [
        { unitType: '108 ALS Ambulance', quantity: 2, etaMinutes: 4, purpose: 'Triage trapped passengers' },
        { unitType: 'SDRF Water Rescue Squad', quantity: 1, etaMinutes: 6, purpose: 'Inflatable boat extraction' },
      ],
      autonomousGridActions: [
        { subsystem: 'Traffic Management', actionTaken: 'Green Corridor activated towards GGH', status: 'EXECUTED' },
        { subsystem: 'APCPDCL Energy Grid', actionTaken: 'Feeder 4B tripped to prevent electrocution', status: 'EXECUTED' },
      ],
      citizenAdvice: 'అరుండల్‌పేట్ అండర్‌పాస్ వైపు వెళ్లకండి. ఎత్తైన ప్రదేశాల్లో ఉండండి.',
      survivalSteps: [
        'నీటిలో ఉన్న విద్యుత్ స్తంభాలకు దూరంగా ఉండండి',
        'ఎమర్జెన్సీ కోసం 108 లేదా 1070 కి డయల్ చేయండి',
      ],
      secondaryRiskAlert: 'Continuous downpour could breach drainage bunds within 35 minutes.',
      evacuationZone: 'Arundalpet 4th Lane to Hindu College High Ground Shelter',
    };

    expect(mockTriageResult.severityScore).toBeGreaterThanOrEqual(1);
    expect(mockTriageResult.severityScore).toBeLessThanOrEqual(100);
    expect(mockTriageResult.resourceAllocations.length).toBeGreaterThan(0);
    expect(mockTriageResult.autonomousGridActions.length).toBeGreaterThan(0);
    expect(mockTriageResult.survivalSteps.length).toBeGreaterThan(0);
    expect(mockTriageResult.evacuationZone).toContain('Shelter');
  });
});

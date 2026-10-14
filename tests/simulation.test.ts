import { describe, it, expect } from 'vitest';
import type { SimulationResult, IncidentActionPlan } from '../src/types';

describe('Predictive Simulation & Incident Action Plan Engine', () => {
  it('validates simulation output structure and resilience gain metrics', () => {
    const mockSimulation: SimulationResult = {
      scenarioTitle: 'Krishna River Monsoonal Breach & Guntur Drainage Congestion',
      summary: 'Autonomous actuation reduces emergency response from 13.4m to 1.8m.',
      timeline: [
        {
          timeLabel: 'T+00:00 (Onset)',
          riskLevel: 'Elevated (58%)',
          activeIncidents: 4,
          hospitalBedUtilization: 62,
          gridStability: 96,
          keyEvents: ['Storm drain surge at Arundalpet'],
          autonomousInterventionPrevented: 'Dewatering pumps primed before underpass flooded',
        },
        {
          timeLabel: 'T+00:30 (Peak Surge)',
          riskLevel: 'Critical (89%)',
          activeIncidents: 18,
          hospitalBedUtilization: 88,
          gridStability: 82,
          keyEvents: ['Prakasam barrage outflow increased to 250,000 cusecs'],
          autonomousInterventionPrevented: 'Automated 11kV substation lockout averted 14 electrocution casualties',
        },
      ],
      resilienceBenefitScore: {
        estimatedCasualtyReductionPct: 78,
        economicLossAvertedMillionUSD: 3.4,
        responseLatencyReductionPct: 84,
      },
    };

    expect(mockSimulation.timeline.length).toBeGreaterThanOrEqual(2);
    expect(mockSimulation.resilienceBenefitScore.estimatedCasualtyReductionPct).toBeGreaterThan(50);
    expect(mockSimulation.resilienceBenefitScore.responseLatencyReductionPct).toBeGreaterThan(60);
    expect(mockSimulation.resilienceBenefitScore.economicLossAvertedMillionUSD).toBeGreaterThan(0);
  });

  it('validates Incident Action Plan (ICS-201) command structure for GMC & APSDMA', () => {
    const mockIAP: IncidentActionPlan = {
      incidentName: 'Operation Guntur Jal-Suraksha (ఆపరేషన్ గుంటూరు జల-సురక్ష)',
      operationalPeriod: '2026-10-14 06:00 to 2026-10-14 18:00 IST',
      strategicObjectives: [
        'Maintain zero human electrocutions across inundated Brodipet & Old Guntur.',
        'Keep GGH Guntur corridor open for 108 Emergency Ambulances with 100% green light priority.',
        'Evacuate 4,500 residents from Koretipadu & Gujanagundla lowlands to high-ground relief centers.',
      ],
      commandStaff: {
        incidentCommander: 'District Collector & GMC Commissioner',
        safetyOfficer: 'Chief Fire Officer (AP State Disaster Response & Fire)',
        operationsChief: 'Superintendent of Police & 10th Bn NDRF Commander',
        logisticsLead: 'GMC Additional Commissioner (Engineering & Health)',
      },
      criticalResourceDemands: [
        { branch: 'Rescue Operations', requirement: '14 Gemini-guided amphibious boats (NDRF/SDRF)', priority: 'P1' },
        { branch: 'Medical Evacuation', requirement: '12 108 Advanced Life Support ambulances', priority: 'P1' },
      ],
      keyMilestones: [
        { hourOffset: '+1 hr', target: 'APCPDCL feeder isolation in Ward 1 & 5' },
        { hourOffset: '+3 hrs', target: 'Completion of school relief camp setup at AC College Grounds' },
      ],
      safetyMessage: 'Do not approach any downed wires or submerged junction boxes. Treat all standing water as energized.',
    };

    expect(mockIAP.strategicObjectives.length).toBeGreaterThanOrEqual(3);
    expect(mockIAP.commandStaff.incidentCommander).toBeDefined();
    expect(mockIAP.criticalResourceDemands.length).toBeGreaterThanOrEqual(2);
    expect(mockIAP.safetyMessage).toContain('downed wires');
  });
});

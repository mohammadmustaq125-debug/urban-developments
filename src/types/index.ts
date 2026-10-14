export type TriageLevel = 'CRITICAL_P1' | 'URGENT_P2' | 'ROUTINE_P3';

export interface ResourceAllocation {
  unitType: string;
  quantity: number;
  etaMinutes: number;
  purpose: string;
}

export interface AutonomousGridAction {
  subsystem: string;
  actionTaken: string;
  status: 'EXECUTED' | 'IN_PROGRESS';
}

export interface TriageResult {
  triageLevel: TriageLevel;
  hazardCategory: string;
  severityScore: number; // 1-100
  incidentSummary: string;
  confidencePercent: number;
  impactRadiusMeters: number;
  resourceAllocations: ResourceAllocation[];
  autonomousGridActions: AutonomousGridAction[];
  citizenAdvice: string;
  survivalSteps: string[];
  secondaryRiskAlert: string;
  evacuationZone: string;
}

export interface WardTelemetry {
  id: string;
  name: string;
  code: string;
  riskScore: number; // 0-100
  waterLevelCm: number;
  waterThresholdCm: number;
  gridLoadPct: number;
  aqi: number;
  trafficDelayIndex: number; // 1.0 = normal, 3.5 = paralyzed
  population: number;
  hospitalsCount: number;
  shelterCapacityPct: number;
  status: 'nominal' | 'advisory' | 'warning' | 'critical';
  x: number;
  y: number;
}

export interface SimulationTimeStep {
  timeLabel: string;
  riskLevel: string;
  activeIncidents: number;
  hospitalBedUtilization: number;
  gridStability: number;
  keyEvents: string[];
  autonomousInterventionPrevented: string;
}

export interface SimulationResult {
  scenarioTitle: string;
  summary: string;
  timeline: SimulationTimeStep[];
  resilienceBenefitScore: {
    estimatedCasualtyReductionPct: number;
    economicLossAvertedMillionUSD: number;
    responseLatencyReductionPct: number;
  };
}

export interface IncidentActionPlan {
  incidentName: string;
  operationalPeriod: string;
  strategicObjectives: string[];
  commandStaff: {
    incidentCommander: string;
    safetyOfficer: string;
    operationsChief: string;
    logisticsLead: string;
  };
  criticalResourceDemands: {
    branch: string;
    requirement: string;
    priority: string;
  }[];
  keyMilestones: {
    hourOffset: string;
    target: string;
  }[];
  safetyMessage: string;
}

import { WardTelemetry } from '../types';

export const INITIAL_WARDS: WardTelemetry[] = [
  {
    id: 'gmc-1',
    name: 'Brodipet & Arundalpet Commercial Zone',
    code: 'GMC-01',
    riskScore: 78,
    waterLevelCm: 68,
    waterThresholdCm: 50,
    gridLoadPct: 92,
    aqi: 112,
    trafficDelayIndex: 3.4,
    population: 260000,
    hospitalsCount: 6,
    shelterCapacityPct: 75,
    status: 'critical',
    x: 35,
    y: 38,
  },
  {
    id: 'gmc-2',
    name: 'GGH Guntur & District Collectorate Hub',
    code: 'GMC-02',
    riskScore: 88,
    waterLevelCm: 74,
    waterThresholdCm: 55,
    gridLoadPct: 96,
    aqi: 88,
    trafficDelayIndex: 4.2,
    population: 180000,
    hospitalsCount: 8,
    shelterCapacityPct: 90,
    status: 'critical',
    x: 48,
    y: 42,
  },
  {
    id: 'gmc-3',
    name: 'Guntur Mirchi Yard & Logistics Terminal',
    code: 'GMC-03',
    riskScore: 82,
    waterLevelCm: 32,
    waterThresholdCm: 60,
    gridLoadPct: 88,
    aqi: 195,
    trafficDelayIndex: 3.8,
    population: 145000,
    hospitalsCount: 2,
    shelterCapacityPct: 55,
    status: 'warning',
    x: 22,
    y: 65,
  },
  {
    id: 'gmc-4',
    name: 'Koretipadu & Gujanagundla Lowlands',
    code: 'GMC-04',
    riskScore: 94,
    waterLevelCm: 86,
    waterThresholdCm: 50,
    gridLoadPct: 94,
    aqi: 74,
    trafficDelayIndex: 3.6,
    population: 215000,
    hospitalsCount: 3,
    shelterCapacityPct: 95,
    status: 'critical',
    x: 65,
    y: 55,
  },
  {
    id: 'gmc-5',
    name: 'Old Guntur & Railway Underpass Basin',
    code: 'GMC-05',
    riskScore: 89,
    waterLevelCm: 92,
    waterThresholdCm: 45,
    gridLoadPct: 85,
    aqi: 98,
    trafficDelayIndex: 4.5,
    population: 310000,
    hospitalsCount: 4,
    shelterCapacityPct: 84,
    status: 'critical',
    x: 42,
    y: 72,
  },
  {
    id: 'gmc-6',
    name: 'Lakshmipuram & Amaravati Road Arterial',
    code: 'GMC-06',
    riskScore: 42,
    waterLevelCm: 18,
    waterThresholdCm: 55,
    gridLoadPct: 74,
    aqi: 65,
    trafficDelayIndex: 2.1,
    population: 195000,
    hospitalsCount: 5,
    shelterCapacityPct: 40,
    status: 'nominal',
    x: 58,
    y: 24,
  },
];

export interface PresetScenario {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  imagePath: string;
  sensorTelemetry: {
    waterLevelCm: number;
    gridLoadPct: number;
    aqi: number;
    trafficDelayIndex: number;
    ambientTempC: number;
    windSpeedKmh: number;
  };
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'scenario-guntur-flood',
    title: 'Arundalpet Railway Underpass & Storm Drain Overflow (అరుండల్‌పేట్ అండర్‌పాస్ వరద)',
    category: 'Monsoon Flash Flooding & Stormwater Inundation',
    location: 'GMC-01: Arundalpet 4th Lane & Railway Station Underpass, Guntur',
    description: 'Heavy 110mm cloudburst caused massive stormwater storm-drain (Naala) overflow. Arundalpet underpass submerged under 86cm water. 3 RTC city buses and 8 auto-rickshaws trapped with 40+ commuters. Nearby APCPDCL transformer box sparking in water.',
    imagePath: '/src/assets/images/incident_urban_flood_1791955710622.jpg',
    sensorTelemetry: {
      waterLevelCm: 86,
      gridLoadPct: 98,
      aqi: 68,
      trafficDelayIndex: 4.6,
      ambientTempC: 27,
      windSpeedKmh: 48,
    },
  },
  {
    id: 'scenario-guntur-power',
    title: 'APCPDCL 11kV Feeder Line Snapped in Waterlogged Brodipet (విద్యుత్ తీగ తెగిపడటం)',
    category: 'Electrical Grid Hazard & High-Voltage Electrocution Risk',
    location: 'GMC-01: Brodipet 6/2 Cross Road Substation, Guntur',
    description: 'Storm winds caused an 11kV high-tension feeder cable to snap directly into 30cm standing floodwater outside commercial complex. Intense electrical arcing and explosive popping. Extreme electrocution threat to pedestrians and shopkeepers.',
    imagePath: '/src/assets/images/incident_power_hazmat_1791955711655.jpg',
    sensorTelemetry: {
      waterLevelCm: 32,
      gridLoadPct: 148,
      aqi: 142,
      trafficDelayIndex: 2.8,
      ambientTempC: 32,
      windSpeedKmh: 54,
    },
  },
  {
    id: 'scenario-guntur-traffic',
    title: 'GGH Guntur 108 Emergency Ambulance Blockade on Collectorate Road (108 అంబులెన్స్ ట్రాఫిక్ జామ్)',
    category: 'Critical Healthcare Transit & 108 Ambulance Congestion',
    location: 'GMC-02: GGH Guntur Hospital Gate & Collectorate Flyover Junction',
    description: 'Severe traffic gridlock between Collectorate and Guntur Government General Hospital (GGH). 2 Advanced Life Support 108 Ambulances carrying critical cardiac and trauma patients from Chilakaluripet highway trapped motionless at red signal for 12 minutes.',
    imagePath: '/src/assets/images/incident_traffic_gridlock_1791955712435.jpg',
    sensorTelemetry: {
      waterLevelCm: 14,
      gridLoadPct: 82,
      aqi: 95,
      trafficDelayIndex: 4.8,
      ambientTempC: 34,
      windSpeedKmh: 14,
    },
  },
];

export const JURY_SUGGESTED_QUESTIONS = [
  'How does Resilify AI assist Guntur Municipal Corporation (GMC) and APSDMA during Krishna river flash floods?',
  'How does the system autonomously communicate with 10th Battalion NDRF (Acharya Nagarjuna University, Guntur) and 108 Ambulances?',
  'How does the multilingual Gemini core deliver emergency audio in Telugu (తెలుగు) and Hindi (हिंदी) to citizens who cannot read English?',
  'How does autonomous signal preemption prevent fatalities along the GGH Guntur Government Hospital arterial corridor?',
  'What happens if APCPDCL power lines fail or cellular towers experience blackout during a Bay of Bengal cyclone?',
];

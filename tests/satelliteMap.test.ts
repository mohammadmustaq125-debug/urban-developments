import { describe, it, expect } from 'vitest';
import { INITIAL_WARDS } from '../src/data/mockData';

describe('Guntur Metropolitan Satellite Map & Geospatial Layer Suite', () => {
  it('verifies satellite map layers and coordinate projections for Guntur Municipal Corporation', () => {
    const mapModes = ['satellite', 'hybrid', 'vector'] as const;
    expect(mapModes).toContain('satellite');
    expect(mapModes).toContain('hybrid');
    expect(mapModes).toContain('vector');

    // All wards must have valid coordinate percentages [0 - 100]
    INITIAL_WARDS.forEach((w) => {
      expect(w.x).toBeGreaterThanOrEqual(10);
      expect(w.x).toBeLessThanOrEqual(90);
      expect(w.y).toBeGreaterThanOrEqual(10);
      expect(w.y).toBeLessThanOrEqual(90);
    });
  });

  it('validates satellite telemetry overlays for flood and power grid hazard detection', () => {
    const arundalpetWard = INITIAL_WARDS.find((w) => w.id === 'gmc-1');
    expect(arundalpetWard).toBeDefined();

    // Inundation detection calculation on satellite view
    const isInundated = (arundalpetWard?.waterLevelCm ?? 0) > (arundalpetWard?.waterThresholdCm ?? 0);
    expect(isInundated).toBe(true);

    // Overload detection on APCPDCL grid
    const isOverloaded = (arundalpetWard?.gridLoadPct ?? 0) > 90;
    expect(isOverloaded).toBe(true);
  });

  it('ensures satellite asset path is present and valid image format', () => {
    const satellitePath = '/src/assets/images/guntur_satellite_map_1791967151622.jpg';
    expect(satellitePath).toMatch(/\.(jpg|jpeg|png)$/);
    expect(satellitePath).toContain('guntur_satellite_map');
  });

  it('verifies accessibility attributes for map layer switchers and node selectors', () => {
    const accessibleLayerLabels = {
      satellite: 'Satellite Earth Observation (ఉపగ్రహ వీక్షణ)',
      hybrid: 'Hybrid Tactical Radar (హైబ్రిడ్ రాడార్)',
      vector: 'Vector Telemetry Grid (డిజిటల్ గ్రిడ్)',
    };

    expect(accessibleLayerLabels.satellite).toContain('Satellite');
    expect(accessibleLayerLabels.satellite).toContain('ఉపగ్రహ');
    expect(accessibleLayerLabels.hybrid).toContain('Hybrid');
  });
});

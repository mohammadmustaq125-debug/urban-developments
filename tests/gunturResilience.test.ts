import { describe, it, expect } from 'vitest';
import { INITIAL_WARDS } from '../src/data/mockData';

describe('Guntur Smart City Municipal Resilience Grid Suite', () => {
  it('contains all core municipal zones for Guntur Municipal Corporation', () => {
    expect(INITIAL_WARDS.length).toBeGreaterThanOrEqual(6);
    const wardCodes = INITIAL_WARDS.map((w) => w.code);
    expect(wardCodes).toContain('GMC-01');
    expect(wardCodes).toContain('GMC-02');
    expect(wardCodes).toContain('GMC-03');
    expect(wardCodes).toContain('GMC-04');
    expect(wardCodes).toContain('GMC-05');
  });

  it('validates critical ward telemetry thresholds', () => {
    const koretipaduWard = INITIAL_WARDS.find((w) => w.id === 'gmc-4');
    expect(koretipaduWard).toBeDefined();
    // Koretipadu is a known low-lying flood-prone zone in Guntur
    expect(koretipaduWard?.waterLevelCm).toBeGreaterThan(koretipaduWard?.waterThresholdCm ?? 0);
    expect(koretipaduWard?.status).toBe('critical');
    expect(koretipaduWard?.riskScore).toBeGreaterThanOrEqual(90);
  });

  it('verifies hospital protection index for GGH Guntur Hub', () => {
    const gghWard = INITIAL_WARDS.find((w) => w.id === 'gmc-2');
    expect(gghWard).toBeDefined();
    expect(gghWard?.hospitalsCount).toBeGreaterThanOrEqual(6);
    expect(gghWard?.population).toBeGreaterThan(100000);
  });

  it('ensures each ward has valid 2D coordinates for SVG municipal grid rendering', () => {
    INITIAL_WARDS.forEach((ward) => {
      expect(ward.x).toBeGreaterThanOrEqual(0);
      expect(ward.x).toBeLessThanOrEqual(100);
      expect(ward.y).toBeGreaterThanOrEqual(0);
      expect(ward.y).toBeLessThanOrEqual(100);
      expect(ward.riskScore).toBeGreaterThanOrEqual(0);
      expect(ward.riskScore).toBeLessThanOrEqual(100);
    });
  });
});

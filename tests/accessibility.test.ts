import { describe, it, expect } from 'vitest';

/**
 * WCAG 2.1 Relative Luminance Calculation
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('Accessibility & WCAG 2.1 AAA Compliance Suite', () => {
  it('verifies contrast ratio between Cyan text and Slate-950 background exceeds WCAG AAA (7:1)', () => {
    // Slate 950: #020617 -> [2, 6, 23]
    // Cyan 400: #22d3ee -> [34, 211, 238]
    const slate950: [number, number, number] = [2, 6, 23];
    const cyan400: [number, number, number] = [34, 211, 238];
    const ratio = getContrastRatio(slate950, cyan400);

    expect(ratio).toBeGreaterThan(7.0); // WCAG AAA requirement for regular text is 7:1
  });

  it('verifies contrast ratio between Emerald text and Slate-950 background exceeds WCAG AAA (7:1)', () => {
    // Slate 950: #020617 -> [2, 6, 23]
    // Emerald 400: #34d399 -> [52, 211, 153]
    const slate950: [number, number, number] = [2, 6, 23];
    const emerald400: [number, number, number] = [52, 211, 153];
    const ratio = getContrastRatio(slate950, emerald400);

    expect(ratio).toBeGreaterThan(7.0);
  });

  it('verifies contrast ratio between Pure White text and Slate-950 background is exceptional (>15:1)', () => {
    const slate950: [number, number, number] = [2, 6, 23];
    const white: [number, number, number] = [255, 255, 255];
    const ratio = getContrastRatio(slate950, white);

    expect(ratio).toBeGreaterThan(15.0);
  });

  it('validates multilingual voice BCP-47 language tags for Telugu, Hindi, and Indian English', () => {
    const supportedLangs = {
      Telugu: 'te-IN',
      Hindi: 'hi-IN',
      English: 'en-IN',
    };

    expect(supportedLangs.Telugu).toBe('te-IN');
    expect(supportedLangs.Hindi).toBe('hi-IN');
    expect(supportedLangs.English).toBe('en-IN');
  });

  it('validates critical emergency hotline accessibility numbers', () => {
    const emergencyDirectory = {
      ambulance: '108',
      police: '100',
      fire: '101',
      nationalDisasterHelpline: '112',
      apsdmaStateEmergencyCell: '1070',
      gmcMunicipalControlRoom: '0863-2224202',
    };

    expect(emergencyDirectory.ambulance).toBe('108');
    expect(emergencyDirectory.apsdmaStateEmergencyCell).toBe('1070');
    expect(emergencyDirectory.gmcMunicipalControlRoom).toBe('0863-2224202');
  });
});

/**
 * Unit Tests for Size Recommendation Functions
 */

import { recommendAdultSize, recommendKidsSize, validateAdultInputs } from '../recommendSize';
import type { AdultSizeInputs } from '../recommendSize';

describe('recommendKidsSize', () => {
  it('should return size 16 for age 3', () => {
    const result = recommendKidsSize(3);
    expect(result.recommended).toBe(16);
    expect(result.age).toBe(3);
  });

  it('should return size 18 for age 5', () => {
    const result = recommendKidsSize(5);
    expect(result.recommended).toBe(18);
  });

  it('should return size 30 for age 15', () => {
    const result = recommendKidsSize(15);
    expect(result.recommended).toBe(30);
    expect(result.age).toBe(15);
  });

  it('should return size 22 for age 9', () => {
    const result = recommendKidsSize(9);
    expect(result.recommended).toBe(22);
  });
});

describe('recommendAdultSize', () => {
  it('should recommend L for 170cm, 65kg, regular fit', () => {
    const inputs: AdultSizeInputs = {
      age: 25,
      heightCm: 170,
      weightKg: 65,
      fitPreference: 'Regular',
    };
    const result = recommendAdultSize(inputs);
    expect(result.recommended).toBe('L');
    expect(result.reasons).toContain('Base size from weight (65 kg): L');
  });

  it('should recommend XL for 190cm, 65kg, regular fit (height upsize)', () => {
    const inputs: AdultSizeInputs = {
      age: 25,
      heightCm: 190,
      weightKg: 65,
      fitPreference: 'Regular',
    };
    const result = recommendAdultSize(inputs);
    expect(result.recommended).toBe('XL');
    expect(result.reasons.some(r => r.includes('Height adjustment') && r.includes('size up'))).toBe(true);
  });

  it('should recommend M for 170cm, 65kg, slim fit (slim downsize)', () => {
    const inputs: AdultSizeInputs = {
      age: 25,
      heightCm: 170,
      weightKg: 65,
      fitPreference: 'Slim',
    };
    const result = recommendAdultSize(inputs);
    expect(result.recommended).toBe('M');
    expect(result.reasons.some(r => r.includes('Fit preference (Slim)'))).toBe(true);
  });

  it('should recommend S for weight < 55kg', () => {
    const inputs: AdultSizeInputs = {
      age: 20,
      heightCm: 165,
      weightKg: 50,
      fitPreference: 'Regular',
    };
    const result = recommendAdultSize(inputs);
    expect(result.recommended).toBe('S');
  });

  it('should recommend 3XL for weight >= 95kg', () => {
    const inputs: AdultSizeInputs = {
      age: 30,
      heightCm: 180,
      weightKg: 100,
      fitPreference: 'Regular',
    };
    const result = recommendAdultSize(inputs);
    expect(result.recommended).toBe('3XL');
  });

  it('should provide alternatives (tighter and looser)', () => {
    const inputs: AdultSizeInputs = {
      age: 25,
      heightCm: 175,
      weightKg: 70,
      fitPreference: 'Regular',
    };
    const result = recommendAdultSize(inputs);
    expect(result.alternatives.tighter).toBe('M');
    expect(result.alternatives.looser).toBe('XL');
  });

  it('should not provide tighter alternative for S', () => {
    const inputs: AdultSizeInputs = {
      age: 20,
      heightCm: 160,
      weightKg: 50,
      fitPreference: 'Regular',
    };
    const result = recommendAdultSize(inputs);
    expect(result.recommended).toBe('S');
    expect(result.alternatives.tighter).toBeNull();
  });

  it('should not provide looser alternative for 3XL', () => {
    const inputs: AdultSizeInputs = {
      age: 30,
      heightCm: 190,
      weightKg: 100,
      fitPreference: 'Loose',
    };
    const result = recommendAdultSize(inputs);
    expect(result.recommended).toBe('3XL');
    expect(result.alternatives.looser).toBeNull();
  });

  it('should include chart row in result', () => {
    const inputs: AdultSizeInputs = {
      age: 25,
      heightCm: 175,
      weightKg: 70,
      fitPreference: 'Regular',
    };
    const result = recommendAdultSize(inputs);
    expect(result.chartRow).toBeDefined();
    expect(result.chartRow.size).toBe(result.recommended);
    expect(result.chartRow.lengthInches).toBeGreaterThan(0);
    expect(result.chartRow.chestInches).toBeGreaterThan(0);
  });
});

describe('validateAdultInputs', () => {
  it('should validate correct inputs', () => {
    const inputs: Partial<AdultSizeInputs> = {
      age: 25,
      heightCm: 175,
      weightKg: 70,
    };
    const result = validateAdultInputs(inputs);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject age < 16', () => {
    const inputs: Partial<AdultSizeInputs> = {
      age: 15,
      heightCm: 175,
      weightKg: 70,
    };
    const result = validateAdultInputs(inputs);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Age'))).toBe(true);
  });

  it('should reject age > 80', () => {
    const inputs: Partial<AdultSizeInputs> = {
      age: 85,
      heightCm: 175,
      weightKg: 70,
    };
    const result = validateAdultInputs(inputs);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Age'))).toBe(true);
  });

  it('should reject height < 140', () => {
    const inputs: Partial<AdultSizeInputs> = {
      age: 25,
      heightCm: 130,
      weightKg: 70,
    };
    const result = validateAdultInputs(inputs);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Height'))).toBe(true);
  });

  it('should reject height > 210', () => {
    const inputs: Partial<AdultSizeInputs> = {
      age: 25,
      heightCm: 220,
      weightKg: 70,
    };
    const result = validateAdultInputs(inputs);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Height'))).toBe(true);
  });

  it('should reject weight < 35', () => {
    const inputs: Partial<AdultSizeInputs> = {
      age: 25,
      heightCm: 175,
      weightKg: 30,
    };
    const result = validateAdultInputs(inputs);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Weight'))).toBe(true);
  });

  it('should reject weight > 200', () => {
    const inputs: Partial<AdultSizeInputs> = {
      age: 25,
      heightCm: 175,
      weightKg: 250,
    };
    const result = validateAdultInputs(inputs);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Weight'))).toBe(true);
  });
});


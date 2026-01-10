/**
 * Size Recommendation Logic
 * Provides recommendations for adult and kids jersey sizes
 */

import { ADULT_SIZE_CHART, ADULT_SIZES, KIDS_AGE_TO_SIZE, KidsAge } from '@/data/sizeChart';
import type { FitPreference, AdultSize } from '@/data/sizeChart';

export interface AdultSizeInputs {
  age: number;
  heightCm: number;
  weightKg: number;
  fitPreference?: FitPreference;
}

export interface AdultSizeRecommendation {
  recommended: AdultSize;
  alternatives: {
    tighter: AdultSize | null;
    looser: AdultSize | null;
  };
  reasons: string[];
  chartRow: {
    size: string;
    lengthInches: number;
    chestInches: number;
  };
}

export interface KidsSizeRecommendation {
  recommended: number;
  age: KidsAge;
}

/**
 * Get base size from weight
 */
function getBaseSizeFromWeight(weightKg: number): AdultSize {
  if (weightKg < 55) return 'S';
  if (weightKg < 65) return 'M';
  if (weightKg < 75) return 'L';
  if (weightKg < 85) return 'XL';
  if (weightKg < 95) return '2XL';
  return '3XL';
}

/**
 * Get size index for calculations
 */
function getSizeIndex(size: AdultSize): number {
  return ADULT_SIZES.indexOf(size);
}

/**
 * Get size from index
 */
function getSizeFromIndex(index: number): AdultSize {
  const clampedIndex = Math.max(0, Math.min(ADULT_SIZES.length - 1, index));
  return ADULT_SIZES[clampedIndex];
}

/**
 * Recommend adult size based on inputs
 */
export function recommendAdultSize(inputs: AdultSizeInputs): AdultSizeRecommendation {
  const { age, heightCm, weightKg, fitPreference = 'Regular' } = inputs;
  const reasons: string[] = [];

  // Base size from weight
  let baseSize = getBaseSizeFromWeight(weightKg);
  let currentSizeIndex = getSizeIndex(baseSize);
  reasons.push(`Base size from weight (${weightKg} kg): ${baseSize}`);

  // Height adjustment
  if (heightCm < 165) {
    currentSizeIndex = Math.max(0, currentSizeIndex - 1);
    reasons.push(`Height adjustment (${heightCm} cm < 165 cm): size down by 1`);
  } else if (heightCm > 185) {
    currentSizeIndex = Math.min(ADULT_SIZES.length - 1, currentSizeIndex + 1);
    reasons.push(`Height adjustment (${heightCm} cm > 185 cm): size up by 1`);
  }

  // Fit preference adjustment
  if (fitPreference === 'Slim') {
    currentSizeIndex = Math.max(0, currentSizeIndex - 1);
    reasons.push('Fit preference (Slim): size down by 1');
  } else if (fitPreference === 'Loose') {
    currentSizeIndex = Math.min(ADULT_SIZES.length - 1, currentSizeIndex + 1);
    reasons.push('Fit preference (Loose): size up by 1');
  }

  const recommended = getSizeFromIndex(currentSizeIndex);
  const recommendedIndex = getSizeIndex(recommended);

  // Get alternatives
  const tighter = recommendedIndex > 0 ? getSizeFromIndex(recommendedIndex - 1) : null;
  const looser = recommendedIndex < ADULT_SIZES.length - 1 ? getSizeFromIndex(recommendedIndex + 1) : null;

  // Get chart row
  const chartRow = ADULT_SIZE_CHART.find(row => row.size === recommended) || ADULT_SIZE_CHART[0];

  return {
    recommended,
    alternatives: {
      tighter,
      looser,
    },
    reasons,
    chartRow,
  };
}

/**
 * Recommend kids size based on age
 */
export function recommendKidsSize(age: KidsAge): KidsSizeRecommendation {
  const recommended = KIDS_AGE_TO_SIZE[age];
  
  if (!recommended) {
    // Fallback to closest age
    const ages = Object.keys(KIDS_AGE_TO_SIZE).map(Number).sort((a, b) => a - b);
    const closestAge = ages.reduce((prev, curr) => 
      Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
    ) as KidsAge;
    return {
      recommended: KIDS_AGE_TO_SIZE[closestAge],
      age: closestAge,
    };
  }

  return {
    recommended,
    age,
  };
}

/**
 * Validate adult inputs
 */
export function validateAdultInputs(inputs: Partial<AdultSizeInputs>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!inputs.age || inputs.age < 16 || inputs.age > 80) {
    errors.push('Age must be between 16 and 80 for adult sizing');
  }

  if (!inputs.heightCm || inputs.heightCm < 140 || inputs.heightCm > 210) {
    errors.push('Height must be between 140 and 210 cm');
  }

  if (!inputs.weightKg || inputs.weightKg < 35 || inputs.weightKg > 200) {
    errors.push('Weight must be between 35 and 200 kg');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate kids age
 */
export function validateKidsAge(age: number): boolean {
  return age >= 3 && age <= 15;
}


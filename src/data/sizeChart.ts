/**
 * Size Chart Data
 * Contains adult and kids sizing information
 */

export interface SizeChartRow {
  size: string;
  lengthInches: number;
  chestInches: number;
}

export interface KidsAgeMap {
  [age: number]: number; // age -> size number
}

// Adult Size Chart
export const ADULT_SIZE_CHART: SizeChartRow[] = [
  { size: 'S', lengthInches: 26, chestInches: 36 },
  { size: 'M', lengthInches: 27, chestInches: 38 },
  { size: 'L', lengthInches: 28, chestInches: 40 },
  { size: 'XL', lengthInches: 29, chestInches: 42 },
  { size: '2XL', lengthInches: 30, chestInches: 44 },
  { size: '3XL', lengthInches: 30, chestInches: 46 },
];

// Kids Age to Size Number Mapping
export const KIDS_AGE_TO_SIZE: KidsAgeMap = {
  3: 16,
  5: 18,
  7: 20,
  9: 22,
  11: 24,
  12: 26,
  13: 28,
  15: 30,
};

// Available kids ages for dropdown
export const KIDS_AGES = [3, 5, 7, 9, 11, 12, 13, 15] as const;

// Adult size options
export const ADULT_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const;

// Fit preferences
export const FIT_PREFERENCES = ['Slim', 'Regular', 'Loose'] as const;

export type FitPreference = typeof FIT_PREFERENCES[number];
export type AdultSize = typeof ADULT_SIZES[number];
export type KidsAge = typeof KIDS_AGES[number];


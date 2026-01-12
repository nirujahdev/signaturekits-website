'use client';

import { useState, useEffect } from 'react';
import { 
  ADULT_SIZE_CHART, 
  KIDS_AGE_TO_SIZE, 
  KIDS_AGES, 
  FIT_PREFERENCES,
  type FitPreference 
} from '@/data/sizeChart';
import { 
  recommendAdultSize, 
  recommendKidsSize, 
  validateAdultInputs, 
  validateKidsAge,
  type AdultSizeInputs,
  type AdultSizeRecommendation 
} from '@/lib/recommendSize';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Ruler, User, Weight, Maximize2 } from 'lucide-react';

export function SizeCalculator() {
  const [activeTab, setActiveTab] = useState<'kids' | 'adult'>('adult');
  const [kidsAge, setKidsAge] = useState<number | null>(null);
  const [adultInputs, setAdultInputs] = useState<Partial<AdultSizeInputs>>({
    age: undefined,
    heightCm: undefined,
    weightKg: undefined,
    fitPreference: 'Regular',
  });
  const [adultRecommendation, setAdultRecommendation] = useState<AdultSizeRecommendation | null>(null);
  const [kidsRecommendation, setKidsRecommendation] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Calculate adult size when inputs change
  useEffect(() => {
    if (activeTab === 'adult' && adultInputs.age && adultInputs.heightCm && adultInputs.weightKg) {
      const validation = validateAdultInputs(adultInputs);
      setValidationErrors(validation.errors);
      
      if (validation.valid) {
        const recommendation = recommendAdultSize(adultInputs as AdultSizeInputs);
        setAdultRecommendation(recommendation);
        setHasCalculated(true);
      } else {
        setAdultRecommendation(null);
        setHasCalculated(false);
      }
    } else {
      setValidationErrors([]);
      setAdultRecommendation(null);
      setHasCalculated(false);
    }
  }, [activeTab, adultInputs]);

  // Calculate kids size when age changes
  useEffect(() => {
    if (activeTab === 'kids' && kidsAge !== null) {
      if (validateKidsAge(kidsAge)) {
        const recommendation = recommendKidsSize(kidsAge);
        setKidsRecommendation(recommendation);
        setHasCalculated(true);
      } else {
        setKidsRecommendation(null);
        setHasCalculated(false);
      }
    } else {
      setKidsRecommendation(null);
      setHasCalculated(false);
    }
  }, [activeTab, kidsAge]);

  const handleCalculate = () => {
    if (activeTab === 'adult') {
      if (adultInputs.age && adultInputs.heightCm && adultInputs.weightKg) {
        const validation = validateAdultInputs(adultInputs);
        setValidationErrors(validation.errors);
        
        if (validation.valid) {
          const recommendation = recommendAdultSize(adultInputs as AdultSizeInputs);
          setAdultRecommendation(recommendation);
          setHasCalculated(true);
        }
      }
    } else {
      if (kidsAge !== null && validateKidsAge(kidsAge)) {
        const recommendation = recommendKidsSize(kidsAge);
        setKidsRecommendation(recommendation);
        setHasCalculated(true);
      }
    }
  };

  const getKidsSizeLabel = (size: number): string => {
    // Map size numbers to labels based on the actual size chart
    // The size numbers from KIDS_AGE_TO_SIZE map to actual sizes
    if (size <= 18) return 'XS';
    if (size <= 22) return 'S';
    if (size <= 26) return 'M';
    if (size <= 30) return 'L';
    return 'XL';
  };

  return (
    <div className="w-full space-y-8">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as 'kids' | 'adult');
        setHasCalculated(false);
        setValidationErrors([]);
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="adult" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Adult
          </TabsTrigger>
          <TabsTrigger value="kids" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Kids
          </TabsTrigger>
        </TabsList>

        {/* Adult Calculator */}
        <TabsContent value="adult" className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <Label htmlFor="age" className="text-base font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={adultInputs.age || ''}
                  onChange={(e) => setAdultInputs({ ...adultInputs, age: parseInt(e.target.value) || undefined })}
                  className="h-12 text-base"
                  min={16}
                  max={80}
                />
              </div>

              <div>
                <Label htmlFor="height" className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height in cm"
                  value={adultInputs.heightCm || ''}
                  onChange={(e) => setAdultInputs({ ...adultInputs, heightCm: parseFloat(e.target.value) || undefined })}
                  className="h-12 text-base"
                  min={140}
                  max={210}
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight in kg"
                  value={adultInputs.weightKg || ''}
                  onChange={(e) => setAdultInputs({ ...adultInputs, weightKg: parseFloat(e.target.value) || undefined })}
                  className="h-12 text-base"
                  min={35}
                  max={200}
                />
              </div>

              <div>
                <Label htmlFor="fit" className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Fit Preference
                </Label>
                <Select
                  value={adultInputs.fitPreference || 'Regular'}
                  onValueChange={(value) => setAdultInputs({ ...adultInputs, fitPreference: value as FitPreference })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIT_PREFERENCES.map((pref) => (
                      <SelectItem key={pref} value={pref}>
                        {pref}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900 mb-1">Please correct the following:</p>
                      <ul className="text-sm text-red-800 space-y-1">
                        {validationErrors.map((error, idx) => (
                          <li key={idx}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleCalculate}
                disabled={!adultInputs.age || !adultInputs.heightCm || !adultInputs.weightKg}
                className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white"
              >
                Calculate My Size
              </Button>
            </div>
          </div>

          {/* Recommendation Result */}
          {adultRecommendation && hasCalculated && (
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-600 rounded-full p-3">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Recommended Size</h3>
                  <div className="text-5xl font-bold text-blue-600 mb-4">
                    {adultRecommendation.recommended}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Chest:</strong> {adultRecommendation.chartRow.chestInches} inches</p>
                    <p><strong>Length:</strong> {adultRecommendation.chartRow.lengthInches} inches</p>
                  </div>
                </div>
              </div>

              {(adultRecommendation.alternatives.tighter || adultRecommendation.alternatives.looser) && (
                <div className="border-t border-blue-200 pt-4 mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Alternative Sizes:</p>
                  <div className="flex gap-4">
                    {adultRecommendation.alternatives.tighter && (
                      <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Tighter Fit</p>
                        <p className="text-xl font-bold text-gray-900">{adultRecommendation.alternatives.tighter}</p>
                      </div>
                    )}
                    {adultRecommendation.alternatives.looser && (
                      <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Looser Fit</p>
                        <p className="text-xl font-bold text-gray-900">{adultRecommendation.alternatives.looser}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Kids Calculator */}
        <TabsContent value="kids" className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <Label htmlFor="kidsAge" className="text-base font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Child's Age
                </Label>
                <Select
                  value={kidsAge?.toString() || ''}
                  onValueChange={(value) => setKidsAge(parseInt(value))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {KIDS_AGES.map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} years old
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  Select your child's age to get a size recommendation
                </p>
              </div>

              <Button
                onClick={handleCalculate}
                disabled={!kidsAge || !validateKidsAge(kidsAge)}
                className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white"
              >
                Calculate Size
              </Button>
            </div>
          </div>

          {/* Recommendation Result */}
          {kidsRecommendation !== null && hasCalculated && (
            <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 rounded-full p-3">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Recommended Size</h3>
                  <div className="text-5xl font-bold text-green-600 mb-4">
                    {getKidsSizeLabel(kidsRecommendation)}
                  </div>
                  <p className="text-sm text-gray-700">
                    For {kidsAge} years old
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


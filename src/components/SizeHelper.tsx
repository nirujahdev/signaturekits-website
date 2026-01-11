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
import { FAQSection } from '@/components/seo/FAQSection';
import { FAQItem } from '@/lib/seo';
import { JerseyVisualization } from '@/components/JerseyVisualization';

interface SizeHelperProps {
  mode?: 'auto' | 'kids' | 'adult';
  productType?: 'kids' | 'adult';
}

const SIZE_GUIDE_FAQS: FAQItem[] = [
  {
    question: 'How do I choose the size?',
    answer: 'For kids, select their age and we\'ll recommend a size. For adults, enter your height, weight, and fit preference for a personalized recommendation. Always refer to the size chart for measurements.',
  },
  {
    question: 'What if I\'m between sizes?',
    answer: 'If you\'re between sizes, we recommend choosing the larger size for a more comfortable fit, or the smaller size if you prefer a tighter, more fitted look. Check the alternatives shown in your recommendation.',
  },
  {
    question: 'How do I measure chest correctly?',
    answer: 'For best accuracy, measure around the fullest part of your chest with the tape level and snug, not tight. Keep the tape parallel to the ground.',
  },
  {
    question: 'Do player-version jerseys fit tighter?',
    answer: 'Yes, player-version jerseys have a more athletic, tighter fit compared to fan versions. If you normally wear M, consider sizing up to L for player versions.',
  },
];

export function SizeHelper({ mode = 'auto', productType }: SizeHelperProps) {
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

  // Determine initial mode
  useEffect(() => {
    if (mode === 'auto') {
      if (productType === 'kids') {
        setActiveTab('kids');
      } else {
        setActiveTab('adult');
      }
    } else if (mode === 'kids') {
      setActiveTab('kids');
    } else {
      setActiveTab('adult');
    }
  }, [mode, productType]);

  // Calculate adult size when inputs change
  useEffect(() => {
    if (activeTab === 'adult' && adultInputs.age && adultInputs.heightCm && adultInputs.weightKg) {
      const validation = validateAdultInputs(adultInputs);
      setValidationErrors(validation.errors);
      
      if (validation.valid) {
        const recommendation = recommendAdultSize(adultInputs as AdultSizeInputs);
        setAdultRecommendation(recommendation);
        // Store in localStorage
        localStorage.setItem('lastRecommendedSize', recommendation.recommended);
      } else {
        setAdultRecommendation(null);
      }
    } else {
      setAdultRecommendation(null);
      setValidationErrors([]);
    }
  }, [adultInputs, activeTab]);

  // Calculate kids size when age changes
  useEffect(() => {
    if (activeTab === 'kids' && kidsAge !== null) {
      if (validateKidsAge(kidsAge)) {
        const recommendation = recommendKidsSize(kidsAge as any);
        setKidsRecommendation(recommendation.recommended);
        localStorage.setItem('lastRecommendedSize', `Kids ${recommendation.recommended}`);
      } else {
        setKidsRecommendation(null);
      }
    } else {
      setKidsRecommendation(null);
    }
  }, [kidsAge, activeTab]);

  const handleAdultInputChange = (field: keyof AdultSizeInputs, value: string | number) => {
    setAdultInputs(prev => ({
      ...prev,
      [field]: value === '' ? undefined : (typeof value === 'string' ? value : Number(value)),
    }));
  };

  // Answer-first block content
  const getAnswerBlock = () => {
    if (activeTab === 'adult' && adultRecommendation) {
      const { recommended, alternatives } = adultRecommendation;
      const tighterText = alternatives.tighter ? `choose ${alternatives.tighter} for tight fit` : '';
      const looserText = alternatives.looser ? `or ${alternatives.looser} for loose fit` : '';
      const altText = [tighterText, looserText].filter(Boolean).join(' ');
      return `Recommended size: ${recommended}. ${altText ? `Delivery fit tip: ${altText}.` : ''}`;
    }
    if (activeTab === 'kids' && kidsRecommendation) {
      return `Recommended kids size: ${kidsRecommendation}. Kids sizing is by age as a quick guide. If unsure, measure chest for best accuracy.`;
    }
    return null;
  };

  const answerBlock = getAnswerBlock();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Answer-first block */}
      {answerBlock && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">{answerBlock}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'kids' | 'adult')}>
        <TabsList className="grid w-full grid-cols-2">
          {mode !== 'adult' && (
            <TabsTrigger value="kids">Kids</TabsTrigger>
          )}
          {mode !== 'kids' && (
            <TabsTrigger value="adult">Adults</TabsTrigger>
          )}
        </TabsList>

        {/* Kids Tab */}
        {mode !== 'adult' && (
          <TabsContent value="kids" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="kids-age">Age</Label>
                <Select
                  value={kidsAge?.toString() || ''}
                  onValueChange={(value) => setKidsAge(Number(value))}
                >
                  <SelectTrigger id="kids-age">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {KIDS_AGES.map(age => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {kidsRecommendation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-lg font-semibold text-green-900">
                    Recommended Kids Size: {kidsRecommendation}
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Kids sizing is by age as a quick guide. If unsure, measure chest for best accuracy.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Adult Tab */}
        {mode !== 'kids' && (
          <TabsContent value="adult" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adult-age">Age</Label>
                <Input
                  id="adult-age"
                  type="number"
                  min="16"
                  max="80"
                  placeholder="16-80"
                  value={adultInputs.age || ''}
                  onChange={(e) => handleAdultInputChange('age', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="adult-height">Height (cm)</Label>
                <Input
                  id="adult-height"
                  type="number"
                  min="140"
                  max="210"
                  placeholder="140-210"
                  value={adultInputs.heightCm || ''}
                  onChange={(e) => handleAdultInputChange('heightCm', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="adult-weight">Weight (kg)</Label>
                <Input
                  id="adult-weight"
                  type="number"
                  min="35"
                  max="200"
                  placeholder="35-200"
                  value={adultInputs.weightKg || ''}
                  onChange={(e) => handleAdultInputChange('weightKg', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="fit-preference">Fit Preference</Label>
                <Select
                  value={adultInputs.fitPreference || 'Regular'}
                  onValueChange={(value) => handleAdultInputChange('fitPreference', value)}
                >
                  <SelectTrigger id="fit-preference">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIT_PREFERENCES.map(fit => (
                      <SelectItem key={fit} value={fit}>
                        {fit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {adultRecommendation && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-lg font-semibold text-green-900 mb-2">
                    Recommended Size: {adultRecommendation.recommended}
                  </p>
                  
                  {(adultRecommendation.alternatives.tighter || adultRecommendation.alternatives.looser) && (
                    <div className="mt-3 space-y-1">
                      {adultRecommendation.alternatives.tighter && (
                        <p className="text-sm text-green-700">
                          Tighter fit: {adultRecommendation.alternatives.tighter}
                        </p>
                      )}
                      {adultRecommendation.alternatives.looser && (
                        <p className="text-sm text-green-700">
                          Looser fit: {adultRecommendation.alternatives.looser}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Why this size?</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {adultRecommendation.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Interactive Jersey Visualization - Adult Only */}
      {activeTab === 'adult' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Interactive Size Guide</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select a size to see measurements visualized on the jersey. Hover over measurement lines for details.
          </p>
          <JerseyVisualization 
            selectedSize={adultRecommendation?.recommended}
          />
        </div>
      )}

      {/* Size Chart Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Size Chart</h3>
        
        {/* Measurement Note */}
        <p className="text-sm text-gray-600">
          For best accuracy, measure around the fullest part of your chest with the tape level and snug, not tight.
        </p>

        {/* Adult Size Chart */}
        {activeTab === 'adult' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Length (in)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Chest (in)</th>
                </tr>
              </thead>
              <tbody>
                {ADULT_SIZE_CHART.map((row) => (
                  <tr key={row.size} className={adultRecommendation?.recommended === row.size ? 'bg-blue-50' : ''}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{row.size}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.lengthInches}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.chestInches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kids Size Chart */}
        {activeTab === 'kids' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                </tr>
              </thead>
              <tbody>
                {KIDS_AGES.map((age) => (
                  <tr key={age} className={kidsAge === age ? 'bg-blue-50' : ''}>
                    <td className="border border-gray-300 px-4 py-2">{age} years</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{KIDS_AGE_TO_SIZE[age]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <FAQSection faqs={SIZE_GUIDE_FAQS} title="Size Guide FAQs" />
    </div>
  );
}


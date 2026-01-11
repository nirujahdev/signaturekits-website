'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CustomizationFormProps {
  onCustomizationChange: (customization: {
    patchEnabled: boolean;
    patchType?: string;
    printName?: string;
    printNumber?: string;
    customizationPrice?: number;
  }) => void;
  initialValues?: {
    patchEnabled?: boolean;
    patchType?: string;
    printName?: string;
    printNumber?: string;
  };
}

const PATCH_TYPES = [
  'Premier League',
  'Champions League',
  'Europa League',
  'World Cup',
  'Copa America',
  'AFC Asian Cup',
];

const PATCH_PRICE = 400; // LKR
const NAME_AND_NUMBER_PRICE = 1300; // LKR

export function CustomizationForm({
  onCustomizationChange,
  initialValues = {},
}: CustomizationFormProps) {
  const [patchEnabled, setPatchEnabled] = useState(initialValues.patchEnabled || false);
  const [patchType, setPatchType] = useState(initialValues.patchType || '');
  const [printName, setPrintName] = useState(initialValues.printName || '');
  const [printNumber, setPrintNumber] = useState(initialValues.printNumber || '');
  const [nameAndNumberEnabled, setNameAndNumberEnabled] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // When name and number option is enabled, auto-fill both fields
  useEffect(() => {
    if (nameAndNumberEnabled) {
      // Don't clear if user has already entered values
      if (!printName && !printNumber) {
        // Fields will be filled by user
      }
    } else {
      // If disabled, clear both fields
      if (printName || printNumber) {
        setPrintName('');
        setPrintNumber('');
      }
    }
  }, [nameAndNumberEnabled]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (nameAndNumberEnabled || printName) {
      if (!printName || printName.trim().length === 0) {
        newErrors.printName = 'Name is required';
      } else if (printName.length > 20) {
        newErrors.printName = 'Name must be 20 characters or less';
      } else if (!/^[a-zA-Z0-9\s]+$/.test(printName)) {
        newErrors.printName = 'Name can only contain letters, numbers, and spaces';
      }
    }

    if (nameAndNumberEnabled || printNumber) {
      if (!printNumber || printNumber.trim().length === 0) {
        newErrors.printNumber = 'Jersey number is required';
      } else {
        const num = parseInt(printNumber);
        if (isNaN(num) || num < 1 || num > 99) {
          newErrors.printNumber = 'Number must be between 1 and 99';
        }
      }
    }

    if (patchEnabled && !patchType) {
      newErrors.patchType = 'Please select a patch type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCustomizationPrice = () => {
    let price = 0;
    if (patchEnabled) {
      price += PATCH_PRICE;
    }
    if (nameAndNumberEnabled && printName && printNumber) {
      price += NAME_AND_NUMBER_PRICE;
    }
    return price;
  };

  const handleChange = () => {
    if (validate()) {
      const customizationPrice = calculateCustomizationPrice();
      onCustomizationChange({
        patchEnabled,
        patchType: patchEnabled ? patchType : undefined,
        printName: (nameAndNumberEnabled || printName) ? printName.trim() : undefined,
        printNumber: (nameAndNumberEnabled || printNumber) ? printNumber.trim() : undefined,
        customizationPrice,
      });
    }
  };

  // Auto-validate when fields change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange();
    }, 100);
    return () => clearTimeout(timer);
  }, [patchEnabled, patchType, printName, printNumber, nameAndNumberEnabled]);

  const customizationPrice = calculateCustomizationPrice();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="bg-[#F5F5F5] px-6 py-4 mb-4">
          <p className="luxury-uppercase text-[11px] font-semibold text-black tracking-[0.1em] mb-2">
            Complimentary Personalization
          </p>
          <p className="text-[12px] text-[#666666]">
            Add your name and number, or choose a patch to make your jersey unique.
          </p>
        </div>
      </div>

      {/* Name and Number Combined Option */}
      <div className="space-y-4 border border-[#E5E5E5] p-5 bg-white">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="name-number-enabled"
            checked={nameAndNumberEnabled}
            onCheckedChange={(checked) => {
              setNameAndNumberEnabled(checked as boolean);
            }}
            className="border-[#E5E5E5]"
          />
          <Label htmlFor="name-number-enabled" className="text-[13px] font-medium text-black cursor-pointer">
            Add Name and Number <span className="text-[#666666] font-normal">(+LKR {NAME_AND_NUMBER_PRICE.toLocaleString()})</span>
          </Label>
        </div>

        {nameAndNumberEnabled && (
          <div className="space-y-4 mt-4 pl-8 border-l border-[#E5E5E5]">
            <div className="space-y-2">
              <Label htmlFor="print-name" className="text-[12px] font-medium text-black">Add your Name *</Label>
              <Input
                id="print-name"
                type="text"
                placeholder="Enter your name (max 20 characters)"
                value={printName}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 20);
                  setPrintName(value);
                }}
                maxLength={20}
                required
                className="border-[#E5E5E5] focus:border-black rounded-sm text-[13px]"
              />
              {errors.printName && (
                <p className="text-[11px] text-red-500">{errors.printName}</p>
              )}
              <p className="text-[11px] text-[#666666]">
                Letters, numbers, and spaces only. Max 20 characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="print-number" className="text-[12px] font-medium text-black">Enter Your Jersey Number *</Label>
              <Input
                id="print-number"
                type="text"
                placeholder="Enter number (1-99)"
                value={printNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setPrintNumber(value);
                }}
                maxLength={2}
                required
                className="border-[#E5E5E5] focus:border-black rounded-sm text-[13px]"
              />
              {errors.printNumber && (
                <p className="text-[11px] text-red-500">{errors.printNumber}</p>
              )}
              <p className="text-[11px] text-[#666666]">Numbers 1-99 only.</p>
            </div>
          </div>
        )}
      </div>

      {/* Patch Option */}
      <div className="space-y-4 border border-[#E5E5E5] p-5 bg-white">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="patch-enabled"
            checked={patchEnabled}
            onCheckedChange={(checked) => {
              setPatchEnabled(checked as boolean);
              if (!checked) setPatchType('');
            }}
            className="border-[#E5E5E5]"
          />
          <Label htmlFor="patch-enabled" className="text-[13px] font-medium text-black cursor-pointer">
            Add Patch <span className="text-[#666666] font-normal">(+LKR {PATCH_PRICE.toLocaleString()})</span>
          </Label>
        </div>

        {patchEnabled && (
          <div className="mt-4 pl-8 border-l border-[#E5E5E5]">
            <Label htmlFor="patch-type" className="text-[12px] font-medium text-black">Patch Type *</Label>
            <Select
              value={patchType}
              onValueChange={(value) => {
                setPatchType(value);
              }}
            >
              <SelectTrigger id="patch-type" className="mt-2 border-[#E5E5E5] focus:border-black rounded-sm text-[13px]">
                <SelectValue placeholder="Select patch type" />
              </SelectTrigger>
              <SelectContent>
                {PATCH_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patchType && (
              <p className="text-[11px] text-red-500 mt-1">{errors.patchType}</p>
            )}
          </div>
        )}
      </div>

      {/* Price Summary */}
      {customizationPrice > 0 && (
        <div className="bg-[#F5F5F5] px-5 py-4 border border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-black">
              Customization Total:
            </span>
            <span className="text-[16px] font-semibold text-black">
              LKR {customizationPrice.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Note */}
      <p className="text-[11px] text-[#666666] leading-relaxed">
        <strong className="text-black">Note:</strong> Customization requires up to 3 to 4 extra days for processing.
      </p>
    </div>
  );
}


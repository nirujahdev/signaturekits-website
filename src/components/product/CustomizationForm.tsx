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
      <div>
        <h3 className="text-lg font-semibold mb-2">Customize your Jersey with your Name</h3>
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Customization requires up to 3 to 4 extra days for processing.
          </AlertDescription>
        </Alert>
      </div>

      {/* Name and Number Combined Option */}
      <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="name-number-enabled"
            checked={nameAndNumberEnabled}
            onCheckedChange={(checked) => {
              setNameAndNumberEnabled(checked as boolean);
            }}
          />
          <Label htmlFor="name-number-enabled" className="font-medium cursor-pointer">
            Add Name and Number (+LKR {NAME_AND_NUMBER_PRICE.toLocaleString()})
          </Label>
        </div>

        {nameAndNumberEnabled && (
          <div className="space-y-4 mt-4 pl-6">
            <div className="space-y-2">
              <Label htmlFor="print-name">Add your Name *</Label>
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
              />
              {errors.printName && (
                <p className="text-sm text-red-500">{errors.printName}</p>
              )}
              <p className="text-xs text-gray-500">
                Letters, numbers, and spaces only. Max 20 characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="print-number">Enter Your Jersey Number *</Label>
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
              />
              {errors.printNumber && (
                <p className="text-sm text-red-500">{errors.printNumber}</p>
              )}
              <p className="text-xs text-gray-500">Numbers 1-99 only.</p>
            </div>
          </div>
        )}
      </div>

      {/* Patch Option */}
      <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="patch-enabled"
            checked={patchEnabled}
            onCheckedChange={(checked) => {
              setPatchEnabled(checked as boolean);
              if (!checked) setPatchType('');
            }}
          />
          <Label htmlFor="patch-enabled" className="font-medium cursor-pointer">
            Add Patch (+LKR {PATCH_PRICE.toLocaleString()})
          </Label>
        </div>

        {patchEnabled && (
          <div className="mt-4 pl-6">
            <Label htmlFor="patch-type">Patch Type *</Label>
            <Select
              value={patchType}
              onValueChange={(value) => {
                setPatchType(value);
              }}
            >
              <SelectTrigger id="patch-type" className="mt-2">
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
              <p className="text-sm text-red-500 mt-1">{errors.patchType}</p>
            )}
          </div>
        )}
      </div>

      {/* Price Summary */}
      {customizationPrice > 0 && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-800 dark:text-green-200">
                Customization Total:
              </span>
              <span className="text-lg font-bold text-green-800 dark:text-green-200">
                LKR {customizationPrice.toLocaleString()}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Preview */}
      {(printName || printNumber || patchEnabled) && (
        <Alert>
          <AlertDescription>
            <strong>Customization Preview:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              {patchEnabled && <li>✓ Patch: {patchType || 'Selected'}</li>}
              {printName && <li>✓ Name: {printName}</li>}
              {printNumber && <li>✓ Number: #{printNumber}</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}


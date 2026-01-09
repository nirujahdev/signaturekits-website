'use client';

import { useState } from 'react';
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

export function CustomizationForm({
  onCustomizationChange,
  initialValues = {},
}: CustomizationFormProps) {
  const [patchEnabled, setPatchEnabled] = useState(initialValues.patchEnabled || false);
  const [patchType, setPatchType] = useState(initialValues.patchType || '');
  const [printName, setPrintName] = useState(initialValues.printName || '');
  const [printNumber, setPrintNumber] = useState(initialValues.printNumber || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (printName && printName.length > 20) {
      newErrors.printName = 'Name must be 20 characters or less';
    }

    if (printName && !/^[a-zA-Z0-9\s]+$/.test(printName)) {
      newErrors.printName = 'Name can only contain letters, numbers, and spaces';
    }

    if (printNumber) {
      const num = parseInt(printNumber);
      if (isNaN(num) || num < 1 || num > 99) {
        newErrors.printNumber = 'Number must be between 1 and 99';
      }
    }

    if (patchEnabled && !patchType) {
      newErrors.patchType = 'Please select a patch type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = () => {
    if (validate()) {
      onCustomizationChange({
        patchEnabled,
        patchType: patchEnabled ? patchType : undefined,
        printName: printName.trim() || undefined,
        printNumber: printNumber.trim() || undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Customization Options</h3>
        <p className="text-sm text-gray-500 mb-4">
          Personalize your jersey with patches, name, and number printing.
        </p>
      </div>

      {/* Patch Option */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="patch-enabled"
            checked={patchEnabled}
            onCheckedChange={(checked) => {
              setPatchEnabled(checked as boolean);
              if (!checked) setPatchType('');
              setTimeout(handleChange, 0);
            }}
          />
          <Label htmlFor="patch-enabled" className="font-medium cursor-pointer">
            Add Patch (+LKR 500)
          </Label>
        </div>

        {patchEnabled && (
          <div>
            <Label htmlFor="patch-type">Patch Type</Label>
            <Select
              value={patchType}
              onValueChange={(value) => {
                setPatchType(value);
                setTimeout(handleChange, 0);
              }}
            >
              <SelectTrigger id="patch-type">
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

      {/* Name Printing */}
      <div className="space-y-2">
        <Label htmlFor="print-name">Print Name (Optional)</Label>
        <Input
          id="print-name"
          type="text"
          placeholder="Enter name (max 20 characters)"
          value={printName}
          onChange={(e) => {
            const value = e.target.value.slice(0, 20);
            setPrintName(value);
            setTimeout(handleChange, 0);
          }}
          maxLength={20}
        />
        {errors.printName && (
          <p className="text-sm text-red-500">{errors.printName}</p>
        )}
        <p className="text-xs text-gray-500">
          Letters, numbers, and spaces only. Max 20 characters.
        </p>
      </div>

      {/* Number Printing */}
      <div className="space-y-2">
        <Label htmlFor="print-number">Print Number (Optional)</Label>
        <Input
          id="print-number"
          type="text"
          placeholder="1-99"
          value={printNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 2);
            setPrintNumber(value);
            setTimeout(handleChange, 0);
          }}
          maxLength={2}
        />
        {errors.printNumber && (
          <p className="text-sm text-red-500">{errors.printNumber}</p>
        )}
        <p className="text-xs text-gray-500">Numbers 1-99 only.</p>
      </div>

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


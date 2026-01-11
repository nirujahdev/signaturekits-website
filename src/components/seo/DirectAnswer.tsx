/**
 * Direct Answer Block for AEO (Answer Engine Optimization)
 * Provides quick, scannable answers at the top of product pages
 */

'use client';

import { SEO_CONFIG } from '@/lib/seo-config';

interface DirectAnswerProps {
  deliveryDays?: string;
  hasCustomization?: boolean;
  hasCOD?: boolean;
  isPreOrder?: boolean;
  customizationFee?: string;
  trackingStage?: string;
  // Allow custom content override
  customContent?: string;
}

export function DirectAnswer({
  deliveryDays,
  hasCustomization,
  hasCOD,
  isPreOrder,
  customizationFee,
  trackingStage,
  customContent,
}: DirectAnswerProps) {
  // Use config defaults if not provided
  const delivery = deliveryDays || SEO_CONFIG.DELIVERY_WINDOW;
  const customization = hasCustomization !== undefined ? hasCustomization : SEO_CONFIG.CUSTOM_NAME_NUMBER;
  const cod = hasCOD !== undefined ? hasCOD : SEO_CONFIG.COD;
  const preOrder = isPreOrder !== undefined ? isPreOrder : true;
  const tracking = trackingStage || SEO_CONFIG.TRACKING_STAGE;

  // If custom content provided, use it
  if (customContent) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">{customContent}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-blue-900 dark:text-blue-100 min-w-[100px]">
            Delivery:
          </span>
          <span className="text-blue-800 dark:text-blue-200">
            {delivery} {preOrder && '(pre-order)'}. Islandwide delivery in Sri Lanka.
          </span>
        </div>
        {customization && (
          <div className="flex items-start gap-2">
            <span className="font-semibold text-blue-900 dark:text-blue-100 min-w-[100px]">
              Customization:
            </span>
            <span className="text-blue-800 dark:text-blue-200">
              Name & number available{customizationFee && ` (${customizationFee})`}.
            </span>
          </div>
        )}
        {cod && (
          <div className="flex items-start gap-2">
            <span className="font-semibold text-blue-900 dark:text-blue-100 min-w-[100px]">
              Payment:
            </span>
            <span className="text-blue-800 dark:text-blue-200">
              Secure checkout + Cash on Delivery (COD) available.
            </span>
          </div>
        )}
        <div className="flex items-start gap-2">
          <span className="font-semibold text-blue-900 dark:text-blue-100 min-w-[100px]">
            Tracking:
          </span>
          <span className="text-blue-800 dark:text-blue-200">
            Shared at {tracking} stage.
          </span>
        </div>
      </div>
    </div>
  );
}


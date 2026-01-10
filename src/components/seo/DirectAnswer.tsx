/**
 * Direct Answer Block for AEO (Answer Engine Optimization)
 * Provides quick, scannable answers at the top of product pages
 */

interface DirectAnswerProps {
  deliveryDays?: string;
  hasCustomization?: boolean;
  hasCOD?: boolean;
  isPreOrder?: boolean;
  customizationFee?: string;
}

export function DirectAnswer({
  deliveryDays = '10–20',
  hasCustomization = true,
  hasCOD = true,
  isPreOrder = true,
  customizationFee,
}: DirectAnswerProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-blue-900 dark:text-blue-100 min-w-[100px]">
            Delivery:
          </span>
          <span className="text-blue-800 dark:text-blue-200">
            {deliveryDays} working days {isPreOrder && '(pre-order)'}. Islandwide delivery in Sri Lanka.
          </span>
        </div>
        {hasCustomization && (
          <div className="flex items-start gap-2">
            <span className="font-semibold text-blue-900 dark:text-blue-100 min-w-[100px]">
              Customization:
            </span>
            <span className="text-blue-800 dark:text-blue-200">
              Name & number available{customizationFee && ` (${customizationFee})`}.
            </span>
          </div>
        )}
        {hasCOD && (
          <div className="flex items-start gap-2">
            <span className="font-semibold text-blue-900 dark:text-blue-100 min-w-[100px]">
              Payment:
            </span>
            <span className="text-blue-800 dark:text-blue-200">
              Secure checkout + Cash on Delivery (COD) available.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


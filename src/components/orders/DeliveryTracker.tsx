'use client';

import { CheckCircle2, Circle, Package, Truck, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

type DeliveryStage = 'ORDER_CONFIRMED' | 'SOURCING' | 'ARRIVED' | 'DISPATCHED' | 'DELIVERED';

interface DeliveryTrackerProps {
  stage: DeliveryStage;
  trackingNumber?: string | null;
  updatedAt?: string;
}

const STAGES: Array<{
  code: DeliveryStage;
  label: string;
  icon: any;
  description: string;
}> = [
  {
    code: 'ORDER_CONFIRMED',
    label: 'Order Confirmed',
    icon: CheckCircle2,
    description: 'Order is confirmed and ready to be included in the next import batch',
  },
  {
    code: 'SOURCING',
    label: 'Sourcing',
    icon: Package,
    description: 'Collecting items from supplier (pre-order batch in progress)',
  },
  {
    code: 'ARRIVED',
    label: 'Arrived',
    icon: Home,
    description: 'Items arrived and are ready for packing and quality check',
  },
  {
    code: 'DISPATCHED',
    label: 'Dispatched',
    icon: Truck,
    description: 'Handed over to courier',
  },
  {
    code: 'DELIVERED',
    label: 'Delivered',
    icon: CheckCircle2,
    description: 'Order has been delivered',
  },
];

export default function DeliveryTracker({ stage, trackingNumber, updatedAt }: DeliveryTrackerProps) {
  const currentStageIndex = STAGES.findIndex((s) => s.code === stage);
  const showTracking = (stage === 'DISPATCHED' || stage === 'DELIVERED') && trackingNumber;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Delivery Status</h2>

      <div className="space-y-4">
        {STAGES.map((stageItem, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = index > currentStageIndex;

          const Icon = stageItem.icon;
          const iconColor = isCompleted
            ? 'text-green-500'
            : isCurrent
            ? 'text-blue-500'
            : 'text-gray-300';

          return (
            <div key={stageItem.code} className="flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Circle className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-semibold ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {stageItem.label}
                  </h3>
                  {isCurrent && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{stageItem.description}</p>
                {isCurrent && updatedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Updated: {new Date(updatedAt).toLocaleDateString('en-LK')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Number */}
      {showTracking && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Tracking Number</p>
              <p className="text-lg font-mono font-semibold text-blue-700 mt-1">
                {trackingNumber}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <a
                href={`https://tracking.transexpress.lk/tracking`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Track on Trans Express
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


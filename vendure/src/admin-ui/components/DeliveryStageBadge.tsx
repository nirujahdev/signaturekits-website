import React from 'react';

interface DeliveryStageBadgeProps {
  stage: string;
}

const stageColors: Record<string, string> = {
  ORDER_CONFIRMED: 'bg-blue-100 text-blue-800',
  SOURCING: 'bg-yellow-100 text-yellow-800',
  ARRIVED: 'bg-purple-100 text-purple-800',
  DISPATCHED: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
};

const stageLabels: Record<string, string> = {
  ORDER_CONFIRMED: 'Order Confirmed',
  SOURCING: 'Sourcing',
  ARRIVED: 'Arrived',
  DISPATCHED: 'Dispatched',
  DELIVERED: 'Delivered',
};

export const DeliveryStageBadge: React.FC<DeliveryStageBadgeProps> = ({ stage }) => {
  const colorClass = stageColors[stage] || 'bg-gray-100 text-gray-800';
  const label = stageLabels[stage] || stage;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};


import React from 'react';
import { DeliveryStageBadge } from './DeliveryStageBadge';

interface CustomerCardProps {
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    phoneVerified: boolean;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    isActive: boolean;
  };
  onClick?: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">
            {customer.firstName} {customer.lastName}
          </h3>
          <p className="text-sm text-gray-600">{customer.email}</p>
        </div>
        {customer.phoneVerified && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
            Verified
          </span>
        )}
      </div>
      
      <div className="mt-3 space-y-1 text-sm">
        {customer.phoneNumber && (
          <p className="text-gray-600">
            Phone: {customer.phoneNumber}
            {!customer.phoneVerified && (
              <span className="ml-2 text-orange-600">(Unverified)</span>
            )}
          </p>
        )}
        <div className="flex gap-4">
          <span className="text-gray-600">
            Orders: <span className="font-medium">{customer.totalOrders}</span>
          </span>
          <span className="text-gray-600">
            Spent: <span className="font-medium">LKR {customer.totalSpent.toFixed(2)}</span>
          </span>
        </div>
        {customer.lastOrderDate && (
          <p className="text-gray-500 text-xs">
            Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};


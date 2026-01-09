import React from 'react';
import { DeliveryStageBadge } from './DeliveryStageBadge';

interface OrderCardProps {
  order: {
    id: string;
    orderCode: string;
    orderDate: string;
    deliveryStage: string;
    paymentMethod?: string;
    paymentStatus?: string;
    totalWithTax: number;
    trackingNumber?: string;
    customer?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  onClick?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">Order {order.orderCode}</h3>
          <p className="text-sm text-gray-600">
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <DeliveryStageBadge stage={order.deliveryStage} />
      </div>
      
      <div className="mt-3 space-y-1 text-sm">
        {order.customer && (
          <p className="text-gray-600">
            Customer: {order.customer.firstName} {order.customer.lastName}
          </p>
        )}
        <div className="flex gap-4">
          <span className="text-gray-600">
            Total: <span className="font-medium">LKR {order.totalWithTax.toFixed(2)}</span>
          </span>
          {order.paymentMethod && (
            <span className="text-gray-600">
              Payment: <span className="font-medium">{order.paymentMethod}</span>
            </span>
          )}
        </div>
        {order.trackingNumber && (
          <p className="text-blue-600 text-xs">
            Tracking: {order.trackingNumber}
          </p>
        )}
      </div>
    </div>
  );
};


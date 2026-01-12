'use client';

import { useState } from 'react';
import { ADULT_SIZE_CHART, type SizeChartRow } from '@/data/sizeChart';

interface JerseyVisualizationProps {
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
}

export function JerseyVisualization({ selectedSize, onSizeSelect }: JerseyVisualizationProps) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [hoveredMeasurement, setHoveredMeasurement] = useState<'length' | 'chest' | null>(null);

  const currentSize = selectedSize || hoveredSize;
  const sizeData = currentSize 
    ? ADULT_SIZE_CHART.find(s => s.size === currentSize)
    : null;

  // Base dimensions for jersey SVG (scaled for display)
  const baseWidth = 200;
  const baseHeight = 280;
  
  // Scale measurements to visual size (1 inch = 8px for better visibility)
  const scale = 8;
  const chestWidth = sizeData ? (sizeData.chestInches / 2) * scale : 80;
  const length = sizeData ? sizeData.lengthInches * scale : 200;

  const handleSizeClick = (size: string) => {
    if (onSizeSelect) {
      onSizeSelect(size);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Size Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ADULT_SIZE_CHART.map((size) => (
          <button
            key={size.size}
            onClick={() => handleSizeClick(size.size)}
            onMouseEnter={() => setHoveredSize(size.size)}
            onMouseLeave={() => setHoveredSize(null)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedSize === size.size || hoveredSize === size.size
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {size.size}
          </button>
        ))}
      </div>

      {/* Jersey Visualization */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-gray-50 rounded-xl">
        <div className="relative">
          <svg
            width={baseWidth}
            height={baseHeight}
            viewBox={`0 0 ${baseWidth} ${baseHeight}`}
            className="max-w-full h-auto"
          >
            {/* Jersey Outline */}
            <g>
              {/* Main body */}
              <path
                d={`M ${baseWidth / 2 - chestWidth} 40 
                    L ${baseWidth / 2 - chestWidth} ${length + 40}
                    Q ${baseWidth / 2 - chestWidth} ${length + 50} ${baseWidth / 2 - chestWidth * 0.7} ${length + 50}
                    L ${baseWidth / 2 + chestWidth * 0.7} ${length + 50}
                    Q ${baseWidth / 2 + chestWidth} ${length + 50} ${baseWidth / 2 + chestWidth} ${length + 40}
                    L ${baseWidth / 2 + chestWidth} 40
                    Q ${baseWidth / 2 + chestWidth} 30 ${baseWidth / 2 + chestWidth * 0.8} 30
                    L ${baseWidth / 2 - chestWidth * 0.8} 30
                    Q ${baseWidth / 2 - chestWidth} 30 ${baseWidth / 2 - chestWidth} 40
                    Z`}
                fill={currentSize ? '#3b82f6' : '#e5e7eb'}
                stroke={currentSize ? '#1e40af' : '#9ca3af'}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Neck opening */}
              <ellipse
                cx={baseWidth / 2}
                cy={35}
                rx={chestWidth * 0.3}
                ry={8}
                fill="white"
                stroke={currentSize ? '#1e40af' : '#9ca3af'}
                strokeWidth="2"
              />

              {/* Sleeves */}
              <path
                d={`M ${baseWidth / 2 - chestWidth} 50
                    Q ${baseWidth / 2 - chestWidth - 20} 50 ${baseWidth / 2 - chestWidth - 25} 70
                    L ${baseWidth / 2 - chestWidth - 25} 120
                    Q ${baseWidth / 2 - chestWidth - 25} 130 ${baseWidth / 2 - chestWidth - 15} 130
                    L ${baseWidth / 2 - chestWidth - 5} 130
                    Q ${baseWidth / 2 - chestWidth} 130 ${baseWidth / 2 - chestWidth} 120
                    L ${baseWidth / 2 - chestWidth} 50
                    Z`}
                fill={currentSize ? '#3b82f6' : '#e5e7eb'}
                stroke={currentSize ? '#1e40af' : '#9ca3af'}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <path
                d={`M ${baseWidth / 2 + chestWidth} 50
                    Q ${baseWidth / 2 + chestWidth + 20} 50 ${baseWidth / 2 + chestWidth + 25} 70
                    L ${baseWidth / 2 + chestWidth + 25} 120
                    Q ${baseWidth / 2 + chestWidth + 25} 130 ${baseWidth / 2 + chestWidth + 15} 130
                    L ${baseWidth / 2 + chestWidth + 5} 130
                    Q ${baseWidth / 2 + chestWidth} 130 ${baseWidth / 2 + chestWidth} 120
                    L ${baseWidth / 2 + chestWidth} 50
                    Z`}
                fill={currentSize ? '#3b82f6' : '#e5e7eb'}
                stroke={currentSize ? '#1e40af' : '#9ca3af'}
                strokeWidth="2"
                className="transition-all duration-300"
              />
            </g>

            {/* Length Measurement Line */}
            {sizeData && (
              <g
                onMouseEnter={() => setHoveredMeasurement('length')}
                onMouseLeave={() => setHoveredMeasurement(null)}
                className="cursor-pointer"
              >
                <line
                  x1={baseWidth / 2 + chestWidth + 20}
                  y1={40}
                  x2={baseWidth / 2 + chestWidth + 20}
                  y2={length + 40}
                  stroke={hoveredMeasurement === 'length' ? '#ef4444' : '#6b7280'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x={baseWidth / 2 + chestWidth + 30}
                  y={(length + 40) / 2}
                  fill={hoveredMeasurement === 'length' ? '#ef4444' : '#374151'}
                  fontSize="12"
                  fontWeight="600"
                  className="select-none"
                >
                  {sizeData.lengthInches}"
                </text>
                <text
                  x={baseWidth / 2 + chestWidth + 30}
                  y={(length + 40) / 2 + 15}
                  fill={hoveredMeasurement === 'length' ? '#ef4444' : '#6b7280'}
                  fontSize="10"
                  className="select-none"
                >
                  Length
                </text>
              </g>
            )}

            {/* Chest Measurement Line */}
            {sizeData && (
              <g
                onMouseEnter={() => setHoveredMeasurement('chest')}
                onMouseLeave={() => setHoveredMeasurement(null)}
                className="cursor-pointer"
              >
                <line
                  x1={baseWidth / 2 - chestWidth}
                  y1={100}
                  x2={baseWidth / 2 + chestWidth}
                  y2={100}
                  stroke={hoveredMeasurement === 'chest' ? '#ef4444' : '#6b7280'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x={baseWidth / 2}
                  y={90}
                  fill={hoveredMeasurement === 'chest' ? '#ef4444' : '#374151'}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                  className="select-none"
                >
                  {sizeData.chestInches}"
                </text>
                <text
                  x={baseWidth / 2}
                  y={75}
                  fill={hoveredMeasurement === 'chest' ? '#ef4444' : '#6b7280'}
                  fontSize="10"
                  textAnchor="middle"
                  className="select-none"
                >
                  Chest
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Size Details */}
        {sizeData && (
          <div className="space-y-4 min-w-[200px]">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-lg mb-3">Size {sizeData.size} Measurements</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Length:</span>
                  <span className="font-semibold">{sizeData.lengthInches}" ({Math.round(sizeData.lengthInches * 2.54)} cm)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chest:</span>
                  <span className="font-semibold">{sizeData.chestInches}" ({Math.round(sizeData.chestInches * 2.54)} cm)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Hover over the measurement lines on the jersey to see details. Click a size button above to compare.
            </p>
          </div>
        )}

        {!sizeData && (
          <div className="min-w-[200px] text-center">
            <p className="text-gray-500 text-sm">Select a size to see measurements</p>
          </div>
        )}
      </div>
    </div>
  );
}





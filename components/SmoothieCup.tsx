
import React from 'react';
import { BASES, FRUIT_PACKS, FRUITS_MASTER } from '../constants';
import { SmoothieState } from '../types';

interface Props {
  state: SmoothieState;
}

export const SmoothieCup: React.FC<Props> = ({ state }) => {
  const baseColor = BASES.find(b => b.id === state.base)?.color || '#f1f1f1';
  const pack = FRUIT_PACKS.find(p => p.id === state.fruitPackId);
  const fruitColors = pack 
    ? pack.items.map(item => FRUITS_MASTER.find(f => f.id === item.fruitId)?.color || '#eee')
    : [];

  const width = 120;
  const height = 180;
  const cupPath = `M 25,10 L 95,10 L 85,160 Q 85,170 75,170 L 45,170 Q 35,170 35,160 Z`;

  return (
    <div className="relative flex justify-center py-2">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] relative z-10">
        <path d={cupPath} fill="white" fillOpacity="0.95" className="dark:fill-opacity-95" />
        <mask id="cupMask"><path d={cupPath} fill="white" /></mask>
        <g mask="url(#cupMask)">
           <rect x="0" y="100" width="120" height="80" fill={baseColor} />
           {fruitColors.length > 0 ? (
             fruitColors.map((color, idx) => {
               const layerHeight = 90 / fruitColors.length;
               const yPos = 10 + (idx * layerHeight);
               return <rect key={idx} x="0" y={yPos} width="120" height={layerHeight} fill={color} />;
             })
           ) : (
             <rect x="0" y="10" width="120" height="90" fill="#e5e7eb" fillOpacity="0.5" />
           )}
        </g>
        <path d={cupPath} fill="none" stroke="black" strokeWidth="3" strokeOpacity="0.1" className="dark:stroke-white dark:stroke-opacity-80" />
        <path d="M 60,20 L 60,0 L 75,-15" fill="none" stroke="#CA210E" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
};

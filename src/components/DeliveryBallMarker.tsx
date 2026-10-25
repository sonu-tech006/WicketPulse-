import React from 'react';

interface DeliveryBallMarkerProps {
  value: string | number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DeliveryBallMarker: React.FC<DeliveryBallMarkerProps> = ({
  value,
  size = 'md',
  className = '',
}) => {
  const str = String(value).toUpperCase().trim();

  let bgClass = 'bg-slate-800/80 text-slate-300 border border-slate-700/60';

  if (str === '4') {
    bgClass = 'bg-[#37D5F5]/20 text-[#37D5F5] border border-[#37D5F5]/40 font-bold';
  } else if (str === '6') {
    bgClass = 'bg-[#B8FF4D]/25 text-[#B8FF4D] border border-[#B8FF4D]/50 font-bold';
  } else if (str === 'W' || str.startsWith('W-') || str === 'OUT') {
    bgClass = 'bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/60 font-bold animate-pulse-live';
  } else if (str === '0' || str === '•' || str === '.') {
    bgClass = 'bg-slate-800/60 text-slate-400 border border-slate-700/40';
  } else if (str === 'WD' || str === 'NB' || str === 'LB' || str === 'B') {
    bgClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]';
  } else if (['1', '2', '3'].includes(str)) {
    bgClass = 'bg-slate-700/60 text-slate-100 border border-slate-600/50';
  }

  const sizeClass = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full tabular-nums shrink-0 font-mono select-none ${sizeClass} ${bgClass} ${className}`}
      title={`Delivery outcome: ${str}`}
    >
      {str === '0' ? '•' : str}
    </span>
  );
};

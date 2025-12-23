import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketTickerProps {
  tesRate: number;
  sentiment: number;
  headlines: string[];
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ tesRate, sentiment, headlines }) => {
  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [headlines]);

  const getSentimentColor = () => {
    if (sentiment > 60) return 'text-green-400';
    if (sentiment < 40) return 'text-red-400';
    return 'text-amber-400';
  };

  const getSentimentLabel = () => {
    if (sentiment > 60) return 'OPTIMISTA';
    if (sentiment < 40) return 'PÁNICO';
    return 'NEUTRAL';
  };

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 p-2 flex items-center overflow-hidden whitespace-nowrap gap-6 text-xs md:text-sm font-mono z-10">
      <div className="flex items-center gap-2 px-4 border-r border-slate-800 min-w-fit">
        <Activity size={14} className="text-blue-400 animate-pulse" />
        <span className="text-slate-400">TES 2032:</span>
        <span className={`font-bold ${tesRate > 13.5 ? 'text-red-500' : 'text-green-500'}`}>
          {tesRate.toFixed(3)}%
        </span>
        {tesRate > 13.5 ? <TrendingUp size={14} className="text-red-500" /> : <TrendingDown size={14} className="text-green-500" />}
      </div>

      <div className="flex items-center gap-2 px-4 border-r border-slate-800 min-w-fit">
        <span className="text-slate-400">SENTIMIENTO:</span>
        <span className={`font-bold ${getSentimentColor()}`}>
          {getSentimentLabel()} ({sentiment.toFixed(0)})
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee inline-block text-slate-300">
          <span className="mx-4">🔴 EN VIVO:</span>
          {headlines[currentHeadline]}
          <span className="mx-8 text-slate-600">|</span>
          <span className="mx-4 italic text-slate-500">Próxima reunión FED: 2 Semanas</span>
        </div>
      </div>
    </div>
  );
};
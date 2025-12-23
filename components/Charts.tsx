import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ReferenceLine } from 'recharts';
import { GameHistoryPoint } from '../types';

interface ChartsProps {
  history: GameHistoryPoint[];
}

export const Charts: React.FC<ChartsProps> = ({ history }) => {
  // We only show the last 20 weeks to keep the "Real Time" feel readable, or all if short
  const visibleHistory = history.length > 20 ? history.slice(history.length - 20) : history;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Deuda vs Aprobación (Tiempo Real)</h4>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] text-red-400">LIVE</span>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="dateStr" stroke="#94a3b8" fontSize={10} interval="preserveStartEnd" />
              <YAxis yAxisId="left" stroke="#ef4444" fontSize={10} domain={['auto', 'auto']} />
              <YAxis yAxisId="right" orientation="right" stroke="#fbbf24" fontSize={10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#334155', color: '#f1f5f9', backdropFilter: 'blur(4px)' }}
                itemStyle={{ fontSize: 12 }}
                labelStyle={{ color: '#94a3b8', fontSize: 10, marginBottom: 5 }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="debt" 
                name="Deuda %" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="approval" 
                name="Aprobación %" 
                stroke="#fbbf24" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Liquidez de la Nación</h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visibleHistory}>
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="dateStr" stroke="#94a3b8" fontSize={10} interval="preserveStartEnd" />
              <YAxis stroke="#60a5fa" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#334155', color: '#f1f5f9', backdropFilter: 'blur(4px)' }}
                formatter={(value: number) => [`$${value.toFixed(2)} B`, 'Caja']}
              />
              <ReferenceLine y={1.0} stroke="red" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Alerta', fill: 'red', fontSize: 10 }} />
              <Area 
                type="monotone" 
                dataKey="cash" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorCash)" 
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
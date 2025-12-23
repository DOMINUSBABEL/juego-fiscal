import React, { useState } from 'react';
import { ActionCardProps } from '../types';
import { Briefcase, TrendingUp, AlertTriangle, Coins, Landmark, Gavel, Clock } from 'lucide-react';

const ActionButton: React.FC<ActionCardProps> = ({ title, description, cost, benefit, risk, duration, onExecute, disabled, color }) => {
  const colorStyles = {
    blue: 'border-l-4 border-blue-500 hover:bg-slate-700/80',
    red: 'border-l-4 border-red-500 hover:bg-slate-700/80',
    amber: 'border-l-4 border-amber-500 hover:bg-slate-700/80',
    green: 'border-l-4 border-green-500 hover:bg-slate-700/80',
    purple: 'border-l-4 border-purple-500 hover:bg-slate-700/80',
  };

  return (
    <button
      onClick={onExecute}
      disabled={disabled}
      className={`w-full text-left bg-slate-800 p-4 rounded-r-lg mb-3 transition-all relative group ${colorStyles[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:translate-x-1'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-white text-sm md:text-base">{title}</h4>
        {disabled && <span className="text-xs bg-slate-600 px-2 py-0.5 rounded text-white">No Disponible</span>}
      </div>
      <p className="text-xs text-slate-300 mb-3">{description}</p>
      
      <div className="grid grid-cols-2 gap-2 text-[10px] md:text-xs">
        {benefit && <div className="text-green-400 font-medium">Beneficio: {benefit}</div>}
        {cost && <div className="text-blue-300">Costo: {cost}</div>}
        {risk && <div className="text-red-400 col-span-2">Riesgo: {risk}</div>}
      </div>
      
      {duration && (
        <div className="absolute top-2 right-2 opacity-50 text-[10px] flex items-center gap-1">
          <Clock size={10} /> {duration}
        </div>
      )}
    </button>
  );
};

interface ActionPanelProps {
  onAction: (actionType: string) => void;
  isProcessing: boolean;
  canIssueDebt: boolean;
  canDeclareEmergency: boolean;
  canPrivatize: boolean;
  politicalCapital: number;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onAction, isProcessing, canIssueDebt, canDeclareEmergency, canPrivatize, politicalCapital }) => {
  const [activeTab, setActiveTab] = useState<'fiscal' | 'monetary' | 'political'>('fiscal');

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-4">
        <button 
          onClick={() => setActiveTab('fiscal')}
          className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'fiscal' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Briefcase size={16} /> Fiscal
        </button>
        <button 
          onClick={() => setActiveTab('monetary')}
          className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'monetary' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Coins size={16} /> Monetario
        </button>
        <button 
          onClick={() => setActiveTab('political')}
          className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'political' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Gavel size={16} /> Político
        </button>
      </div>
      
      <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'fiscal' && (
          <>
             <ActionButton
              title="Decreto de Austeridad"
              description="Congelar nómina estatal y recortar inversión en ministerios no esenciales."
              benefit="+1.5B Ahorro"
              cost="-3% Crecimiento PIB"
              risk="-5% Aprobación Social"
              duration="2 Semanas"
              color="red"
              onExecute={() => onAction('austerity')}
              disabled={isProcessing}
            />
            <ActionButton
              title="Venta de Activos (Ecopetrol/ISA)"
              description="Privatizar participación estatal en empresas estratégicas."
              benefit="+10.0B Caja (Instantáneo)"
              cost="-1.0% PIB (Permanente)"
              risk="Huelga General y Soberanía"
              duration="4 Semanas"
              color="amber"
              onExecute={() => onAction('privatize')}
              disabled={isProcessing || !canPrivatize}
            />
            <ActionButton
              title="Reforma Tributaria Estructural"
              description="Presentar ley para aumentar base gravable y renta a empresas."
              benefit="+20.0B (Largo Plazo)"
              cost="-15% Aprobación Inmediata"
              risk="Bloqueo en el Congreso"
              duration="8 Semanas"
              color="green"
              onExecute={() => onAction('tax_reform')}
              disabled={isProcessing || politicalCapital < 40}
            />
          </>
        )}

        {activeTab === 'monetary' && (
          <>
            <ActionButton
              title="Emitir Bonos TES (Corto Plazo)"
              description="Endeudamiento interno rápido para cubrir el mes."
              benefit="+3.0B Caja"
              cost="+ Deuda, + Tasas"
              risk="Crowding Out"
              duration="1 Semana"
              color="blue"
              onExecute={() => onAction('issue_debt')}
              disabled={isProcessing || !canIssueDebt}
            />
             <ActionButton
              title="Gestión de Liquidez"
              description="Movimientos de tesorería rutinarios (swaps)."
              benefit="Estabilidad Temporal"
              cost="-0.5% Reservas"
              duration="3 Días"
              color="blue"
              onExecute={() => onAction('liquidity')}
              disabled={isProcessing}
            />
          </>
        )}

        {activeTab === 'political' && (
          <>
            <ActionButton
              title="Emergencia Económica"
              description="Gobernar por decreto sin el Congreso."
              benefit="Poder Total Temporal"
              risk="Fallo Corte Constitucional (-20 Estabilidad)"
              duration="Inmediato"
              color="purple"
              onExecute={() => onAction('emergency')}
              disabled={isProcessing || !canDeclareEmergency}
            />
             <ActionButton
              title="Inversión Social de Choque"
              description="Subsidios directos a poblaciones vulnerables."
              benefit="+10% Aprobación"
              cost="-2.0B Caja"
              risk="Aumenta Hueco Fiscal"
              duration="2 Semanas"
              color="green"
              onExecute={() => onAction('social_investment')}
              disabled={isProcessing || politicalCapital > 80}
            />
          </>
        )}
      </div>
    </div>
  );
};
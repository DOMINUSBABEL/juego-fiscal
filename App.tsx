import React, { useState, useEffect, useRef } from 'react';
import { GameState, GamePhase, GameHistoryPoint } from './types';
import { INITIAL_STATE, NEWS_HEADLINES } from './constants';
import { MetricCard } from './components/MetricCard';
import { ActionPanel } from './components/ActionPanel';
import { Charts } from './components/Charts';
import { MarketTicker } from './components/MarketTicker';
import { getAdvisorInsight } from './services/geminiService';
import { BrainCircuit, RotateCcw, TrendingDown, AlertOctagon, Briefcase, Calendar, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.START);
  const [advisorMessage, setAdvisorMessage] = useState<string>("Ministro, el mercado está nervioso. Cada semana cuenta.");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Market Noise Effect (Real-time fluctuation simulation)
  useEffect(() => {
    if (phase !== GamePhase.PLAYING) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        // Random fluctuation of TES rate and Sentiment
        const volatility = (Math.random() - 0.5) * 0.05; // Small +/- change
        const sentimentShift = (Math.random() - 0.5) * 2;
        
        // Don't change history, just current "Live" values
        return {
          ...prev,
          tesRate: Math.max(8, prev.tesRate + volatility),
          marketSentiment: Math.max(0, Math.min(100, prev.marketSentiment + sentimentShift))
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [phase]);

  // Victory/Loss Conditions
  useEffect(() => {
    if (phase === GamePhase.PLAYING) {
      if (gameState.cash <= 0.1) {
        setPhase(GamePhase.GAME_OVER);
        setFeedbackMessage("DEFAULT: El Estado no tiene liquidez para pagar la nómina.");
      } else if (gameState.debtToGDP > 75) {
        setPhase(GamePhase.GAME_OVER);
        setFeedbackMessage("CRISIS DE DEUDA: Las calificadoras bajaron la nota a 'Basura'.");
      } else if (gameState.approval < 15) {
        setPhase(GamePhase.GAME_OVER);
        setFeedbackMessage("ESTALLIDO SOCIAL: Protestas masivas fuerzan su renuncia.");
      } else if (gameState.fiscalGap <= 0 && gameState.week > 24) {
        setPhase(GamePhase.VICTORY);
        setFeedbackMessage("ESTABILIDAD: Logró cerrar el hueco fiscal y calmar los mercados.");
      }
    }
  }, [gameState.cash, gameState.debtToGDP, gameState.approval, gameState.fiscalGap, phase]);

  const handleConsultAdvisor = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    const advice = await getAdvisorInsight(gameState);
    setAdvisorMessage(advice);
    setIsAiLoading(false);
  };

  const advanceTime = (weeks: number, updates: Partial<GameState>, actionName: string) => {
    setGameState(prev => {
      const newWeek = prev.week + weeks;
      const newDate = new Date(prev.date);
      newDate.setDate(newDate.getDate() + (weeks * 7));
      
      const monthStr = newDate.toLocaleString('es-ES', { month: 'short' });
      const dateStr = `${monthStr} W${Math.ceil(newDate.getDate() / 7)}`;

      // Calculate time-based degradation
      const weeklyBurn = 0.125; // approx 0.5 per month
      const totalBurn = weeklyBurn * weeks;

      let newCash = prev.cash - totalBurn;
      let newFiscalGap = prev.fiscalGap;
      let newDebt = prev.debtToGDP;
      let newApproval = prev.approval;
      let newTesRate = prev.tesRate;
      let newGrowth = prev.gdpGrowth;
      let newSentiment = prev.marketSentiment;

      // Apply specific action updates
      if (updates.cash) newCash += updates.cash;
      if (updates.fiscalGap) newFiscalGap += updates.fiscalGap;
      if (updates.debtToGDP) newDebt += updates.debtToGDP;
      if (updates.approval) newApproval += updates.approval;
      if (updates.tesRate) newTesRate += updates.tesRate;
      if (updates.gdpGrowth) newGrowth += updates.gdpGrowth;
      if (updates.marketSentiment) newSentiment += updates.marketSentiment;

      // Market Reaction Rules
      if (newDebt > 65) {
        newTesRate += 0.1 * weeks; // Debt pressure
        newSentiment -= 2 * weeks;
      }
      if (newCash < 2.0) {
        newSentiment -= 5; // Liquidity fear
      }

      // Bounds
      newCash = Math.max(0, newCash);
      newFiscalGap = Math.max(0, newFiscalGap);
      newSentiment = Math.max(0, Math.min(100, newSentiment));

      const historyEntry: GameHistoryPoint = {
        week: newWeek,
        dateStr: dateStr,
        cash: Number(newCash.toFixed(2)),
        debt: Number(newDebt.toFixed(2)),
        approval: Number(newApproval.toFixed(2)),
        tesRate: Number(newTesRate.toFixed(2))
      };

      return {
        ...prev,
        week: newWeek,
        date: newDate,
        cash: newCash,
        fiscalGap: newFiscalGap,
        debtToGDP: newDebt,
        approval: newApproval,
        inflation: prev.inflation, // Simplified for now
        tesRate: newTesRate,
        gdpGrowth: newGrowth,
        marketSentiment: newSentiment,
        history: [...prev.history, historyEntry],
        lastAction: actionName
      };
    });
  };

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'issue_debt':
        advanceTime(1, {
          cash: 3.0,
          fiscalGap: -1.0,
          debtToGDP: 1.8,
          tesRate: 0.5,
          marketSentiment: -5,
          approval: -1
        }, "Emisión TES (1 Sem)");
        break;
      
      case 'austerity':
        advanceTime(2, {
          cash: 1.5,
          fiscalGap: -1.5,
          approval: -6,
          gdpGrowth: -0.2,
          marketSentiment: 10 // Markets like austerity
        }, "Austeridad (2 Sem)");
        break;

      case 'emergency':
        const courtStrikesDown = Math.random() > 0.6;
        if (courtStrikesDown) {
           advanceTime(1, {
             approval: -10,
             cash: 0,
             marketSentiment: -20
           }, "Emergencia Fallida");
           setFeedbackMessage("¡La Corte Constitucional tumbó el decreto!");
        } else {
           advanceTime(1, {
             cash: 5.0,
             fiscalGap: -5.0,
             approval: -8,
             marketSentiment: -10 // Markets hate uncertainty
           }, "Emergencia Exitosa");
        }
        break;

      case 'liquidity':
        advanceTime(0.5, { // 3 days
           cash: 0.2,
           approval: 0.5,
           marketSentiment: 2
        }, "Gestión Liquidez");
        break;

      case 'privatize':
        advanceTime(4, {
          cash: 10.0,
          debtToGDP: -2.0,
          gdpGrowth: -1.0, // Long term loss
          approval: -15, // Highly unpopular
          marketSentiment: 20 // Investors love it
        }, "Venta Activos (4 Sem)");
        break;

      case 'tax_reform':
        advanceTime(8, {
          fiscalGap: -8.0, // Solves structural issue
          approval: -12, // People hate taxes
          gdpGrowth: -0.5,
          marketSentiment: 15 // Fiscal responsibility
        }, "Reforma Tributaria (8 Sem)");
        break;
        
      case 'social_investment':
        advanceTime(2, {
          cash: -2.0,
          approval: 12,
          marketSentiment: -5 // Spending scares investors
        }, "Inv. Social (2 Sem)");
        break;
    }
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    setPhase(GamePhase.PLAYING);
    setFeedbackMessage(null);
    setAdvisorMessage("Año Nuevo, Presupuesto Nuevo. Los mercados esperan señales claras.");
  };

  if (phase === GamePhase.START) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950"></div>
        
        <div className="max-w-3xl w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-10 shadow-2xl text-center relative z-10">
          <div className="inline-block p-4 rounded-full bg-amber-500/10 mb-6">
            <AlertOctagon size={48} className="text-amber-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 mb-6">
            La Encrucijada 2026
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed font-light">
            El hueco fiscal es de <strong className="text-red-400">$16.3 billones</strong>. 
            Los mercados están al borde del pánico.
            Usted asume el control del Ministerio de Hacienda semana a semana.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm text-slate-400">
             <div className="bg-slate-800 p-3 rounded">
                <Clock className="mx-auto mb-2 text-blue-400" />
                <span className="block font-bold text-white">Tiempo Real</span>
                Gestiona semanas y meses
             </div>
             <div className="bg-slate-800 p-3 rounded">
                <TrendingDown className="mx-auto mb-2 text-red-400" />
                <span className="block font-bold text-white">Mercados Vivos</span>
                El TES fluctúa constantemente
             </div>
             <div className="bg-slate-800 p-3 rounded">
                <BrainCircuit className="mx-auto mb-2 text-purple-400" />
                <span className="block font-bold text-white">IA Advisor</span>
                Consultoría estratégica
             </div>
          </div>
          <button 
            onClick={() => setPhase(GamePhase.PLAYING)}
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-1"
          >
            Juramentar Cargo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Real-time Ticker */}
      <MarketTicker 
        tesRate={gameState.tesRate} 
        sentiment={gameState.marketSentiment} 
        headlines={NEWS_HEADLINES} 
      />

      {/* Main Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 md:px-8 shadow-md z-10 sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
               <Briefcase size={24} className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-slate-100 leading-tight">Ministerio de Hacienda</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Sistema Financiero: ONLINE
              </div>
            </div>
          </div>
          
          {/* Time Control Display */}
          <div className="flex items-stretch gap-4 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700 backdrop-blur-sm">
            <div className="px-4 py-1 flex flex-col items-center justify-center border-r border-slate-600/50">
               <span className="text-[10px] uppercase text-slate-400 font-bold">Semana</span>
               <span className="text-xl font-mono text-white">{gameState.week}</span>
            </div>
            <div className="px-4 py-1 flex flex-col items-center justify-center">
               <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1">
                 <Calendar size={10} /> Fecha
               </span>
               <span className="text-lg font-serif text-amber-100">
                 {gameState.date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
               </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Stats & Charts */}
        <div className="md:col-span-8 space-y-6">
          
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              label="Hueco Fiscal" 
              value={`$${gameState.fiscalGap.toFixed(1)}B`} 
              subtext="Meta: $0"
              color="danger"
            />
            <MetricCard 
              label="Caja (Liquidez)" 
              value={`$${gameState.cash.toFixed(1)}B`} 
              subtext={gameState.cash < 2.0 ? "CRÍTICO" : "Estable"}
              color={gameState.cash < 2.0 ? "danger" : "default"}
              trend={gameState.cash > 2.0 ? 'up' : 'down'}
            />
             <MetricCard 
              label="Deuda Pública" 
              value={`${gameState.debtToGDP.toFixed(1)}%`} 
              subtext="Límite: 75%"
              trend="up"
            />
            <MetricCard 
              label="Aprobación" 
              value={`${gameState.approval.toFixed(1)}%`} 
              subtext="Capital Político"
              color={gameState.approval < 30 ? "danger" : "success"}
            />
          </div>

          {/* Interactive Charts */}
          <Charts history={gameState.history} />
          
          {/* Feedback Messages */}
          {(phase === GamePhase.GAME_OVER || phase === GamePhase.VICTORY) && (
            <div className={`p-6 rounded-xl border-2 shadow-2xl ${phase === GamePhase.VICTORY ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}>
              <h2 className="text-3xl font-serif font-bold mb-3 flex items-center gap-3">
                {phase === GamePhase.VICTORY ? <Briefcase className="text-green-500" size={32} /> : <AlertOctagon className="text-red-500" size={32} />}
                {phase === GamePhase.VICTORY ? "Objetivo Cumplido" : "Fin del Gobierno"}
              </h2>
              <p className="text-lg mb-6 text-slate-200">{feedbackMessage}</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-all font-semibold"
              >
                <RotateCcw size={18} /> Nueva Legislatura
              </button>
            </div>
          )}

           {/* Toast/Notification Area */}
           {phase === GamePhase.PLAYING && feedbackMessage && (
            <div className="p-4 bg-slate-800/90 border-l-4 border-amber-500 text-slate-200 shadow-lg rounded-r flex items-start gap-3 animate-fade-in-up">
               <AlertOctagon className="text-amber-500 shrink-0 mt-1" size={20} />
               <div>
                 <strong className="text-amber-500 block text-sm uppercase mb-1">Reporte de Inteligencia</strong>
                 {feedbackMessage}
               </div>
            </div>
          )}

        </div>

        {/* Right Column: Actions & AI */}
        <div className="md:col-span-4 space-y-6">
          
          {/* AI Advisor Card - Glassmorphism */}
          <div className="bg-slate-800/60 backdrop-blur-md border border-indigo-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={80} className="text-indigo-400" />
            </div>
            <h3 className="text-indigo-300 font-serif font-bold mb-2 flex items-center gap-2">
              <BrainCircuit size={18} className="animate-pulse" />
              Asesoría IA (Gemini)
            </h3>
            <p className="text-sm text-indigo-100 italic mb-4 min-h-[60px] leading-relaxed">
              "{advisorMessage}"
            </p>
            <button
              onClick={handleConsultAdvisor}
              disabled={isAiLoading || phase !== GamePhase.PLAYING}
              className={`w-full py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${isAiLoading ? 'bg-slate-700 text-slate-400' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg hover:shadow-indigo-500/30'}`}
            >
              {isAiLoading ? "Procesando Datos..." : "Consultar Estrategia"}
            </button>
          </div>

          {/* Action Center */}
          {phase === GamePhase.PLAYING && (
            <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
              <ActionPanel 
                onAction={handleAction} 
                isProcessing={false}
                canIssueDebt={gameState.debtToGDP < 75}
                canDeclareEmergency={gameState.approval > 25}
                canPrivatize={gameState.approval > 40}
                politicalCapital={gameState.approval}
              />
            </div>
          )}

          {/* Static Info */}
          <div className="bg-slate-900 p-4 rounded-lg text-xs text-slate-500 border border-slate-800">
            <h4 className="font-bold text-slate-400 mb-2 flex items-center gap-2">
              <TrendingDown size={14} /> Tasa de Cambio (TRM)
            </h4>
            <div className="flex justify-between items-center">
               <span>$4,150 COP</span>
               <span className="text-red-400">+12.5 (0.3%)</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
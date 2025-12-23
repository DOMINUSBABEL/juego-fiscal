import { GameState } from './types';

export const INITIAL_DATE = new Date(2026, 0, 1); // Jan 1, 2026

export const INITIAL_STATE: GameState = {
  week: 1,
  date: INITIAL_DATE,
  cash: 1.4,
  fiscalGap: 16.3,
  debtToGDP: 61.3,
  approval: 45,
  inflation: 5.3,
  interestRate: 9.25,
  tesRate: 13.15,
  gdpGrowth: 2.7,
  marketSentiment: 50, // Neutral start
  history: [{ 
    week: 1, 
    dateStr: "Ene W1", 
    cash: 1.4, 
    debt: 61.3, 
    approval: 45,
    tesRate: 13.15 
  }],
  events: [],
  lastAction: null,
};

export const NEWS_HEADLINES = [
  "Riesgo país sube levemente tras declaraciones del Ministro.",
  "Inversionistas atentos a la decisión de la Corte Constitucional.",
  "Dólar abre al alza en jornada volátil.",
  "Sindicatos anuncian movilizaciones si hay recortes.",
  "JP Morgan advierte sobre la liquidez de Colombia.",
  "Banco de la República mantiene tasas estables.",
  "Ecopetrol reporta caída en producción de barriles.",
  "Fenalco pide medidas de reactivación económica inmediata."
];
export type CalculatorMode = 'basic' | 'scientific' | 'programmer' | 'graphing' | 'financial';

export type Theme = 'light' | 'dark';

export type NumberBase = 'binary' | 'octal' | 'decimal' | 'hexadecimal';

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  mode: CalculatorMode;
}

export interface MemorySlot {
  value: number;
  label?: string;
}

export interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

export interface UnitConversion {
  category: string;
  from: string;
  to: string;
  value: number;
}

export interface FinancialCalculation {
  type: 'loan' | 'compound_interest' | 'simple_interest' | 'roi' | 'depreciation';
  inputs: Record<string, number>;
  result?: number;
}

declare global {
  interface Window {
    electron: {
      onSwitchMode: (callback: (mode: string) => void) => void;
      onToggleTheme: (callback: () => void) => void;
    };
  }
}

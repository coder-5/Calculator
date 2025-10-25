export const CALCULATOR_MODES = {
  BASIC: 'basic' as const,
  SCIENTIFIC: 'scientific' as const,
  PROGRAMMER: 'programmer' as const,
  GRAPHING: 'graphing' as const,
  FINANCIAL: 'financial' as const,
};

export const THEMES = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
};

export const NUMBER_BASES = {
  BINARY: 'binary' as const,
  OCTAL: 'octal' as const,
  DECIMAL: 'decimal' as const,
  HEXADECIMAL: 'hexadecimal' as const,
};

export const UNIT_CATEGORIES = [
  'Length',
  'Weight',
  'Temperature',
  'Volume',
  'Area',
  'Speed',
  'Time',
  'Energy',
  'Power',
  'Pressure',
] as const;

export const STORAGE_KEYS = {
  THEME: 'calculator-theme',
  HISTORY: 'calculator-history',
  MEMORY: 'calculator-memory',
  LAST_MODE: 'calculator-last-mode',
} as const;

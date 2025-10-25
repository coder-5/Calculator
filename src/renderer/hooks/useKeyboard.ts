import { useEffect } from 'react';

interface KeyboardHandlers {
  onDigit?: (digit: string) => void;
  onOperator?: (operator: string) => void;
  onEquals?: () => void;
  onClear?: () => void;
  onBackspace?: () => void;
  onDecimal?: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // Prevent default for calculator keys
      if (/^[0-9+\-*/.=]$/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
      }

      // Digits
      if (/^[0-9]$/.test(key) && handlers.onDigit) {
        handlers.onDigit(key);
      }

      // Operators
      if (['+', '-', '*', '/'].includes(key) && handlers.onOperator) {
        handlers.onOperator(key);
      }

      // Decimal point
      if (key === '.' && handlers.onDecimal) {
        handlers.onDecimal();
      }

      // Equals
      if ((key === '=' || key === 'Enter') && handlers.onEquals) {
        handlers.onEquals();
      }

      // Clear
      if (key === 'Escape' && handlers.onClear) {
        handlers.onClear();
      }

      // Backspace
      if (key === 'Backspace' && handlers.onBackspace) {
        handlers.onBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}

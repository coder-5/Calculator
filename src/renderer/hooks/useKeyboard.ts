import { useEffect } from 'react';

interface KeyboardHandlers {
  onDigit?: (digit: string) => void;
  onOperator?: (operator: string) => void;
  onEquals?: () => void;
  onClear?: () => void;
  onBackspace?: () => void;
  onDecimal?: () => void;
  onPercentage?: () => void;
  onSquareRoot?: () => void;
  onSquare?: () => void;
  onNegate?: () => void;
  onReciprocal?: () => void;
  onMemoryClear?: () => void;
  onMemoryRecall?: () => void;
  onMemoryStore?: () => void;
  onMemoryAdd?: () => void;
  onMemorySubtract?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onFunction?: (func: string) => void;
  onParenthesis?: (paren: string) => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, altKey } = event;

      // Memory shortcuts (Ctrl + key)
      if (ctrlKey && !shiftKey && !altKey) {
        switch (key.toLowerCase()) {
          case 'l':
            event.preventDefault();
            handlers.onMemoryClear?.();
            return;
          case 'r':
            event.preventDefault();
            handlers.onMemoryRecall?.();
            return;
          case 'm':
            event.preventDefault();
            handlers.onMemoryStore?.();
            return;
          case 'p':
            event.preventDefault();
            handlers.onMemoryAdd?.();
            return;
          case 'q':
            event.preventDefault();
            handlers.onMemorySubtract?.();
            return;
          case 'c':
            event.preventDefault();
            handlers.onCopy?.();
            return;
          case 'v':
            event.preventDefault();
            handlers.onPaste?.();
            return;
        }
      }

      // Scientific function shortcuts (Alt + key)
      if (altKey && !ctrlKey && !shiftKey && handlers.onFunction) {
        switch (key.toLowerCase()) {
          case 's':
            event.preventDefault();
            handlers.onFunction('sin');
            return;
          case 'c':
            event.preventDefault();
            handlers.onFunction('cos');
            return;
          case 't':
            event.preventDefault();
            handlers.onFunction('tan');
            return;
          case 'l':
            event.preventDefault();
            handlers.onFunction('log');
            return;
          case 'n':
            event.preventDefault();
            handlers.onFunction('ln');
            return;
          case 'e':
            event.preventDefault();
            handlers.onFunction('exp');
            return;
          case 'p':
            event.preventDefault();
            handlers.onFunction('pi');
            return;
          case 'r':
            event.preventDefault();
            handlers.onFunction('sqrt');
            return;
        }
      }

      // Prevent default for calculator keys
      if (/^[0-9+\-*/.=()%@!^]$/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
      }

      // Digits and hex digits (A-F)
      if (/^[0-9A-Fa-f]$/.test(key) && handlers.onDigit) {
        handlers.onDigit(key.toUpperCase());
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

      // Percentage
      if (key === '%' && handlers.onPercentage) {
        handlers.onPercentage();
      }

      // Square root (@)
      if (key === '@' && handlers.onSquareRoot) {
        handlers.onSquareRoot();
      }

      // Square (Shift + 2 gives @, but let's use # for square)
      if (key === '#' && handlers.onSquare) {
        handlers.onSquare();
      }

      // Power (^)
      if (key === '^' && handlers.onFunction) {
        handlers.onFunction('^');
      }

      // Factorial (!)
      if (key === '!' && handlers.onFunction) {
        handlers.onFunction('!');
      }

      // Negate (F9 or Ctrl+-)
      if ((key === 'F9' || (ctrlKey && key === '-')) && handlers.onNegate) {
        event.preventDefault();
        handlers.onNegate();
      }

      // Reciprocal (Ctrl+/)
      if (ctrlKey && key === '/' && handlers.onReciprocal) {
        event.preventDefault();
        handlers.onReciprocal();
      }

      // Parentheses
      if ((key === '(' || key === ')') && handlers.onParenthesis) {
        handlers.onParenthesis(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}

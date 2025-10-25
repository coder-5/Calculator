import { useState, useCallback } from 'react';
import { BasicCalculatorEngine } from '../../engines/basicEngine';
import { HistoryEntry } from '../../../shared/types';
import { useKeyboard } from '../../hooks/useKeyboard';
import './BasicCalculator.css';

interface BasicCalculatorProps {
  onAddToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  memory: any;
}

const engine = new BasicCalculatorEngine();

function BasicCalculator({ onAddToHistory, memory }: BasicCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [error, setError] = useState('');

  const handleDigit = useCallback((digit: string) => {
    setError('');
    const result = engine.inputDigit(digit);
    setDisplay(result);
    setExpression(engine.getExpression());
  }, []);

  const handleDecimal = useCallback(() => {
    setError('');
    const result = engine.inputDecimal();
    setDisplay(result);
  }, []);

  const handleClear = useCallback(() => {
    setError('');
    const result = engine.clear();
    setDisplay(result);
    setExpression('');
  }, []);

  const handleOperator = useCallback((operator: string) => {
    setError('');
    try {
      const result = engine.performOperation(operator);
      setDisplay(result);
      setExpression(engine.getExpression());
    } catch (err: any) {
      setError(err.message);
      // Reset calculator state to prevent inconsistency
      handleClear();
    }
  }, [handleClear]);

  const handleEquals = useCallback(() => {
    setError('');
    try {
      const result = engine.performOperation('=');
      setDisplay(result);

      onAddToHistory({
        expression: expression || display,
        result: result,
        mode: 'basic',
      });

      setExpression('');
    } catch (err: any) {
      setError(err.message);
    }
  }, [expression, display, onAddToHistory]);

  const handleClearEntry = useCallback(() => {
    setError('');
    const result = engine.clearEntry();
    setDisplay(result);
  }, []);

  const handlePercentage = useCallback(() => {
    setError('');
    try {
      const result = engine.percentage();
      setDisplay(result);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const handleSquareRoot = useCallback(() => {
    setError('');
    try {
      const result = engine.squareRoot();
      setDisplay(result);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const handleSquare = useCallback(() => {
    setError('');
    try {
      const result = engine.square();
      setDisplay(result);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const handleNegate = useCallback(() => {
    setError('');
    const result = engine.negate();
    setDisplay(result);
  }, []);

  const handleBackspace = useCallback(() => {
    setError('');
    const currentValue = engine.getCurrentValue();
    if (currentValue.length > 1) {
      const newValue = currentValue.slice(0, -1);
      const result = engine.inputDigit(newValue);
      setDisplay(result);
    } else {
      handleClearEntry();
    }
  }, [handleClearEntry]);

  // Keyboard support
  useKeyboard({
    onDigit: handleDigit,
    onOperator: handleOperator,
    onEquals: handleEquals,
    onClear: handleClear,
    onBackspace: handleBackspace,
    onDecimal: handleDecimal,
    onPercentage: handlePercentage,
    onSquareRoot: handleSquareRoot,
    onSquare: handleSquare,
    onNegate: handleNegate,
    onReciprocal: () => handleOperator('1/x'),
    onMemoryClear: handleMemoryClear,
    onMemoryRecall: handleMemoryRecall,
    onMemoryStore: handleMemoryStore,
    onMemoryAdd: handleMemoryAdd,
    onMemorySubtract: handleMemorySubtract,
    onCopy: handleCopy,
    onPaste: handlePaste,
  });

  // Memory functions
  const handleMemoryClear = () => memory.memoryClear();
  const handleMemoryRecall = () => {
    const value = memory.memoryRecall();
    setDisplay(value.toString());
  };
  const handleMemoryAdd = () => memory.memoryAdd(parseFloat(display));
  const handleMemorySubtract = () => memory.memorySubtract(parseFloat(display));
  const handleMemoryStore = () => memory.memoryStore(parseFloat(display));

  // Copy/Paste support
  const handleCopy = () => {
    navigator.clipboard.writeText(display);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const num = parseFloat(text);
      if (!isNaN(num)) {
        setDisplay(num.toString());
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  return (
    <div className="basic-calculator" role="region" aria-label="Basic calculator">
      <div className="calculator-display-area" role="status" aria-live="polite" aria-atomic="true">
        {expression && <div className="expression" aria-label="Expression">{expression}</div>}
        <div className="display" aria-label="Calculator display">{error || display}</div>
        {error && <div className="error-indicator" role="alert">Error</div>}
      </div>

      <div className="calculator-controls">
        <button className="control-btn" onClick={handleCopy} title="Copy" aria-label="Copy result to clipboard">📋</button>
        <button className="control-btn" onClick={handlePaste} title="Paste" aria-label="Paste from clipboard">📄</button>
      </div>

      <div className="calculator-memory" role="group" aria-label="Memory functions">
        <button onClick={handleMemoryClear} disabled={!memory.hasMemory} aria-label="Memory clear">MC</button>
        <button onClick={handleMemoryRecall} disabled={!memory.hasMemory} aria-label="Memory recall">MR</button>
        <button onClick={handleMemoryStore} aria-label="Memory store">MS</button>
        <button onClick={handleMemoryAdd} aria-label="Memory add">M+</button>
        <button onClick={handleMemorySubtract} aria-label="Memory subtract">M-</button>
      </div>

      <div className="calculator-buttons" role="group" aria-label="Calculator buttons">
        <button className="btn-function" onClick={handlePercentage} aria-label="Percentage">%</button>
        <button className="btn-function" onClick={handleClearEntry} aria-label="Clear entry">CE</button>
        <button className="btn-function" onClick={handleClear} aria-label="Clear all">C</button>
        <button className="btn-function" onClick={handleBackspace} aria-label="Backspace">⌫</button>

        <button className="btn-function" onClick={() => handleOperator('1/x')} aria-label="Reciprocal">1/x</button>
        <button className="btn-function" onClick={handleSquare} aria-label="Square">x²</button>
        <button className="btn-function" onClick={handleSquareRoot} aria-label="Square root">√</button>
        <button className="btn-operator" onClick={() => handleOperator('/')} aria-label="Divide">÷</button>

        <button onClick={() => handleDigit('7')} aria-label="Seven">7</button>
        <button onClick={() => handleDigit('8')} aria-label="Eight">8</button>
        <button onClick={() => handleDigit('9')} aria-label="Nine">9</button>
        <button className="btn-operator" onClick={() => handleOperator('*')} aria-label="Multiply">×</button>

        <button onClick={() => handleDigit('4')} aria-label="Four">4</button>
        <button onClick={() => handleDigit('5')} aria-label="Five">5</button>
        <button onClick={() => handleDigit('6')} aria-label="Six">6</button>
        <button className="btn-operator" onClick={() => handleOperator('-')} aria-label="Subtract">−</button>

        <button onClick={() => handleDigit('1')} aria-label="One">1</button>
        <button onClick={() => handleDigit('2')} aria-label="Two">2</button>
        <button onClick={() => handleDigit('3')} aria-label="Three">3</button>
        <button className="btn-operator" onClick={() => handleOperator('+')} aria-label="Add">+</button>

        <button className="btn-negate" onClick={handleNegate} aria-label="Negate">+/−</button>
        <button onClick={() => handleDigit('0')} aria-label="Zero">0</button>
        <button onClick={handleDecimal} aria-label="Decimal point">.</button>
        <button className="btn-equals" onClick={handleEquals} aria-label="Equals">=</button>
      </div>
    </div>
  );
}

export default BasicCalculator;

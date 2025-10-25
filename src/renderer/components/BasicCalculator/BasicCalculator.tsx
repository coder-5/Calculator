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
      engine.inputDigit(newValue);
      setDisplay(newValue);
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
    <div className="basic-calculator">
      <div className="calculator-display-area">
        {expression && <div className="expression">{expression}</div>}
        <div className="display">{error || display}</div>
        {error && <div className="error-indicator">Error</div>}
      </div>

      <div className="calculator-controls">
        <button className="control-btn" onClick={handleCopy} title="Copy">📋</button>
        <button className="control-btn" onClick={handlePaste} title="Paste">📄</button>
      </div>

      <div className="calculator-memory">
        <button onClick={handleMemoryClear} disabled={!memory.hasMemory}>MC</button>
        <button onClick={handleMemoryRecall} disabled={!memory.hasMemory}>MR</button>
        <button onClick={handleMemoryStore}>MS</button>
        <button onClick={handleMemoryAdd}>M+</button>
        <button onClick={handleMemorySubtract}>M-</button>
      </div>

      <div className="calculator-buttons">
        <button className="btn-function" onClick={handlePercentage}>%</button>
        <button className="btn-function" onClick={handleClearEntry}>CE</button>
        <button className="btn-function" onClick={handleClear}>C</button>
        <button className="btn-function" onClick={handleBackspace}>⌫</button>

        <button className="btn-function" onClick={() => handleOperator('1/x')}>1/x</button>
        <button className="btn-function" onClick={handleSquare}>x²</button>
        <button className="btn-function" onClick={handleSquareRoot}>√</button>
        <button className="btn-operator" onClick={() => handleOperator('/')}>÷</button>

        <button onClick={() => handleDigit('7')}>7</button>
        <button onClick={() => handleDigit('8')}>8</button>
        <button onClick={() => handleDigit('9')}>9</button>
        <button className="btn-operator" onClick={() => handleOperator('*')}>×</button>

        <button onClick={() => handleDigit('4')}>4</button>
        <button onClick={() => handleDigit('5')}>5</button>
        <button onClick={() => handleDigit('6')}>6</button>
        <button className="btn-operator" onClick={() => handleOperator('-')}>−</button>

        <button onClick={() => handleDigit('1')}>1</button>
        <button onClick={() => handleDigit('2')}>2</button>
        <button onClick={() => handleDigit('3')}>3</button>
        <button className="btn-operator" onClick={() => handleOperator('+')}>+</button>

        <button className="btn-negate" onClick={handleNegate}>+/−</button>
        <button onClick={() => handleDigit('0')}>0</button>
        <button onClick={handleDecimal}>.</button>
        <button className="btn-equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

export default BasicCalculator;

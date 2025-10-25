import { useState, useCallback } from 'react';
import { ScientificCalculatorEngine } from '../../engines/scientificEngine';
import { HistoryEntry } from '../../../shared/types';
import {
  sanitizeMathExpression,
  isValidMathExpression,
  limitInputLength
} from '../../utils/validation';
import './ScientificCalculator.css';

interface ScientificCalculatorProps {
  onAddToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  memory: any;
}

const engine = new ScientificCalculatorEngine();

function ScientificCalculator({ onAddToHistory, memory }: ScientificCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [error, setError] = useState('');

  const handleInput = useCallback((value: string) => {
    setError('');
    const newExpression = (expression + value);
    const limited = limitInputLength(newExpression, 100);

    if (display === '0' && value !== '.') {
      setDisplay(value);
      setExpression(limited);
    } else {
      setDisplay(display + value);
      setExpression(limited);
    }
  }, [display, expression]);

  const handleFunction = useCallback((func: string) => {
    setError('');
    let newExpression = expression;

    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
      case 'log':
      case 'ln':
      case 'sqrt':
      case 'cbrt':
      case 'abs':
        newExpression += `${func}(`;
        break;
      case 'pi':
        newExpression += 'pi';
        setDisplay(Math.PI.toString());
        break;
      case 'e':
        newExpression += 'e';
        setDisplay(Math.E.toString());
        break;
      case 'exp':
        newExpression += 'exp(';
        break;
      case '^':
        newExpression += '^';
        break;
      case '!':
        newExpression += '!';
        break;
      default:
        newExpression += func;
    }

    setExpression(newExpression);
  }, [expression]);

  const handleEquals = useCallback(() => {
    setError('');
    try {
      // Sanitize and validate the expression
      const sanitized = sanitizeMathExpression(expression);

      if (!isValidMathExpression(sanitized)) {
        setError('Invalid mathematical expression');
        return;
      }

      const result = engine.evaluate(sanitized);
      setDisplay(result.toString());

      onAddToHistory({
        expression: expression,
        result: result.toString(),
        mode: 'scientific',
      });

      setExpression(result.toString());
    } catch (err: any) {
      setError(err.message);
    }
  }, [expression, onAddToHistory]);

  const handleClear = useCallback(() => {
    setError('');
    setDisplay('0');
    setExpression('');
  }, []);

  const handleBackspace = useCallback(() => {
    setError('');
    if (expression.length > 0) {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      setDisplay(newExpression || '0');
    }
  }, [expression]);

  const toggleAngleMode = () => {
    setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
  };

  // Memory functions
  const handleMemoryClear = () => memory.memoryClear();
  const handleMemoryRecall = () => {
    const value = memory.memoryRecall();
    handleInput(value.toString());
  };
  const handleMemoryAdd = () => {
    try {
      const value = parseFloat(display);
      memory.memoryAdd(value);
    } catch (err) {
      setError('Invalid number');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
  };

  return (
    <div className="scientific-calculator">
      <div className="calculator-display-area">
        {expression && <div className="expression">{expression}</div>}
        <div className="display">{error || display}</div>
        {error && <div className="error-indicator">Error</div>}
      </div>

      <div className="calculator-controls">
        <button onClick={toggleAngleMode} className="mode-indicator">
          {angleMode.toUpperCase()}
        </button>
        <button onClick={handleCopy} title="Copy">📋</button>
        <button onClick={handleMemoryClear} disabled={!memory.hasMemory}>MC</button>
        <button onClick={handleMemoryRecall} disabled={!memory.hasMemory}>MR</button>
        <button onClick={handleMemoryAdd}>M+</button>
      </div>

      <div className="scientific-buttons">
        <button className="btn-function" onClick={() => handleFunction('sin')}>sin</button>
        <button className="btn-function" onClick={() => handleFunction('cos')}>cos</button>
        <button className="btn-function" onClick={() => handleFunction('tan')}>tan</button>
        <button className="btn-function" onClick={() => handleFunction('asin')}>asin</button>
        <button className="btn-function" onClick={() => handleFunction('acos')}>acos</button>

        <button className="btn-function" onClick={() => handleFunction('atan')}>atan</button>
        <button className="btn-function" onClick={() => handleFunction('log')}>log</button>
        <button className="btn-function" onClick={() => handleFunction('ln')}>ln</button>
        <button className="btn-function" onClick={() => handleFunction('exp')}>exp</button>
        <button className="btn-function" onClick={() => handleFunction('pi')}>π</button>

        <button className="btn-function" onClick={() => handleFunction('e')}>e</button>
        <button className="btn-function" onClick={() => handleFunction('sqrt')}>√</button>
        <button className="btn-function" onClick={() => handleFunction('cbrt')}>∛</button>
        <button className="btn-function" onClick={() => handleFunction('^')}>x^y</button>
        <button className="btn-function" onClick={() => handleFunction('!')}>n!</button>

        <button className="btn-function" onClick={() => handleFunction('abs')}>|x|</button>
        <button className="btn-function" onClick={() => handleInput('(')}>(</button>
        <button className="btn-function" onClick={() => handleInput(')')}>)</button>
        <button className="btn-function" onClick={handleBackspace}>⌫</button>
        <button className="btn-function" onClick={handleClear}>C</button>

        <button onClick={() => handleInput('7')}>7</button>
        <button onClick={() => handleInput('8')}>8</button>
        <button onClick={() => handleInput('9')}>9</button>
        <button className="btn-operator" onClick={() => handleInput('/')}>÷</button>
        <button className="btn-operator" onClick={() => handleInput('*')}>×</button>

        <button onClick={() => handleInput('4')}>4</button>
        <button onClick={() => handleInput('5')}>5</button>
        <button onClick={() => handleInput('6')}>6</button>
        <button className="btn-operator" onClick={() => handleInput('-')}>−</button>
        <button className="btn-operator" onClick={() => handleInput('+')}>+</button>

        <button onClick={() => handleInput('1')}>1</button>
        <button onClick={() => handleInput('2')}>2</button>
        <button onClick={() => handleInput('3')}>3</button>
        <button onClick={() => handleInput('.')}>.</button>
        <button className="btn-equals" onClick={handleEquals}>=</button>

        <button onClick={() => handleInput('0')} style={{ gridColumn: 'span 2' }}>0</button>
      </div>
    </div>
  );
}

export default ScientificCalculator;

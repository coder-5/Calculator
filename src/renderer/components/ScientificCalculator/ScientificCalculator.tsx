import { useState, useCallback } from 'react';
import { ScientificCalculatorEngine } from '../../engines/scientificEngine';
import { HistoryEntry } from '../../../shared/types';
import {
  sanitizeMathExpression,
  isValidMathExpression,
  limitInputLength
} from '../../utils/validation';
import { useKeyboard } from '../../hooks/useKeyboard';
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleInput(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  // Keyboard support
  useKeyboard({
    onDigit: handleInput,
    onOperator: (op) => handleInput(op),
    onEquals: handleEquals,
    onClear: handleClear,
    onBackspace: handleBackspace,
    onDecimal: () => handleInput('.'),
    onFunction: handleFunction,
    onParenthesis: handleInput,
    onMemoryClear: handleMemoryClear,
    onMemoryRecall: handleMemoryRecall,
    onMemoryAdd: handleMemoryAdd,
    onCopy: handleCopy,
    onPaste: handlePaste,
  });

  return (
    <div className="scientific-calculator" role="region" aria-label="Scientific calculator">
      <div className="calculator-display-area" role="status" aria-live="polite" aria-atomic="true">
        {expression && <div className="expression" aria-label="Expression">{expression}</div>}
        <div className="display" aria-label="Calculator display">{error || display}</div>
        {error && <div className="error-indicator" role="alert">Error</div>}
      </div>

      <div className="calculator-controls" role="group" aria-label="Calculator controls">
        <button onClick={toggleAngleMode} className="mode-indicator" aria-label={`Angle mode: ${angleMode}, click to toggle`}>
          {angleMode.toUpperCase()}
        </button>
        <button onClick={handleCopy} title="Copy" aria-label="Copy result to clipboard">📋</button>
        <button onClick={handleMemoryClear} disabled={!memory.hasMemory} aria-label="Memory clear">MC</button>
        <button onClick={handleMemoryRecall} disabled={!memory.hasMemory} aria-label="Memory recall">MR</button>
        <button onClick={handleMemoryAdd} aria-label="Memory add">M+</button>
      </div>

      <div className="scientific-buttons" role="group" aria-label="Calculator buttons">
        <button className="btn-function" onClick={() => handleFunction('sin')} aria-label="Sine">sin</button>
        <button className="btn-function" onClick={() => handleFunction('cos')} aria-label="Cosine">cos</button>
        <button className="btn-function" onClick={() => handleFunction('tan')} aria-label="Tangent">tan</button>
        <button className="btn-function" onClick={() => handleFunction('asin')} aria-label="Arc sine">asin</button>
        <button className="btn-function" onClick={() => handleFunction('acos')} aria-label="Arc cosine">acos</button>

        <button className="btn-function" onClick={() => handleFunction('atan')} aria-label="Arc tangent">atan</button>
        <button className="btn-function" onClick={() => handleFunction('log')} aria-label="Logarithm base 10">log</button>
        <button className="btn-function" onClick={() => handleFunction('ln')} aria-label="Natural logarithm">ln</button>
        <button className="btn-function" onClick={() => handleFunction('exp')} aria-label="Exponential">exp</button>
        <button className="btn-function" onClick={() => handleFunction('pi')} aria-label="Pi constant">π</button>

        <button className="btn-function" onClick={() => handleFunction('e')} aria-label="Euler's number">e</button>
        <button className="btn-function" onClick={() => handleFunction('sqrt')} aria-label="Square root">√</button>
        <button className="btn-function" onClick={() => handleFunction('cbrt')} aria-label="Cube root">∛</button>
        <button className="btn-function" onClick={() => handleFunction('^')} aria-label="Power">x^y</button>
        <button className="btn-function" onClick={() => handleFunction('!')} aria-label="Factorial">n!</button>

        <button className="btn-function" onClick={() => handleFunction('abs')} aria-label="Absolute value">|x|</button>
        <button className="btn-function" onClick={() => handleInput('(')} aria-label="Left parenthesis">(</button>
        <button className="btn-function" onClick={() => handleInput(')')} aria-label="Right parenthesis">)</button>
        <button className="btn-function" onClick={handleBackspace} aria-label="Backspace">⌫</button>
        <button className="btn-function" onClick={handleClear} aria-label="Clear">C</button>

        <button onClick={() => handleInput('7')} aria-label="Seven">7</button>
        <button onClick={() => handleInput('8')} aria-label="Eight">8</button>
        <button onClick={() => handleInput('9')} aria-label="Nine">9</button>
        <button className="btn-operator" onClick={() => handleInput('/')} aria-label="Divide">÷</button>
        <button className="btn-operator" onClick={() => handleInput('*')} aria-label="Multiply">×</button>

        <button onClick={() => handleInput('4')} aria-label="Four">4</button>
        <button onClick={() => handleInput('5')} aria-label="Five">5</button>
        <button onClick={() => handleInput('6')} aria-label="Six">6</button>
        <button className="btn-operator" onClick={() => handleInput('-')} aria-label="Subtract">−</button>
        <button className="btn-operator" onClick={() => handleInput('+')} aria-label="Add">+</button>

        <button onClick={() => handleInput('1')} aria-label="One">1</button>
        <button onClick={() => handleInput('2')} aria-label="Two">2</button>
        <button onClick={() => handleInput('3')} aria-label="Three">3</button>
        <button onClick={() => handleInput('.')} aria-label="Decimal point">.</button>
        <button className="btn-equals" onClick={handleEquals} aria-label="Equals">=</button>

        <button onClick={() => handleInput('0')} style={{ gridColumn: 'span 2' }} aria-label="Zero">0</button>
      </div>
    </div>
  );
}

export default ScientificCalculator;

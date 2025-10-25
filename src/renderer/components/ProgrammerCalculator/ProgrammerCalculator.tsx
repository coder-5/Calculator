import { useState, useCallback } from 'react';
import { ProgrammerCalculatorEngine } from '../../engines/programmerEngine';
import { NumberBase, HistoryEntry } from '../../../shared/types';
import { isValidDigitForBase, limitInputLength } from '../../utils/validation';
import { useKeyboard } from '../../hooks/useKeyboard';
import './ProgrammerCalculator.css';

interface ProgrammerCalculatorProps {
  onAddToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  memory: any;
}

const engine = new ProgrammerCalculatorEngine();

function ProgrammerCalculator({ onAddToHistory }: ProgrammerCalculatorProps) {
  const [value, setValue] = useState('0');
  const [base, setBase] = useState<NumberBase>('decimal');
  const [bitWidth, setBitWidth] = useState<8 | 16 | 32 | 64>(32);
  const [pendingOperation, setPendingOperation] = useState<string | null>(null);
  const [firstOperand, setFirstOperand] = useState<string>('');

  const handleInput = useCallback((digit: string) => {
    // Validate digit for current base
    if (!isValidDigitForBase(digit, base)) {
      return;
    }

    // Limit input length to prevent overflow
    const newValue = value === '0' ? digit : value + digit;
    const limited = limitInputLength(newValue, 32);

    setValue(limited);
  }, [base, value]);

  const handleClear = useCallback(() => {
    setValue('0');
    setPendingOperation(null);
    setFirstOperand('');
  }, []);

  const handleBackspace = useCallback(() => {
    setValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  }, []);

  const handleBaseChange = useCallback((newBase: NumberBase) => {
    try {
      const converted = engine.convertBase(value, base, newBase);
      setValue(converted);
      setBase(newBase);
    } catch (err) {
      console.error('Conversion error:', err);
    }
  }, [value, base]);

  const handleBitwiseOperation = useCallback((operation: string, operand?: string) => {
    try {
      // For binary operations without a second operand, store the pending operation
      if ((operation === 'AND' || operation === 'OR' || operation === 'XOR') && !operand) {
        setPendingOperation(operation);
        setFirstOperand(value);
        setValue('0');
        return;
      }

      const decimalValue = parseInt(value, getRadix(base));
      let result: number;

      switch (operation) {
        case 'AND':
          if (operand) {
            const op = parseInt(operand, getRadix(base));
            result = engine.bitwiseAnd(decimalValue, op);
          } else return;
          break;
        case 'OR':
          if (operand) {
            const op = parseInt(operand, getRadix(base));
            result = engine.bitwiseOr(decimalValue, op);
          } else return;
          break;
        case 'XOR':
          if (operand) {
            const op = parseInt(operand, getRadix(base));
            result = engine.bitwiseXor(decimalValue, op);
          } else return;
          break;
        case 'NOT':
          result = engine.bitwiseNot(decimalValue);
          break;
        case 'LSH':
          result = engine.leftShift(decimalValue, 1);
          break;
        case 'RSH':
          result = engine.rightShift(decimalValue, 1);
          break;
        default:
          return;
      }

      const newValue = engine.convertBase(result.toString(), 'decimal', base);
      setValue(newValue);

      const expressionText = operand
        ? `${operand} ${operation} ${value}`
        : `${value} ${operation}`;

      onAddToHistory({
        expression: expressionText,
        result: newValue,
        mode: 'programmer',
      });

      // Reset pending operation state
      setPendingOperation(null);
      setFirstOperand('');
    } catch (err) {
      console.error('Operation error:', err);
    }
  }, [value, base, onAddToHistory]);

  const handleEquals = useCallback(() => {
    if (pendingOperation && firstOperand) {
      handleBitwiseOperation(pendingOperation, firstOperand);
    }
  }, [pendingOperation, firstOperand, handleBitwiseOperation]);

  function getRadix(base: NumberBase): number {
    switch (base) {
      case 'binary': return 2;
      case 'octal': return 8;
      case 'decimal': return 10;
      case 'hexadecimal': return 16;
      default: return 10;
    }
  }

  // Keyboard support
  useKeyboard({
    onDigit: handleInput,
    onEquals: handleEquals,
    onClear: handleClear,
    onBackspace: handleBackspace,
  });

  const renderBinaryRepresentation = () => {
    try {
      const decValue = parseInt(value, getRadix(base));
      const binary = decValue.toString(2).padStart(bitWidth, '0');
      const chunks = binary.match(/.{1,8}/g) || [];
      return chunks.join(' ');
    } catch {
      return '0'.repeat(bitWidth);
    }
  };

  return (
    <div className="programmer-calculator" role="region" aria-label="Programmer calculator">
      <div className="calculator-display-area" role="status" aria-live="polite" aria-atomic="true">
        <div className="base-selector" role="group" aria-label="Number base selector">
          <button
            className={base === 'binary' ? 'active' : ''}
            onClick={() => handleBaseChange('binary')}
            aria-label="Binary base"
            aria-pressed={base === 'binary'}
          >
            BIN
          </button>
          <button
            className={base === 'octal' ? 'active' : ''}
            onClick={() => handleBaseChange('octal')}
            aria-label="Octal base"
            aria-pressed={base === 'octal'}
          >
            OCT
          </button>
          <button
            className={base === 'decimal' ? 'active' : ''}
            onClick={() => handleBaseChange('decimal')}
            aria-label="Decimal base"
            aria-pressed={base === 'decimal'}
          >
            DEC
          </button>
          <button
            className={base === 'hexadecimal' ? 'active' : ''}
            onClick={() => handleBaseChange('hexadecimal')}
            aria-label="Hexadecimal base"
            aria-pressed={base === 'hexadecimal'}
          >
            HEX
          </button>
        </div>

        <div className="binary-display" aria-label="Binary representation">{renderBinaryRepresentation()}</div>
        <div className="display" aria-label="Calculator display">{value}</div>
      </div>

      <div className="bit-width-selector" role="group" aria-label="Bit width selector">
        <label>Bit Width:</label>
        {[8, 16, 32, 64].map((width) => (
          <button
            key={width}
            className={bitWidth === width ? 'active' : ''}
            onClick={() => setBitWidth(width as any)}
            aria-label={`${width} bit`}
            aria-pressed={bitWidth === width}
          >
            {width}
          </button>
        ))}
      </div>

      <div className="programmer-buttons" role="group" aria-label="Calculator buttons">
        <button className="btn-function" onClick={() => handleBitwiseOperation('AND')} aria-label="Bitwise AND">AND</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('OR')} aria-label="Bitwise OR">OR</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('XOR')} aria-label="Bitwise XOR">XOR</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('NOT')} aria-label="Bitwise NOT">NOT</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('LSH')} aria-label="Left shift">{'<<'}</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('RSH')} aria-label="Right shift">{'>>'}</button>

        <button onClick={() => handleInput('A')} disabled={base !== 'hexadecimal'} aria-label="Hex digit A">A</button>
        <button onClick={() => handleInput('B')} disabled={base !== 'hexadecimal'} aria-label="Hex digit B">B</button>
        <button onClick={() => handleInput('C')} disabled={base !== 'hexadecimal'} aria-label="Hex digit C">C</button>
        <button onClick={() => handleInput('D')} disabled={base !== 'hexadecimal'} aria-label="Hex digit D">D</button>
        <button onClick={() => handleInput('E')} disabled={base !== 'hexadecimal'} aria-label="Hex digit E">E</button>
        <button onClick={() => handleInput('F')} disabled={base !== 'hexadecimal'} aria-label="Hex digit F">F</button>

        <button onClick={() => handleInput('7')} disabled={base === 'binary'} aria-label="Seven">7</button>
        <button onClick={() => handleInput('8')} disabled={base === 'binary' || base === 'octal'} aria-label="Eight">8</button>
        <button onClick={() => handleInput('9')} disabled={base === 'binary' || base === 'octal'} aria-label="Nine">9</button>
        <button className="btn-function" onClick={handleBackspace} aria-label="Backspace">⌫</button>
        <button className="btn-function" onClick={handleClear} aria-label="Clear">C</button>
        <button className="btn-equals" onClick={handleEquals} aria-label="Equals">=</button>

        <button onClick={() => handleInput('4')} aria-label="Four">4</button>
        <button onClick={() => handleInput('5')} aria-label="Five">5</button>
        <button onClick={() => handleInput('6')} aria-label="Six">6</button>
        <div></div>
        <div></div>
        <div></div>

        <button onClick={() => handleInput('1')} aria-label="One">1</button>
        <button onClick={() => handleInput('2')} aria-label="Two">2</button>
        <button onClick={() => handleInput('3')} aria-label="Three">3</button>
        <div></div>
        <div></div>
        <div></div>

        <button onClick={() => handleInput('0')} style={{ gridColumn: 'span 6' }} aria-label="Zero">0</button>
      </div>
    </div>
  );
}

export default ProgrammerCalculator;

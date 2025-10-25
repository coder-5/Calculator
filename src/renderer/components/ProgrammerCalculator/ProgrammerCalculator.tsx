import { useState, useCallback } from 'react';
import { ProgrammerCalculatorEngine } from '../../engines/programmerEngine';
import { NumberBase, HistoryEntry } from '../../../shared/types';
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

  const handleInput = useCallback((digit: string) => {
    setValue((prev) => (prev === '0' ? digit : prev + digit));
  }, []);

  const handleClear = useCallback(() => {
    setValue('0');
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

      onAddToHistory({
        expression: `${value} ${operation}`,
        result: newValue,
        mode: 'programmer',
      });
    } catch (err) {
      console.error('Operation error:', err);
    }
  }, [value, base, onAddToHistory]);

  function getRadix(base: NumberBase): number {
    switch (base) {
      case 'binary': return 2;
      case 'octal': return 8;
      case 'decimal': return 10;
      case 'hexadecimal': return 16;
      default: return 10;
    }
  }

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
    <div className="programmer-calculator">
      <div className="calculator-display-area">
        <div className="base-selector">
          <button
            className={base === 'binary' ? 'active' : ''}
            onClick={() => handleBaseChange('binary')}
          >
            BIN
          </button>
          <button
            className={base === 'octal' ? 'active' : ''}
            onClick={() => handleBaseChange('octal')}
          >
            OCT
          </button>
          <button
            className={base === 'decimal' ? 'active' : ''}
            onClick={() => handleBaseChange('decimal')}
          >
            DEC
          </button>
          <button
            className={base === 'hexadecimal' ? 'active' : ''}
            onClick={() => handleBaseChange('hexadecimal')}
          >
            HEX
          </button>
        </div>

        <div className="binary-display">{renderBinaryRepresentation()}</div>
        <div className="display">{value}</div>
      </div>

      <div className="bit-width-selector">
        <label>Bit Width:</label>
        {[8, 16, 32, 64].map((width) => (
          <button
            key={width}
            className={bitWidth === width ? 'active' : ''}
            onClick={() => setBitWidth(width as any)}
          >
            {width}
          </button>
        ))}
      </div>

      <div className="programmer-buttons">
        <button className="btn-function" onClick={() => handleBitwiseOperation('AND')}>AND</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('OR')}>OR</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('XOR')}>XOR</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('NOT')}>NOT</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('LSH')}>{'<<'}</button>
        <button className="btn-function" onClick={() => handleBitwiseOperation('RSH')}>{'>>'}</button>

        <button onClick={() => handleInput('A')} disabled={base !== 'hexadecimal'}>A</button>
        <button onClick={() => handleInput('B')} disabled={base !== 'hexadecimal'}>B</button>
        <button onClick={() => handleInput('C')} disabled={base !== 'hexadecimal'}>C</button>
        <button onClick={() => handleInput('D')} disabled={base !== 'hexadecimal'}>D</button>
        <button onClick={() => handleInput('E')} disabled={base !== 'hexadecimal'}>E</button>
        <button onClick={() => handleInput('F')} disabled={base !== 'hexadecimal'}>F</button>

        <button onClick={() => handleInput('7')} disabled={base === 'binary'}>7</button>
        <button onClick={() => handleInput('8')} disabled={base === 'binary' || base === 'octal'}>8</button>
        <button onClick={() => handleInput('9')} disabled={base === 'binary' || base === 'octal'}>9</button>
        <button className="btn-function" onClick={handleBackspace}>⌫</button>
        <button className="btn-function" onClick={handleClear}>C</button>

        <button onClick={() => handleInput('4')}>4</button>
        <button onClick={() => handleInput('5')}>5</button>
        <button onClick={() => handleInput('6')}>6</button>
        <button onClick={() => handleInput('1')}>1</button>
        <button onClick={() => handleInput('2')}>2</button>
        <button onClick={() => handleInput('3')}>3</button>
        <button onClick={() => handleInput('0')} style={{ gridColumn: 'span 2' }}>0</button>
      </div>
    </div>
  );
}

export default ProgrammerCalculator;

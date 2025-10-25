import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { evaluate } from 'mathjs';
import { GraphFunction, HistoryEntry } from '../../../shared/types';
import {
  sanitizeMathExpression,
  isValidMathExpression,
  validateGraphRange,
  debounce,
} from '../../utils/validation';
import './GraphingCalculator.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraphingCalculatorProps {
  onAddToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  memory: any;
}

const COLORS = ['#2196f3', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];

function GraphingCalculator({ onAddToHistory }: GraphingCalculatorProps) {
  const [functions, setFunctions] = useState<GraphFunction[]>([]);
  const [input, setInput] = useState('');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [error, setError] = useState('');
  const [rangeError, setRangeError] = useState('');

  const addFunction = useCallback(() => {
    if (!input.trim()) return;

    try {
      // Sanitize and validate the expression
      const sanitized = sanitizeMathExpression(input);

      if (!isValidMathExpression(sanitized)) {
        setError('Invalid function expression');
        return;
      }

      // Test if the function is valid
      evaluate(sanitized.replace(/x/g, '0'));

      const newFunc: GraphFunction = {
        id: crypto.randomUUID(),
        expression: sanitized,
        color: COLORS[functions.length % COLORS.length],
        visible: true,
      };

      setFunctions((prev) => [...prev, newFunc]);
      setInput('');
      setError('');

      onAddToHistory({
        expression: `f(x) = ${sanitized}`,
        result: 'Function added to graph',
        mode: 'graphing',
      });
    } catch (err: any) {
      setError(`Invalid function: ${err.message}`);
    }
  }, [input, functions.length, onAddToHistory]);

  const removeFunction = useCallback((id: string) => {
    setFunctions((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleFunction = useCallback((id: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  }, []);

  // Validate ranges
  useEffect(() => {
    const xValidation = validateGraphRange(xMin, xMax);
    const yValidation = validateGraphRange(yMin, yMax);

    if (!xValidation.valid) {
      setRangeError(xValidation.error || '');
    } else if (!yValidation.valid) {
      setRangeError(yValidation.error || '');
    } else {
      setRangeError('');
    }
  }, [xMin, xMax, yMin, yMax]);

  // Memoize generated data for performance
  const generateData = useMemo(() => {
    const points = 200;
    const step = (xMax - xMin) / points;
    const xValues: number[] = [];
    const datasets: any[] = [];

    for (let i = 0; i <= points; i++) {
      xValues.push(xMin + i * step);
    }

    functions.forEach((func) => {
      if (!func.visible) return;

      const yValues: (number | null)[] = xValues.map((x) => {
        try {
          const result = evaluate(func.expression.replace(/x/g, `(${x})`));
          const y = typeof result === 'number' ? result : parseFloat(result);

          // Filter out values outside y range
          if (y < yMin || y > yMax || !isFinite(y)) {
            return null;
          }

          return y;
        } catch {
          return null;
        }
      });

      datasets.push({
        label: `f(x) = ${func.expression}`,
        data: yValues,
        borderColor: func.color,
        backgroundColor: func.color + '20',
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.1,
      });
    });

    return {
      labels: xValues.map((x) => x.toFixed(2)),
      datasets,
    };
  }, [functions, xMin, xMax, yMin, yMax]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        min: xMin,
        max: xMax,
        ticks: {
          color: 'var(--color-text-primary)',
        },
        grid: {
          color: 'var(--color-border)',
        },
      },
      y: {
        type: 'linear' as const,
        min: yMin,
        max: yMax,
        ticks: {
          color: 'var(--color-text-primary)',
        },
        grid: {
          color: 'var(--color-border)',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'var(--color-text-primary)',
        },
      },
    },
  };

  return (
    <div className="graphing-calculator" role="region" aria-label="Graphing calculator">
      <div className="graph-container" role="img" aria-label="Function graph">
        <Line data={generateData} options={chartOptions} />
      </div>

      <div className="graph-controls">
        <div className="function-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFunction()}
            placeholder="Enter function (e.g., x^2, sin(x), etc.)"
            aria-label="Function expression input"
          />
          <button onClick={addFunction} aria-label="Add function to graph">Add Function</button>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}
        {rangeError && <div className="error-message" role="alert">{rangeError}</div>}

        <div className="range-controls" role="group" aria-label="Graph range controls">
          <div className="range-group">
            <label>X Range:</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(parseFloat(e.target.value))}
              placeholder="Min"
              aria-label="X axis minimum"
            />
            <span>to</span>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(parseFloat(e.target.value))}
              placeholder="Max"
              aria-label="X axis maximum"
            />
          </div>

          <div className="range-group">
            <label>Y Range:</label>
            <input
              type="number"
              value={yMin}
              onChange={(e) => setYMin(parseFloat(e.target.value))}
              placeholder="Min"
              aria-label="Y axis minimum"
            />
            <span>to</span>
            <input
              type="number"
              value={yMax}
              onChange={(e) => setYMax(parseFloat(e.target.value))}
              placeholder="Max"
              aria-label="Y axis maximum"
            />
          </div>
        </div>

        <div className="function-list" role="list" aria-label="Graphed functions">
          <h3>Functions</h3>
          {functions.length === 0 ? (
            <div className="empty-message">No functions added yet</div>
          ) : (
            functions.map((func) => (
              <div key={func.id} className="function-item" role="listitem">
                <input
                  type="checkbox"
                  checked={func.visible}
                  onChange={() => toggleFunction(func.id)}
                  aria-label={`Toggle visibility of ${func.expression}`}
                />
                <span
                  className="function-color"
                  style={{ backgroundColor: func.color }}
                  aria-label={`Function color`}
                ></span>
                <span className="function-expression">f(x) = {func.expression}</span>
                <button onClick={() => removeFunction(func.id)} aria-label={`Remove function ${func.expression}`}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GraphingCalculator;

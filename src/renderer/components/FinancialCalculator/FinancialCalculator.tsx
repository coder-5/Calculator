import { useState, useCallback } from 'react';
import { FinancialCalculatorEngine } from '../../engines/financialEngine';
import { HistoryEntry } from '../../../shared/types';
import './FinancialCalculator.css';

interface FinancialCalculatorProps {
  onAddToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  memory: any;
}

const engine = new FinancialCalculatorEngine();

type CalculationType =
  | 'loan'
  | 'compound_interest'
  | 'simple_interest'
  | 'roi'
  | 'depreciation_sl'
  | 'present_value'
  | 'future_value';

function FinancialCalculator({ onAddToHistory }: FinancialCalculatorProps) {
  const [calculationType, setCalculationType] = useState<CalculationType>('loan');
  const [result, setResult] = useState<string>('');

  // Loan inputs
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');

  // ROI inputs
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');

  // Depreciation inputs
  const [cost, setCost] = useState('');
  const [salvageValue, setSalvageValue] = useState('');
  const [usefulLife, setUsefulLife] = useState('');

  // Compound interest inputs
  const [compoundingFrequency, setCompoundingFrequency] = useState('12');

  const calculate = useCallback(() => {
    try {
      let calculationResult: number = 0;
      let expression = '';

      switch (calculationType) {
        case 'loan':
          calculationResult = engine.calculateLoanPayment(
            parseFloat(principal),
            parseFloat(annualRate),
            parseFloat(years)
          );
          expression = `Loan Payment: Principal=$${principal}, Rate=${annualRate}%, Years=${years}`;
          break;

        case 'compound_interest':
          calculationResult = engine.calculateCompoundInterest(
            parseFloat(principal),
            parseFloat(annualRate),
            parseFloat(years),
            parseFloat(compoundingFrequency)
          );
          expression = `Compound Interest: Principal=$${principal}, Rate=${annualRate}%, Years=${years}`;
          break;

        case 'simple_interest':
          calculationResult = engine.calculateSimpleInterest(
            parseFloat(principal),
            parseFloat(annualRate),
            parseFloat(years)
          );
          expression = `Simple Interest: Principal=$${principal}, Rate=${annualRate}%, Years=${years}`;
          break;

        case 'roi':
          calculationResult = engine.calculateROI(
            parseFloat(initialInvestment),
            parseFloat(finalValue)
          );
          expression = `ROI: Initial=$${initialInvestment}, Final=$${finalValue}`;
          break;

        case 'depreciation_sl':
          calculationResult = engine.calculateStraightLineDepreciation(
            parseFloat(cost),
            parseFloat(salvageValue),
            parseFloat(usefulLife)
          );
          expression = `Depreciation: Cost=$${cost}, Salvage=$${salvageValue}, Life=${usefulLife}`;
          break;

        case 'present_value':
          calculationResult = engine.calculatePresentValue(
            parseFloat(finalValue),
            parseFloat(annualRate),
            parseFloat(years)
          );
          expression = `Present Value: Future=$${finalValue}, Rate=${annualRate}%, Years=${years}`;
          break;

        case 'future_value':
          calculationResult = engine.calculateFutureValue(
            parseFloat(principal),
            parseFloat(annualRate),
            parseFloat(years),
            parseFloat(compoundingFrequency)
          );
          expression = `Future Value: Principal=$${principal}, Rate=${annualRate}%, Years=${years}`;
          break;
      }

      const formattedResult = calculationResult.toFixed(2);
      setResult(formattedResult);

      onAddToHistory({
        expression,
        result: `$${formattedResult}`,
        mode: 'financial',
      });
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  }, [
    calculationType,
    principal,
    annualRate,
    years,
    initialInvestment,
    finalValue,
    cost,
    salvageValue,
    usefulLife,
    compoundingFrequency,
    onAddToHistory,
  ]);

  const renderInputs = () => {
    switch (calculationType) {
      case 'loan':
      case 'compound_interest':
      case 'simple_interest':
      case 'future_value':
        return (
          <>
            <div className="input-group">
              <label>Principal Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="10000"
              />
            </div>
            <div className="input-group">
              <label>Annual Interest Rate (%)</label>
              <input
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                placeholder="5"
                step="0.1"
              />
            </div>
            <div className="input-group">
              <label>Number of Years</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="5"
              />
            </div>
            {(calculationType === 'compound_interest' || calculationType === 'future_value') && (
              <div className="input-group">
                <label>Compounding Frequency (per year)</label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value)}
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="365">Daily</option>
                </select>
              </div>
            )}
          </>
        );

      case 'roi':
        return (
          <>
            <div className="input-group">
              <label>Initial Investment ($)</label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="10000"
              />
            </div>
            <div className="input-group">
              <label>Final Value ($)</label>
              <input
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                placeholder="15000"
              />
            </div>
          </>
        );

      case 'depreciation_sl':
        return (
          <>
            <div className="input-group">
              <label>Asset Cost ($)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="50000"
              />
            </div>
            <div className="input-group">
              <label>Salvage Value ($)</label>
              <input
                type="number"
                value={salvageValue}
                onChange={(e) => setSalvageValue(e.target.value)}
                placeholder="5000"
              />
            </div>
            <div className="input-group">
              <label>Useful Life (years)</label>
              <input
                type="number"
                value={usefulLife}
                onChange={(e) => setUsefulLife(e.target.value)}
                placeholder="10"
              />
            </div>
          </>
        );

      case 'present_value':
        return (
          <>
            <div className="input-group">
              <label>Future Value ($)</label>
              <input
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                placeholder="20000"
              />
            </div>
            <div className="input-group">
              <label>Annual Interest Rate (%)</label>
              <input
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                placeholder="5"
                step="0.1"
              />
            </div>
            <div className="input-group">
              <label>Number of Years</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="5"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="financial-calculator">
      <div className="calculation-type-selector">
        <select
          value={calculationType}
          onChange={(e) => {
            setCalculationType(e.target.value as CalculationType);
            setResult('');
          }}
        >
          <option value="loan">Loan Payment</option>
          <option value="compound_interest">Compound Interest</option>
          <option value="simple_interest">Simple Interest</option>
          <option value="future_value">Future Value</option>
          <option value="present_value">Present Value</option>
          <option value="roi">Return on Investment (ROI)</option>
          <option value="depreciation_sl">Depreciation (Straight Line)</option>
        </select>
      </div>

      <div className="financial-inputs">{renderInputs()}</div>

      <button className="calculate-btn" onClick={calculate}>
        Calculate
      </button>

      {result && (
        <div className="result-display">
          <div className="result-label">Result:</div>
          <div className="result-value">
            {result.startsWith('Error') ? result : `$${result}`}
          </div>
        </div>
      )}

      <div className="financial-info">
        <h3>Information</h3>
        <div className="info-content">
          {calculationType === 'loan' && (
            <p>Calculates the monthly payment for a loan based on principal, interest rate, and loan term.</p>
          )}
          {calculationType === 'compound_interest' && (
            <p>Calculates interest earned when interest is added to the principal and future interest calculations.</p>
          )}
          {calculationType === 'simple_interest' && (
            <p>Calculates interest based only on the principal amount for the entire period.</p>
          )}
          {calculationType === 'roi' && (
            <p>Calculates the percentage return on an investment.</p>
          )}
          {calculationType === 'depreciation_sl' && (
            <p>Calculates annual depreciation using the straight-line method.</p>
          )}
          {calculationType === 'present_value' && (
            <p>Calculates the current value of a future sum of money.</p>
          )}
          {calculationType === 'future_value' && (
            <p>Calculates the value of an investment at a future date.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialCalculator;

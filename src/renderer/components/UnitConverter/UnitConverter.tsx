import { useState } from 'react';
import { UNIT_CATEGORIES } from '../../../shared/constants';
import { convertUnit, getUnitsForCategory } from '../../utils/unitConverter';
import './UnitConverter.css';

function UnitConverter() {
  const [category, setCategory] = useState('Length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const units = getUnitsForCategory(category);

  const handleConvert = () => {
    try {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setResult('Invalid number');
        return;
      }

      if (!fromUnit || !toUnit) {
        setResult('Please select units');
        return;
      }

      const converted = convertUnit(numValue, category, fromUnit, toUnit);
      setResult(converted.toFixed(6));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setFromUnit('');
    setToUnit('');
    setResult('');
  };

  return (
    <div className="unit-converter">
      <h2>Unit Converter</h2>

      <div className="converter-controls">
        <div className="input-group">
          <label>Category</label>
          <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
            {UNIT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        <div className="input-group">
          <label>From</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            <option value="">Select unit</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>To</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            <option value="">Select unit</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <button className="convert-btn" onClick={handleConvert}>
          Convert
        </button>
      </div>

      {result && (
        <div className="conversion-result">
          <div className="result-text">
            {value} {fromUnit} = <strong>{result}</strong> {toUnit}
          </div>
        </div>
      )}
    </div>
  );
}

export default UnitConverter;

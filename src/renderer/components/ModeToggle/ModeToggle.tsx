import { CalculatorMode } from '../../../shared/types';
import { CALCULATOR_MODES } from '../../../shared/constants';
import './ModeToggle.css';

interface ModeToggleProps {
  currentMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
}

const modes: { value: CalculatorMode; label: string; icon: string }[] = [
  { value: CALCULATOR_MODES.BASIC, label: 'Basic', icon: '🔢' },
  { value: CALCULATOR_MODES.SCIENTIFIC, label: 'Scientific', icon: '🔬' },
  { value: CALCULATOR_MODES.PROGRAMMER, label: 'Programmer', icon: '💻' },
  { value: CALCULATOR_MODES.GRAPHING, label: 'Graphing', icon: '📈' },
  { value: CALCULATOR_MODES.FINANCIAL, label: 'Financial', icon: '💰' },
];

function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle">
      {modes.map((mode) => (
        <button
          key={mode.value}
          className={`mode-button ${currentMode === mode.value ? 'active' : ''}`}
          onClick={() => onModeChange(mode.value)}
          title={mode.label}
        >
          <span className="mode-icon">{mode.icon}</span>
          <span className="mode-label">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ModeToggle;

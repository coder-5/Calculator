import { useState, useEffect } from 'react';
import { CalculatorMode } from '../shared/types';
import { storage } from './utils/storage';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { useMemory } from './hooks/useMemory';

import ModeToggle from './components/ModeToggle/ModeToggle';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import BasicCalculator from './components/BasicCalculator/BasicCalculator';
import ScientificCalculator from './components/ScientificCalculator/ScientificCalculator';
import ProgrammerCalculator from './components/ProgrammerCalculator/ProgrammerCalculator';
import GraphingCalculator from './components/GraphingCalculator/GraphingCalculator';
import FinancialCalculator from './components/FinancialCalculator/FinancialCalculator';
import History from './components/History/History';
import Memory from './components/Memory/Memory';

import './styles/global.css';
import './App.css';

function App() {
  const [mode, setMode] = useState<CalculatorMode>(() => storage.getLastMode());
  const { theme, toggleTheme } = useTheme();
  const historyHook = useHistory();
  const memoryHook = useMemory();
  const [showHistory, setShowHistory] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  useEffect(() => {
    storage.setLastMode(mode);
  }, [mode]);

  // Listen for mode switch from electron menu
  useEffect(() => {
    if (window.electron) {
      window.electron.onSwitchMode((newMode: string) => {
        setMode(newMode as CalculatorMode);
      });
    }
  }, []);

  const renderCalculator = () => {
    const props = {
      onAddToHistory: historyHook.addEntry,
      memory: memoryHook,
    };

    switch (mode) {
      case 'basic':
        return <BasicCalculator {...props} />;
      case 'scientific':
        return <ScientificCalculator {...props} />;
      case 'programmer':
        return <ProgrammerCalculator {...props} />;
      case 'graphing':
        return <GraphingCalculator {...props} />;
      case 'financial':
        return <FinancialCalculator {...props} />;
      default:
        return <BasicCalculator {...props} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Multi-Calculator</h1>
        <div className="app-controls">
          <button
            className="icon-button"
            onClick={() => setShowHistory(!showHistory)}
            title="History"
          >
            📜
          </button>
          <button
            className="icon-button"
            onClick={() => setShowMemory(!showMemory)}
            title="Memory"
          >
            💾
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <ModeToggle currentMode={mode} onModeChange={setMode} />

      <div className="app-content">
        <div className="calculator-container">{renderCalculator()}</div>

        {showHistory && (
          <div className="sidebar slide-in">
            <History
              history={historyHook.history}
              onClear={historyHook.clearHistory}
              onDelete={historyHook.deleteEntry}
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}

        {showMemory && (
          <div className="sidebar slide-in">
            <Memory
              memory={memoryHook.memory}
              onClear={memoryHook.memoryClear}
              onClose={() => setShowMemory(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

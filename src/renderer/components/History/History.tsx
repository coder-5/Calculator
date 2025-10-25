import { useState, useMemo } from 'react';
import { HistoryEntry, CalculatorMode } from '../../../shared/types';
import './History.css';

interface HistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function History({ history, onClear, onDelete, onClose }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<CalculatorMode | 'all'>('all');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const exportHistory = () => {
    const csvContent = [
      ['Mode', 'Expression', 'Result', 'Timestamp'],
      ...history.map((entry) => [
        entry.mode,
        entry.expression,
        entry.result,
        entry.timestamp.toISOString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      const matchesSearch =
        searchTerm === '' ||
        entry.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.result.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMode = filterMode === 'all' || entry.mode === filterMode;

      return matchesSearch && matchesMode;
    });
  }, [history, searchTerm, filterMode]);

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>History</h2>
        <div className="history-actions">
          <button onClick={exportHistory} className="btn-export" disabled={history.length === 0} title="Export to CSV">
            📤
          </button>
          <button onClick={onClear} className="btn-clear" disabled={history.length === 0}>
            Clear All
          </button>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>
      </div>

      <div className="history-filters">
        <input
          type="text"
          className="history-search"
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search history"
        />
        <select
          className="history-filter"
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value as CalculatorMode | 'all')}
          aria-label="Filter by calculator mode"
        >
          <option value="all">All Modes</option>
          <option value="basic">Basic</option>
          <option value="scientific">Scientific</option>
          <option value="programmer">Programmer</option>
          <option value="graphing">Graphing</option>
          <option value="financial">Financial</option>
        </select>
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="history-empty">
            {history.length === 0 ? 'No history yet' : 'No matching entries'}
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <div key={entry.id} className="history-item">
              <div className="history-item-header">
                <span className="history-mode">{entry.mode}</span>
                <span className="history-time">{formatDate(entry.timestamp)}</span>
              </div>
              <div className="history-expression">{entry.expression}</div>
              <div className="history-result">= {entry.result}</div>
              <button
                className="history-delete"
                onClick={() => onDelete(entry.id)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;

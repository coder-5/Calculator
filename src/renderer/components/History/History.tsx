import { HistoryEntry } from '../../../shared/types';
import './History.css';

interface HistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function History({ history, onClear, onDelete, onClose }: HistoryProps) {
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

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>History</h2>
        <div className="history-actions">
          <button onClick={onClear} className="btn-clear" disabled={history.length === 0}>
            Clear All
          </button>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">No history yet</div>
        ) : (
          history.map((entry) => (
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

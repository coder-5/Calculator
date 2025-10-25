import { MemorySlot } from '../../../shared/types';
import './Memory.css';

interface MemoryProps {
  memory: MemorySlot[];
  onClear: () => void;
  onClose: () => void;
}

function Memory({ memory, onClear, onClose }: MemoryProps) {
  return (
    <div className="memory-panel">
      <div className="memory-header">
        <h2>Memory</h2>
        <div className="memory-actions">
          <button onClick={onClear} className="btn-clear" disabled={memory.length === 0}>
            Clear
          </button>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>
      </div>

      <div className="memory-list">
        {memory.length === 0 ? (
          <div className="memory-empty">No values in memory</div>
        ) : (
          memory.map((slot, index) => (
            <div key={index} className="memory-item">
              <div className="memory-label">{slot.label || `M${index + 1}`}</div>
              <div className="memory-value">{slot.value}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Memory;

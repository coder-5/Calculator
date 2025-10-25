import { MemorySlot } from '../../../shared/types';
import './Memory.css';

interface MemoryProps {
  memory: MemorySlot[];
  activeSlot: number;
  onClear: (slotIndex?: number) => void;
  onClose: () => void;
  onRecall: (slotIndex: number) => void;
  onSelectSlot: (index: number) => void;
}

function Memory({ memory, activeSlot, onClear, onClose, onRecall, onSelectSlot }: MemoryProps) {
  return (
    <div className="memory-panel" role="dialog" aria-label="Memory slots">
      <div className="memory-header">
        <h2>Memory Slots</h2>
        <div className="memory-actions">
          <button
            onClick={() => onClear()}
            className="btn-clear"
            disabled={memory.length === 0}
            aria-label="Clear all memory slots"
          >
            Clear All
          </button>
          <button onClick={onClose} className="btn-close" aria-label="Close memory panel">✕</button>
        </div>
      </div>

      <div className="memory-list" role="list">
        {memory.length === 0 ? (
          <div className="memory-empty">No values in memory</div>
        ) : (
          memory.map((slot, index) => (
            <div
              key={index}
              className={`memory-item ${index === activeSlot ? 'active' : ''}`}
              role="listitem"
              onClick={() => onSelectSlot(index)}
            >
              <div className="memory-label">{slot.label || `M${index + 1}`}</div>
              <div className="memory-value">{slot.value.toFixed(8).replace(/\.?0+$/, '')}</div>
              <div className="memory-item-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRecall(index);
                  }}
                  aria-label={`Recall value from slot ${index + 1}`}
                  title="Recall (MR)"
                >
                  MR
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear(index);
                  }}
                  aria-label={`Clear slot ${index + 1}`}
                  title="Clear"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {memory.length < 10 && (
        <div className="memory-info">
          <small>{memory.length}/10 memory slots used</small>
        </div>
      )}
    </div>
  );
}

export default Memory;

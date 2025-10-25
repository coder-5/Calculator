import { useState, useEffect } from 'react';
import { MemorySlot } from '../../shared/types';
import { storage } from '../utils/storage';

export function useMemory() {
  const [memory, setMemory] = useState<MemorySlot[]>(() => storage.getMemory());

  useEffect(() => {
    storage.setMemory(memory);
  }, [memory]);

  const memoryAdd = (value: number) => {
    setMemory((prev) => {
      if (prev.length === 0) {
        return [{ value }];
      }
      const updated = [...prev];
      updated[0] = { ...updated[0], value: updated[0].value + value };
      return updated;
    });
  };

  const memorySubtract = (value: number) => {
    setMemory((prev) => {
      if (prev.length === 0) {
        return [{ value: -value }];
      }
      const updated = [...prev];
      updated[0] = { ...updated[0], value: updated[0].value - value };
      return updated;
    });
  };

  const memoryRecall = (): number => {
    return memory.length > 0 ? memory[0].value : 0;
  };

  const memoryClear = () => {
    setMemory([]);
  };

  const memoryStore = (value: number) => {
    setMemory([{ value }]);
  };

  return {
    memory,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    memoryStore,
    hasMemory: memory.length > 0,
  };
}

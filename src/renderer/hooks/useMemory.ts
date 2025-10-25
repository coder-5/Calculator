import { useState, useEffect } from 'react';
import { MemorySlot } from '../../shared/types';
import { storage } from '../utils/storage';

const MAX_MEMORY_SLOTS = 10;

export function useMemory() {
  const [memory, setMemory] = useState<MemorySlot[]>(() => storage.getMemory());
  const [activeSlot, setActiveSlot] = useState<number>(0);

  useEffect(() => {
    storage.setMemory(memory);
  }, [memory]);

  const memoryAdd = (value: number, slotIndex?: number) => {
    const targetSlot = slotIndex ?? activeSlot;
    setMemory((prev) => {
      const updated = [...prev];
      if (targetSlot < updated.length) {
        updated[targetSlot] = { ...updated[targetSlot], value: updated[targetSlot].value + value };
      } else if (prev.length < MAX_MEMORY_SLOTS) {
        // Add new slot if it doesn't exist
        while (updated.length < targetSlot) {
          updated.push({ value: 0 });
        }
        updated.push({ value });
      }
      return updated;
    });
  };

  const memorySubtract = (value: number, slotIndex?: number) => {
    const targetSlot = slotIndex ?? activeSlot;
    setMemory((prev) => {
      const updated = [...prev];
      if (targetSlot < updated.length) {
        updated[targetSlot] = { ...updated[targetSlot], value: updated[targetSlot].value - value };
      } else if (prev.length < MAX_MEMORY_SLOTS) {
        // Add new slot with negative value if it doesn't exist
        while (updated.length < targetSlot) {
          updated.push({ value: 0 });
        }
        updated.push({ value: -value });
      }
      return updated;
    });
  };

  const memoryRecall = (slotIndex?: number): number => {
    const targetSlot = slotIndex ?? activeSlot;
    return targetSlot < memory.length ? memory[targetSlot].value : 0;
  };

  const memoryClear = (slotIndex?: number) => {
    if (slotIndex === undefined) {
      // Clear all memory
      setMemory([]);
      setActiveSlot(0);
    } else {
      // Clear specific slot
      setMemory((prev) => {
        const updated = [...prev];
        if (slotIndex < updated.length) {
          updated.splice(slotIndex, 1);
        }
        return updated;
      });
      // Adjust active slot if necessary
      if (activeSlot >= memory.length - 1 && activeSlot > 0) {
        setActiveSlot(activeSlot - 1);
      }
    }
  };

  const memoryStore = (value: number, slotIndex?: number) => {
    const targetSlot = slotIndex ?? activeSlot;
    setMemory((prev) => {
      const updated = [...prev];
      if (targetSlot < updated.length) {
        updated[targetSlot] = { value };
      } else if (prev.length < MAX_MEMORY_SLOTS) {
        // Add new slot if it doesn't exist
        while (updated.length < targetSlot) {
          updated.push({ value: 0 });
        }
        updated.push({ value });
      }
      return updated;
    });
  };

  const memoryAddSlot = (value: number) => {
    if (memory.length < MAX_MEMORY_SLOTS) {
      setMemory((prev) => [...prev, { value }]);
      setActiveSlot(memory.length);
    }
  };

  const setMemorySlot = (index: number) => {
    if (index >= 0 && index < memory.length) {
      setActiveSlot(index);
    }
  };

  return {
    memory,
    activeSlot,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    memoryStore,
    memoryAddSlot,
    setMemorySlot,
    hasMemory: memory.length > 0,
    maxSlots: MAX_MEMORY_SLOTS,
  };
}

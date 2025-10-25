import { ProgrammerCalculatorEngine } from '../../src/renderer/engines/programmerEngine';

describe('ProgrammerCalculatorEngine', () => {
  let engine: ProgrammerCalculatorEngine;

  beforeEach(() => {
    engine = new ProgrammerCalculatorEngine();
  });

  describe('convertBase', () => {
    describe('decimal conversions', () => {
      it('should convert decimal to binary', () => {
        expect(engine.convertBase('10', 'decimal', 'binary')).toBe('1010');
      });

      it('should convert decimal to octal', () => {
        expect(engine.convertBase('10', 'decimal', 'octal')).toBe('12');
      });

      it('should convert decimal to hexadecimal', () => {
        expect(engine.convertBase('255', 'decimal', 'hexadecimal')).toBe('FF');
      });
    });

    describe('binary conversions', () => {
      it('should convert binary to decimal', () => {
        expect(engine.convertBase('1010', 'binary', 'decimal')).toBe('10');
      });

      it('should convert binary to hexadecimal', () => {
        expect(engine.convertBase('11111111', 'binary', 'hexadecimal')).toBe('FF');
      });
    });

    describe('hexadecimal conversions', () => {
      it('should convert hexadecimal to decimal', () => {
        expect(engine.convertBase('FF', 'hexadecimal', 'decimal')).toBe('255');
      });

      it('should convert hexadecimal to binary', () => {
        expect(engine.convertBase('A', 'hexadecimal', 'binary')).toBe('1010');
      });
    });

    describe('octal conversions', () => {
      it('should convert octal to decimal', () => {
        expect(engine.convertBase('12', 'octal', 'decimal')).toBe('10');
      });

      it('should convert octal to binary', () => {
        expect(engine.convertBase('7', 'octal', 'binary')).toBe('111');
      });
    });
  });

  describe('bitwise operations', () => {
    describe('bitwiseAnd', () => {
      it('should perform AND operation', () => {
        expect(engine.bitwiseAnd(12, 10)).toBe(8); // 1100 & 1010 = 1000
      });

      it('should handle zero', () => {
        expect(engine.bitwiseAnd(15, 0)).toBe(0);
      });
    });

    describe('bitwiseOr', () => {
      it('should perform OR operation', () => {
        expect(engine.bitwiseOr(12, 10)).toBe(14); // 1100 | 1010 = 1110
      });

      it('should handle zero', () => {
        expect(engine.bitwiseOr(15, 0)).toBe(15);
      });
    });

    describe('bitwiseXor', () => {
      it('should perform XOR operation', () => {
        expect(engine.bitwiseXor(12, 10)).toBe(6); // 1100 ^ 1010 = 0110
      });

      it('should return 0 for same numbers', () => {
        expect(engine.bitwiseXor(15, 15)).toBe(0);
      });
    });

    describe('bitwiseNot', () => {
      it('should perform NOT operation', () => {
        expect(engine.bitwiseNot(5)).toBe(-6); // ~5 = -6 (two's complement)
      });

      it('should handle zero', () => {
        expect(engine.bitwiseNot(0)).toBe(-1);
      });
    });
  });

  describe('bit shifting', () => {
    describe('leftShift', () => {
      it('should shift bits left', () => {
        expect(engine.leftShift(5, 1)).toBe(10); // 101 << 1 = 1010
      });

      it('should shift multiple positions', () => {
        expect(engine.leftShift(3, 2)).toBe(12); // 11 << 2 = 1100
      });
    });

    describe('rightShift', () => {
      it('should shift bits right', () => {
        expect(engine.rightShift(10, 1)).toBe(5); // 1010 >> 1 = 101
      });

      it('should shift multiple positions', () => {
        expect(engine.rightShift(12, 2)).toBe(3); // 1100 >> 2 = 11
      });
    });
  });

  describe('bit rotation', () => {
    describe('rotateLeft', () => {
      it('should rotate bits left within 8-bit width', () => {
        const value = 0b10110001; // 177
        const result = engine.rotateLeft(value, 1, 8);
        expect(result).toBe(0b01100011); // 99
      });

      it('should wrap around correctly', () => {
        const value = 0b11000000;
        const result = engine.rotateLeft(value, 2, 8);
        expect(result).toBe(0b00000011);
      });
    });

    describe('rotateRight', () => {
      it('should rotate bits right within 8-bit width', () => {
        const value = 0b10110001; // 177
        const result = engine.rotateRight(value, 1, 8);
        expect(result).toBe(0b11011000); // 216
      });

      it('should wrap around correctly', () => {
        const value = 0b00000011;
        const result = engine.rotateRight(value, 2, 8);
        expect(result).toBe(0b11000000);
      });
    });
  });

  describe('twosComplement', () => {
    it('should calculate twos complement', () => {
      expect(engine.twosComplement(5, 32)).toBe(-4);
    });

    it('should handle zero', () => {
      expect(engine.twosComplement(0, 32)).toBe(1);
    });
  });

  describe('bit manipulation', () => {
    describe('getBitAt', () => {
      it('should get bit at position 0', () => {
        expect(engine.getBitAt(5, 0)).toBe(1); // 101 -> bit 0 = 1
      });

      it('should get bit at position 1', () => {
        expect(engine.getBitAt(5, 1)).toBe(0); // 101 -> bit 1 = 0
      });

      it('should get bit at position 2', () => {
        expect(engine.getBitAt(5, 2)).toBe(1); // 101 -> bit 2 = 1
      });
    });

    describe('setBitAt', () => {
      it('should set bit to 1', () => {
        expect(engine.setBitAt(5, 1, 1)).toBe(7); // 101 -> set bit 1 -> 111
      });

      it('should set bit to 0', () => {
        expect(engine.setBitAt(7, 1, 0)).toBe(5); // 111 -> clear bit 1 -> 101
      });

      it('should not change if already set', () => {
        expect(engine.setBitAt(5, 0, 1)).toBe(5); // 101 -> bit 0 already 1
      });
    });

    describe('countSetBits', () => {
      it('should count set bits correctly', () => {
        expect(engine.countSetBits(7)).toBe(3); // 111 = 3 bits
      });

      it('should handle zero', () => {
        expect(engine.countSetBits(0)).toBe(0);
      });

      it('should count bits in larger numbers', () => {
        expect(engine.countSetBits(255)).toBe(8); // 11111111 = 8 bits
      });
    });
  });

  describe('edge cases', () => {
    it('should handle large numbers', () => {
      const result = engine.convertBase('1000000', 'decimal', 'hexadecimal');
      expect(result).toBe('F4240');
    });

    it('should handle case sensitivity in hex', () => {
      expect(engine.convertBase('ff', 'hexadecimal', 'decimal')).toBe('255');
    });
  });
});

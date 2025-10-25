import { BasicCalculatorEngine } from '../../src/renderer/engines/basicEngine';

describe('BasicCalculatorEngine', () => {
  let engine: BasicCalculatorEngine;

  beforeEach(() => {
    engine = new BasicCalculatorEngine();
  });

  describe('inputDigit', () => {
    it('should input a single digit', () => {
      expect(engine.inputDigit('5')).toBe('5');
    });

    it('should append digits to existing number', () => {
      engine.inputDigit('5');
      expect(engine.inputDigit('7')).toBe('57');
    });

    it('should replace 0 with first digit', () => {
      expect(engine.inputDigit('5')).toBe('5');
    });
  });

  describe('inputDecimal', () => {
    it('should add decimal point to number', () => {
      engine.inputDigit('5');
      expect(engine.inputDecimal()).toBe('5.');
    });

    it('should not add multiple decimal points', () => {
      engine.inputDigit('5');
      engine.inputDecimal();
      expect(engine.inputDecimal()).toBe('5.');
    });

    it('should start with 0. if no number exists', () => {
      expect(engine.inputDecimal()).toBe('0.');
    });
  });

  describe('clear', () => {
    it('should reset calculator to initial state', () => {
      engine.inputDigit('5');
      engine.performOperation('+');
      engine.inputDigit('3');
      expect(engine.clear()).toBe('0');
    });
  });

  describe('clearEntry', () => {
    it('should clear current value only', () => {
      engine.inputDigit('5');
      expect(engine.clearEntry()).toBe('0');
    });
  });

  describe('performOperation - addition', () => {
    it('should add two numbers', () => {
      engine.inputDigit('5');
      engine.performOperation('+');
      engine.inputDigit('3');
      expect(engine.performOperation('=')).toBe('8');
    });

    it('should handle multiple additions', () => {
      engine.inputDigit('5');
      engine.performOperation('+');
      engine.inputDigit('3');
      engine.performOperation('+');
      engine.inputDigit('2');
      expect(engine.performOperation('=')).toBe('10');
    });
  });

  describe('performOperation - subtraction', () => {
    it('should subtract two numbers', () => {
      engine.inputDigit('10');
      engine.performOperation('-');
      engine.inputDigit('3');
      expect(engine.performOperation('=')).toBe('7');
    });

    it('should handle negative results', () => {
      engine.inputDigit('3');
      engine.performOperation('-');
      engine.inputDigit('10');
      expect(engine.performOperation('=')).toBe('-7');
    });
  });

  describe('performOperation - multiplication', () => {
    it('should multiply two numbers', () => {
      engine.inputDigit('5');
      engine.performOperation('*');
      engine.inputDigit('3');
      expect(engine.performOperation('=')).toBe('15');
    });

    it('should handle multiplication by zero', () => {
      engine.inputDigit('5');
      engine.performOperation('*');
      engine.inputDigit('0');
      expect(engine.performOperation('=')).toBe('0');
    });
  });

  describe('performOperation - division', () => {
    it('should divide two numbers', () => {
      engine.inputDigit('15');
      engine.performOperation('/');
      engine.inputDigit('3');
      expect(engine.performOperation('=')).toBe('5');
    });

    it('should throw error when dividing by zero', () => {
      engine.inputDigit('5');
      engine.performOperation('/');
      engine.inputDigit('0');
      expect(() => engine.performOperation('=')).toThrow('Cannot divide by zero');
    });

    it('should handle decimal division', () => {
      engine.inputDigit('10');
      engine.performOperation('/');
      engine.inputDigit('4');
      expect(engine.performOperation('=')).toBe('2.5');
    });
  });

  describe('performOperation - modulo', () => {
    it('should calculate remainder', () => {
      engine.inputDigit('10');
      engine.performOperation('%');
      engine.inputDigit('3');
      expect(engine.performOperation('=')).toBe('1');
    });
  });

  describe('percentage', () => {
    it('should convert number to percentage', () => {
      engine.inputDigit('50');
      expect(engine.percentage()).toBe('0.5');
    });

    it('should handle 100%', () => {
      engine.inputDigit('100');
      expect(engine.percentage()).toBe('1');
    });
  });

  describe('squareRoot', () => {
    it('should calculate square root', () => {
      engine.inputDigit('16');
      expect(engine.squareRoot()).toBe('4');
    });

    it('should throw error for negative numbers', () => {
      engine.inputDigit('5');
      engine.negate();
      expect(() => engine.squareRoot()).toThrow(
        'Cannot calculate square root of negative number'
      );
    });

    it('should handle square root of zero', () => {
      engine.inputDigit('0');
      expect(engine.squareRoot()).toBe('0');
    });
  });

  describe('square', () => {
    it('should calculate square', () => {
      engine.inputDigit('5');
      expect(engine.square()).toBe('25');
    });

    it('should handle negative numbers', () => {
      engine.inputDigit('3');
      engine.negate();
      expect(engine.square()).toBe('9');
    });
  });

  describe('negate', () => {
    it('should negate positive number', () => {
      engine.inputDigit('5');
      expect(engine.negate()).toBe('-5');
    });

    it('should negate negative number back to positive', () => {
      engine.inputDigit('5');
      engine.negate();
      expect(engine.negate()).toBe('5');
    });

    it('should handle zero', () => {
      expect(engine.negate()).toBe('0');
    });
  });

  describe('getExpression', () => {
    it('should return expression with operator', () => {
      engine.inputDigit('5');
      engine.performOperation('+');
      engine.inputDigit('3');
      expect(engine.getExpression()).toBe('5 + 3');
    });

    it('should return current value when no operator', () => {
      engine.inputDigit('5');
      expect(engine.getExpression()).toBe('5');
    });
  });

  describe('complex calculations', () => {
    it('should handle chain of operations', () => {
      engine.inputDigit('10');
      engine.performOperation('+');
      engine.inputDigit('5');
      engine.performOperation('*');
      engine.inputDigit('2');
      expect(engine.performOperation('=')).toBe('30');
    });

    it('should handle decimals in calculations', () => {
      engine.inputDigit('2');
      engine.inputDecimal();
      engine.inputDigit('5');
      engine.performOperation('+');
      engine.inputDigit('1');
      engine.inputDecimal();
      engine.inputDigit('5');
      expect(engine.performOperation('=')).toBe('4');
    });
  });
});

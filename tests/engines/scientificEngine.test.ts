import { ScientificCalculatorEngine } from '../../src/renderer/engines/scientificEngine';

describe('ScientificCalculatorEngine', () => {
  let engine: ScientificCalculatorEngine;

  beforeEach(() => {
    engine = new ScientificCalculatorEngine();
  });

  describe('evaluate', () => {
    it('should evaluate simple arithmetic', () => {
      expect(engine.evaluate('5 + 3')).toBe(8);
    });

    it('should evaluate complex expressions', () => {
      expect(engine.evaluate('(2 + 3) * 4')).toBe(20);
    });

    it('should handle decimals', () => {
      expect(engine.evaluate('2.5 * 4')).toBe(10);
    });

    it('should throw error for invalid expression', () => {
      expect(() => engine.evaluate('invalid')).toThrow();
    });
  });

  describe('trigonometric functions - radians', () => {
    it('should calculate sin in radians', () => {
      expect(engine.sin(0, 'rad')).toBeCloseTo(0);
      expect(engine.sin(Math.PI / 2, 'rad')).toBeCloseTo(1);
    });

    it('should calculate cos in radians', () => {
      expect(engine.cos(0, 'rad')).toBeCloseTo(1);
      expect(engine.cos(Math.PI, 'rad')).toBeCloseTo(-1);
    });

    it('should calculate tan in radians', () => {
      expect(engine.tan(0, 'rad')).toBeCloseTo(0);
      expect(engine.tan(Math.PI / 4, 'rad')).toBeCloseTo(1);
    });
  });

  describe('trigonometric functions - degrees', () => {
    it('should calculate sin in degrees', () => {
      expect(engine.sin(0, 'deg')).toBeCloseTo(0);
      expect(engine.sin(90, 'deg')).toBeCloseTo(1);
    });

    it('should calculate cos in degrees', () => {
      expect(engine.cos(0, 'deg')).toBeCloseTo(1);
      expect(engine.cos(180, 'deg')).toBeCloseTo(-1);
    });

    it('should calculate tan in degrees', () => {
      expect(engine.tan(0, 'deg')).toBeCloseTo(0);
      expect(engine.tan(45, 'deg')).toBeCloseTo(1);
    });
  });

  describe('inverse trigonometric functions - radians', () => {
    it('should calculate asin in radians', () => {
      expect(engine.asin(0, 'rad')).toBeCloseTo(0);
      expect(engine.asin(1, 'rad')).toBeCloseTo(Math.PI / 2);
    });

    it('should calculate acos in radians', () => {
      expect(engine.acos(1, 'rad')).toBeCloseTo(0);
      expect(engine.acos(0, 'rad')).toBeCloseTo(Math.PI / 2);
    });

    it('should calculate atan in radians', () => {
      expect(engine.atan(0, 'rad')).toBeCloseTo(0);
      expect(engine.atan(1, 'rad')).toBeCloseTo(Math.PI / 4);
    });
  });

  describe('inverse trigonometric functions - degrees', () => {
    it('should calculate asin in degrees', () => {
      expect(engine.asin(0, 'deg')).toBeCloseTo(0);
      expect(engine.asin(1, 'deg')).toBeCloseTo(90);
    });

    it('should calculate acos in degrees', () => {
      expect(engine.acos(1, 'deg')).toBeCloseTo(0);
      expect(engine.acos(0, 'deg')).toBeCloseTo(90);
    });

    it('should calculate atan in degrees', () => {
      expect(engine.atan(0, 'deg')).toBeCloseTo(0);
      expect(engine.atan(1, 'deg')).toBeCloseTo(45);
    });
  });

  describe('logarithmic functions', () => {
    it('should calculate log base 10', () => {
      expect(engine.log(100)).toBeCloseTo(2);
      expect(engine.log(1000)).toBeCloseTo(3);
    });

    it('should calculate natural log', () => {
      expect(engine.ln(Math.E)).toBeCloseTo(1);
      expect(engine.ln(1)).toBeCloseTo(0);
    });
  });

  describe('exponential functions', () => {
    it('should calculate e^x', () => {
      expect(engine.exp(0)).toBeCloseTo(1);
      expect(engine.exp(1)).toBeCloseTo(Math.E);
    });

    it('should calculate power', () => {
      expect(engine.power(2, 3)).toBe(8);
      expect(engine.power(5, 2)).toBe(25);
    });

    it('should handle negative exponents', () => {
      expect(engine.power(2, -1)).toBe(0.5);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of positive integers', () => {
      expect(engine.factorial(0)).toBe(1);
      expect(engine.factorial(5)).toBe(120);
      expect(engine.factorial(10)).toBe(3628800);
    });

    it('should throw error for negative numbers', () => {
      expect(() => engine.factorial(-1)).toThrow(
        'Factorial requires a non-negative integer'
      );
    });

    it('should throw error for non-integers', () => {
      expect(() => engine.factorial(2.5)).toThrow(
        'Factorial requires a non-negative integer'
      );
    });
  });

  describe('root functions', () => {
    it('should calculate square root', () => {
      expect(engine.sqrt(16)).toBe(4);
      expect(engine.sqrt(0)).toBe(0);
    });

    it('should calculate cube root', () => {
      expect(engine.cbrt(27)).toBeCloseTo(3);
      expect(engine.cbrt(-8)).toBeCloseTo(-2);
    });
  });

  describe('abs', () => {
    it('should return absolute value', () => {
      expect(engine.abs(5)).toBe(5);
      expect(engine.abs(-5)).toBe(5);
      expect(engine.abs(0)).toBe(0);
    });
  });

  describe('angle conversion', () => {
    it('should convert degrees to radians', () => {
      expect(engine.degToRad(180)).toBeCloseTo(Math.PI);
      expect(engine.degToRad(90)).toBeCloseTo(Math.PI / 2);
    });

    it('should convert radians to degrees', () => {
      expect(engine.radToDeg(Math.PI)).toBeCloseTo(180);
      expect(engine.radToDeg(Math.PI / 2)).toBeCloseTo(90);
    });
  });

  describe('constants', () => {
    it('should return pi', () => {
      expect(engine.getPi()).toBe(Math.PI);
    });

    it('should return e', () => {
      expect(engine.getE()).toBe(Math.E);
    });
  });

  describe('complex expressions', () => {
    it('should evaluate expression with trig functions', () => {
      const result = engine.evaluate('sin(0) + cos(0)');
      expect(result).toBeCloseTo(1);
    });

    it('should evaluate expression with logarithms', () => {
      const result = engine.evaluate('log10(100) + log(e)');
      expect(result).toBeCloseTo(3);
    });
  });
});

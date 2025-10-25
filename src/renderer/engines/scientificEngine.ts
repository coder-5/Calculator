import { create, all } from 'mathjs';

const math = create(all);

export class ScientificCalculatorEngine {
  public evaluate(expression: string): number {
    try {
      const result = math.evaluate(expression);
      return typeof result === 'number' ? result : parseFloat(result);
    } catch (error) {
      throw new Error(`Invalid expression: ${error}`);
    }
  }

  public sin(value: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const radValue = angleMode === 'deg' ? this.degToRad(value) : value;
    return math.sin(radValue) as number;
  }

  public cos(value: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const radValue = angleMode === 'deg' ? this.degToRad(value) : value;
    return math.cos(radValue) as number;
  }

  public tan(value: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const radValue = angleMode === 'deg' ? this.degToRad(value) : value;
    return math.tan(radValue) as number;
  }

  public asin(value: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const result = math.asin(value) as number;
    return angleMode === 'deg' ? this.radToDeg(result) : result;
  }

  public acos(value: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const result = math.acos(value) as number;
    return angleMode === 'deg' ? this.radToDeg(result) : result;
  }

  public atan(value: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const result = math.atan(value) as number;
    return angleMode === 'deg' ? this.radToDeg(result) : result;
  }

  public log(value: number): number {
    return math.log10(value) as number;
  }

  public ln(value: number): number {
    return math.log(value) as number;
  }

  public exp(value: number): number {
    return math.exp(value) as number;
  }

  public power(base: number, exponent: number): number {
    return math.pow(base, exponent) as number;
  }

  public factorial(value: number): number {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error('Factorial requires a non-negative integer');
    }
    return math.factorial(value) as number;
  }

  public sqrt(value: number): number {
    return math.sqrt(value) as number;
  }

  public cbrt(value: number): number {
    return math.cbrt(value) as number;
  }

  public abs(value: number): number {
    return math.abs(value) as number;
  }

  public degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  public radToDeg(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  public getPi(): number {
    return Math.PI;
  }

  public getE(): number {
    return Math.E;
  }
}

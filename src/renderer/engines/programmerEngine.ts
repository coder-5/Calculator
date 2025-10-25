import { NumberBase } from '../../shared/types';

export class ProgrammerCalculatorEngine {
  public convertBase(value: string, fromBase: NumberBase, toBase: NumberBase): string {
    const decimalValue = this.toDecimal(value, fromBase);
    return this.fromDecimal(decimalValue, toBase);
  }

  private toDecimal(value: string, fromBase: NumberBase): number {
    switch (fromBase) {
      case 'binary':
        return parseInt(value, 2);
      case 'octal':
        return parseInt(value, 8);
      case 'decimal':
        return parseInt(value, 10);
      case 'hexadecimal':
        return parseInt(value, 16);
      default:
        throw new Error('Invalid base');
    }
  }

  private fromDecimal(value: number, toBase: NumberBase): string {
    switch (toBase) {
      case 'binary':
        return value.toString(2);
      case 'octal':
        return value.toString(8);
      case 'decimal':
        return value.toString(10);
      case 'hexadecimal':
        return value.toString(16).toUpperCase();
      default:
        throw new Error('Invalid base');
    }
  }

  public bitwiseAnd(a: number, b: number): number {
    return a & b;
  }

  public bitwiseOr(a: number, b: number): number {
    return a | b;
  }

  public bitwiseXor(a: number, b: number): number {
    return a ^ b;
  }

  public bitwiseNot(value: number): number {
    return ~value;
  }

  public leftShift(value: number, positions: number): number {
    return value << positions;
  }

  public rightShift(value: number, positions: number): number {
    return value >> positions;
  }

  public rotateLeft(value: number, positions: number, bitWidth: number = 32): number {
    const mask = (1 << bitWidth) - 1;
    value = value & mask;
    return ((value << positions) | (value >>> (bitWidth - positions))) & mask;
  }

  public rotateRight(value: number, positions: number, bitWidth: number = 32): number {
    const mask = (1 << bitWidth) - 1;
    value = value & mask;
    return ((value >>> positions) | (value << (bitWidth - positions))) & mask;
  }

  public twosComplement(value: number, bitWidth: number = 32): number {
    return ~value + 1;
  }

  public getBitAt(value: number, position: number): number {
    return (value >> position) & 1;
  }

  public setBitAt(value: number, position: number, bit: 0 | 1): number {
    if (bit === 1) {
      return value | (1 << position);
    } else {
      return value & ~(1 << position);
    }
  }

  public countSetBits(value: number): number {
    let count = 0;
    while (value) {
      count += value & 1;
      value >>= 1;
    }
    return count;
  }
}

import { create, all } from 'mathjs';

const math = create(all);

export class BasicCalculatorEngine {
  private currentValue: string = '0';
  private previousValue: string = '';
  private operator: string | null = null;
  private waitingForOperand: boolean = false;

  public inputDigit(digit: string): string {
    if (this.waitingForOperand) {
      this.currentValue = digit;
      this.waitingForOperand = false;
    } else {
      this.currentValue = this.currentValue === '0' ? digit : this.currentValue + digit;
    }
    return this.currentValue;
  }

  public inputDecimal(): string {
    if (this.waitingForOperand) {
      this.currentValue = '0.';
      this.waitingForOperand = false;
    } else if (this.currentValue.indexOf('.') === -1) {
      this.currentValue += '.';
    }
    return this.currentValue;
  }

  public clear(): string {
    this.currentValue = '0';
    this.previousValue = '';
    this.operator = null;
    this.waitingForOperand = false;
    return this.currentValue;
  }

  public clearEntry(): string {
    this.currentValue = '0';
    return this.currentValue;
  }

  public performOperation(nextOperator: string): string {
    const inputValue = parseFloat(this.currentValue);

    if (this.previousValue === '') {
      this.previousValue = this.currentValue;
    } else if (this.operator) {
      const prevValue = parseFloat(this.previousValue);
      const result = this.calculate(prevValue, inputValue, this.operator);

      this.currentValue = String(result);
      this.previousValue = String(result);
    }

    this.waitingForOperand = true;
    this.operator = nextOperator;
    return this.currentValue;
  }

  public calculate(firstOperand: number, secondOperand: number, operator: string): number {
    switch (operator) {
      case '+':
        return math.add(firstOperand, secondOperand) as number;
      case '-':
        return math.subtract(firstOperand, secondOperand) as number;
      case '*':
      case '×':
        return math.multiply(firstOperand, secondOperand) as number;
      case '/':
      case '÷':
        if (secondOperand === 0) {
          throw new Error('Cannot divide by zero');
        }
        return math.divide(firstOperand, secondOperand) as number;
      case '%':
        return math.mod(firstOperand, secondOperand) as number;
      default:
        return secondOperand;
    }
  }

  public percentage(): string {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(value / 100);
    return this.currentValue;
  }

  public squareRoot(): string {
    const value = parseFloat(this.currentValue);
    if (value < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    this.currentValue = String(math.sqrt(value));
    return this.currentValue;
  }

  public square(): string {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(math.pow(value, 2));
    return this.currentValue;
  }

  public negate(): string {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(-value);
    return this.currentValue;
  }

  public getCurrentValue(): string {
    return this.currentValue;
  }

  public getExpression(): string {
    if (this.operator && this.previousValue) {
      return `${this.previousValue} ${this.operator} ${this.currentValue}`;
    }
    return this.currentValue;
  }
}

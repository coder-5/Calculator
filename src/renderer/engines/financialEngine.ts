export class FinancialCalculatorEngine {
  // Loan Payment Calculation (Monthly Payment)
  public calculateLoanPayment(
    principal: number,
    annualRate: number,
    years: number
  ): number {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return payment;
  }

  // Compound Interest
  public calculateCompoundInterest(
    principal: number,
    annualRate: number,
    years: number,
    compoundingFrequency: number = 12 // monthly by default
  ): number {
    const rate = annualRate / 100;
    const amount =
      principal *
      Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * years);

    return amount - principal; // Return just the interest
  }

  // Future Value with Compound Interest
  public calculateFutureValue(
    principal: number,
    annualRate: number,
    years: number,
    compoundingFrequency: number = 12
  ): number {
    const rate = annualRate / 100;
    return (
      principal *
      Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * years)
    );
  }

  // Simple Interest
  public calculateSimpleInterest(
    principal: number,
    annualRate: number,
    years: number
  ): number {
    return (principal * annualRate * years) / 100;
  }

  // Return on Investment (ROI)
  public calculateROI(initialInvestment: number, finalValue: number): number {
    return ((finalValue - initialInvestment) / initialInvestment) * 100;
  }

  // Depreciation (Straight Line)
  public calculateStraightLineDepreciation(
    cost: number,
    salvageValue: number,
    usefulLife: number
  ): number {
    return (cost - salvageValue) / usefulLife;
  }

  // Depreciation (Declining Balance)
  public calculateDecliningBalanceDepreciation(
    cost: number,
    rate: number,
    year: number
  ): number {
    return cost * Math.pow(1 - rate / 100, year - 1) * (rate / 100);
  }

  // Present Value
  public calculatePresentValue(
    futureValue: number,
    annualRate: number,
    years: number
  ): number {
    const rate = annualRate / 100;
    return futureValue / Math.pow(1 + rate, years);
  }

  // Annuity Future Value
  public calculateAnnuityFutureValue(
    payment: number,
    annualRate: number,
    years: number
  ): number {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      return payment * numberOfPayments;
    }

    return (
      (payment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) / monthlyRate
    );
  }

  // Annuity Present Value
  public calculateAnnuityPresentValue(
    payment: number,
    annualRate: number,
    years: number
  ): number {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      return payment * numberOfPayments;
    }

    return (
      (payment * (1 - Math.pow(1 + monthlyRate, -numberOfPayments))) / monthlyRate
    );
  }

  // Break-even Point
  public calculateBreakEvenPoint(
    fixedCosts: number,
    pricePerUnit: number,
    variableCostPerUnit: number
  ): number {
    return fixedCosts / (pricePerUnit - variableCostPerUnit);
  }

  // Net Present Value (NPV)
  public calculateNPV(
    initialInvestment: number,
    cashFlows: number[],
    discountRate: number
  ): number {
    const rate = discountRate / 100;
    let npv = -initialInvestment;

    cashFlows.forEach((cashFlow, index) => {
      npv += cashFlow / Math.pow(1 + rate, index + 1);
    });

    return npv;
  }
}

import { FinancialCalculatorEngine } from '../../src/renderer/engines/financialEngine';

describe('FinancialCalculatorEngine', () => {
  let engine: FinancialCalculatorEngine;

  beforeEach(() => {
    engine = new FinancialCalculatorEngine();
  });

  describe('calculateLoanPayment', () => {
    it('should calculate monthly payment for a loan', () => {
      const principal = 10000;
      const annualRate = 5;
      const years = 3;
      const payment = engine.calculateLoanPayment(principal, annualRate, years);
      expect(payment).toBeCloseTo(299.71, 2);
    });

    it('should handle zero interest rate', () => {
      const principal = 12000;
      const annualRate = 0;
      const years = 2;
      const payment = engine.calculateLoanPayment(principal, annualRate, years);
      expect(payment).toBeCloseTo(500, 2); // 12000 / 24 months
    });

    it('should calculate higher payment for higher interest', () => {
      const payment1 = engine.calculateLoanPayment(10000, 5, 3);
      const payment2 = engine.calculateLoanPayment(10000, 10, 3);
      expect(payment2).toBeGreaterThan(payment1);
    });
  });

  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest monthly', () => {
      const principal = 1000;
      const annualRate = 5;
      const years = 1;
      const interest = engine.calculateCompoundInterest(
        principal,
        annualRate,
        years,
        12
      );
      expect(interest).toBeCloseTo(51.16, 2);
    });

    it('should calculate compound interest annually', () => {
      const principal = 1000;
      const annualRate = 5;
      const years = 1;
      const interest = engine.calculateCompoundInterest(principal, annualRate, years, 1);
      expect(interest).toBeCloseTo(50, 2);
    });

    it('should return more interest with higher frequency', () => {
      const monthly = engine.calculateCompoundInterest(1000, 5, 1, 12);
      const annually = engine.calculateCompoundInterest(1000, 5, 1, 1);
      expect(monthly).toBeGreaterThan(annually);
    });
  });

  describe('calculateFutureValue', () => {
    it('should calculate future value with compound interest', () => {
      const principal = 1000;
      const annualRate = 5;
      const years = 5;
      const futureValue = engine.calculateFutureValue(principal, annualRate, years, 12);
      expect(futureValue).toBeGreaterThan(principal);
      expect(futureValue).toBeCloseTo(1283.36, 2);
    });

    it('should return principal when rate is zero', () => {
      const futureValue = engine.calculateFutureValue(1000, 0, 5, 12);
      expect(futureValue).toBeCloseTo(1000, 2);
    });
  });

  describe('calculateSimpleInterest', () => {
    it('should calculate simple interest', () => {
      const principal = 1000;
      const annualRate = 5;
      const years = 3;
      const interest = engine.calculateSimpleInterest(principal, annualRate, years);
      expect(interest).toBe(150);
    });

    it('should return zero when rate is zero', () => {
      const interest = engine.calculateSimpleInterest(1000, 0, 3);
      expect(interest).toBe(0);
    });

    it('should return zero when time is zero', () => {
      const interest = engine.calculateSimpleInterest(1000, 5, 0);
      expect(interest).toBe(0);
    });
  });

  describe('calculateROI', () => {
    it('should calculate positive ROI', () => {
      const roi = engine.calculateROI(10000, 12000);
      expect(roi).toBe(20); // 20% return
    });

    it('should calculate negative ROI', () => {
      const roi = engine.calculateROI(10000, 8000);
      expect(roi).toBe(-20); // -20% loss
    });

    it('should return 0% for no change', () => {
      const roi = engine.calculateROI(10000, 10000);
      expect(roi).toBe(0);
    });

    it('should calculate 100% ROI for doubling', () => {
      const roi = engine.calculateROI(5000, 10000);
      expect(roi).toBe(100);
    });
  });

  describe('calculateStraightLineDepreciation', () => {
    it('should calculate annual depreciation', () => {
      const cost = 50000;
      const salvageValue = 5000;
      const usefulLife = 10;
      const depreciation = engine.calculateStraightLineDepreciation(
        cost,
        salvageValue,
        usefulLife
      );
      expect(depreciation).toBe(4500); // (50000 - 5000) / 10
    });

    it('should handle zero salvage value', () => {
      const depreciation = engine.calculateStraightLineDepreciation(10000, 0, 5);
      expect(depreciation).toBe(2000); // 10000 / 5
    });
  });

  describe('calculateDecliningBalanceDepreciation', () => {
    it('should calculate depreciation for first year', () => {
      const cost = 10000;
      const rate = 20;
      const year = 1;
      const depreciation = engine.calculateDecliningBalanceDepreciation(
        cost,
        rate,
        year
      );
      expect(depreciation).toBe(2000); // 10000 * 0.2
    });

    it('should calculate depreciation for later years', () => {
      const depreciation1 = engine.calculateDecliningBalanceDepreciation(10000, 20, 1);
      const depreciation2 = engine.calculateDecliningBalanceDepreciation(10000, 20, 2);
      expect(depreciation2).toBeLessThan(depreciation1);
    });
  });

  describe('calculatePresentValue', () => {
    it('should calculate present value', () => {
      const futureValue = 1000;
      const annualRate = 5;
      const years = 5;
      const presentValue = engine.calculatePresentValue(
        futureValue,
        annualRate,
        years
      );
      expect(presentValue).toBeLessThan(futureValue);
      expect(presentValue).toBeCloseTo(783.53, 2);
    });

    it('should return future value when rate is zero', () => {
      const presentValue = engine.calculatePresentValue(1000, 0, 5);
      expect(presentValue).toBe(1000);
    });
  });

  describe('calculateAnnuityFutureValue', () => {
    it('should calculate future value of annuity', () => {
      const payment = 100;
      const annualRate = 5;
      const years = 10;
      const futureValue = engine.calculateAnnuityFutureValue(
        payment,
        annualRate,
        years
      );
      expect(futureValue).toBeGreaterThan(payment * years * 12);
      expect(futureValue).toBeCloseTo(15528.23, 2);
    });

    it('should handle zero interest rate', () => {
      const futureValue = engine.calculateAnnuityFutureValue(100, 0, 10);
      expect(futureValue).toBe(100 * 10 * 12);
    });
  });

  describe('calculateAnnuityPresentValue', () => {
    it('should calculate present value of annuity', () => {
      const payment = 100;
      const annualRate = 5;
      const years = 10;
      const presentValue = engine.calculateAnnuityPresentValue(
        payment,
        annualRate,
        years
      );
      expect(presentValue).toBeLessThan(payment * years * 12);
      expect(presentValue).toBeCloseTo(9428.13, 2);
    });

    it('should handle zero interest rate', () => {
      const presentValue = engine.calculateAnnuityPresentValue(100, 0, 10);
      expect(presentValue).toBe(100 * 10 * 12);
    });
  });

  describe('calculateBreakEvenPoint', () => {
    it('should calculate break-even point in units', () => {
      const fixedCosts = 10000;
      const pricePerUnit = 50;
      const variableCostPerUnit = 30;
      const breakEven = engine.calculateBreakEvenPoint(
        fixedCosts,
        pricePerUnit,
        variableCostPerUnit
      );
      expect(breakEven).toBe(500); // 10000 / (50 - 30) = 500 units
    });

    it('should handle different margins', () => {
      const breakEven1 = engine.calculateBreakEvenPoint(10000, 50, 40);
      const breakEven2 = engine.calculateBreakEvenPoint(10000, 50, 30);
      expect(breakEven1).toBeGreaterThan(breakEven2);
    });
  });

  describe('calculateNPV', () => {
    it('should calculate positive NPV', () => {
      const initialInvestment = 10000;
      const cashFlows = [3000, 4000, 5000, 6000];
      const discountRate = 10;
      const npv = engine.calculateNPV(initialInvestment, cashFlows, discountRate);
      expect(npv).toBeGreaterThan(0);
      expect(npv).toBeCloseTo(4641.87, 2);
    });

    it('should calculate negative NPV', () => {
      const initialInvestment = 20000;
      const cashFlows = [1000, 1000, 1000];
      const discountRate = 10;
      const npv = engine.calculateNPV(initialInvestment, cashFlows, discountRate);
      expect(npv).toBeLessThan(0);
    });

    it('should handle zero discount rate', () => {
      const npv = engine.calculateNPV(10000, [5000, 5000, 5000], 0);
      expect(npv).toBe(5000); // 15000 - 10000
    });
  });

  describe('edge cases', () => {
    it('should handle very small values', () => {
      const payment = engine.calculateLoanPayment(0.01, 5, 1);
      expect(payment).toBeGreaterThan(0);
    });

    it('should handle very large values', () => {
      const payment = engine.calculateLoanPayment(1000000, 5, 30);
      expect(payment).toBeGreaterThan(0);
    });
  });
});

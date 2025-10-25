type ConversionFunction = (value: number) => number;

interface ConversionMap {
  [key: string]: {
    [key: string]: ConversionFunction;
  };
}

export const unitConversions: ConversionMap = {
  Length: {
    'Meters-Kilometers': (v) => v / 1000,
    'Kilometers-Meters': (v) => v * 1000,
    'Meters-Centimeters': (v) => v * 100,
    'Centimeters-Meters': (v) => v / 100,
    'Meters-Millimeters': (v) => v * 1000,
    'Millimeters-Meters': (v) => v / 1000,
    'Meters-Miles': (v) => v * 0.000621371,
    'Miles-Meters': (v) => v / 0.000621371,
    'Meters-Feet': (v) => v * 3.28084,
    'Feet-Meters': (v) => v / 3.28084,
    'Meters-Inches': (v) => v * 39.3701,
    'Inches-Meters': (v) => v / 39.3701,
  },
  Weight: {
    'Kilograms-Grams': (v) => v * 1000,
    'Grams-Kilograms': (v) => v / 1000,
    'Kilograms-Pounds': (v) => v * 2.20462,
    'Pounds-Kilograms': (v) => v / 2.20462,
    'Kilograms-Ounces': (v) => v * 35.274,
    'Ounces-Kilograms': (v) => v / 35.274,
    'Grams-Milligrams': (v) => v * 1000,
    'Milligrams-Grams': (v) => v / 1000,
  },
  Temperature: {
    'Celsius-Fahrenheit': (v) => (v * 9) / 5 + 32,
    'Fahrenheit-Celsius': (v) => ((v - 32) * 5) / 9,
    'Celsius-Kelvin': (v) => v + 273.15,
    'Kelvin-Celsius': (v) => v - 273.15,
    'Fahrenheit-Kelvin': (v) => ((v - 32) * 5) / 9 + 273.15,
    'Kelvin-Fahrenheit': (v) => ((v - 273.15) * 9) / 5 + 32,
  },
  Volume: {
    'Liters-Milliliters': (v) => v * 1000,
    'Milliliters-Liters': (v) => v / 1000,
    'Liters-Gallons': (v) => v * 0.264172,
    'Gallons-Liters': (v) => v / 0.264172,
    'Liters-Cubic Meters': (v) => v / 1000,
    'Cubic Meters-Liters': (v) => v * 1000,
  },
  Area: {
    'Square Meters-Square Kilometers': (v) => v / 1000000,
    'Square Kilometers-Square Meters': (v) => v * 1000000,
    'Square Meters-Square Feet': (v) => v * 10.7639,
    'Square Feet-Square Meters': (v) => v / 10.7639,
    'Square Meters-Acres': (v) => v * 0.000247105,
    'Acres-Square Meters': (v) => v / 0.000247105,
  },
  Speed: {
    'Meters per Second-Kilometers per Hour': (v) => v * 3.6,
    'Kilometers per Hour-Meters per Second': (v) => v / 3.6,
    'Meters per Second-Miles per Hour': (v) => v * 2.23694,
    'Miles per Hour-Meters per Second': (v) => v / 2.23694,
    'Kilometers per Hour-Miles per Hour': (v) => v * 0.621371,
    'Miles per Hour-Kilometers per Hour': (v) => v / 0.621371,
  },
  Time: {
    'Seconds-Minutes': (v) => v / 60,
    'Minutes-Seconds': (v) => v * 60,
    'Minutes-Hours': (v) => v / 60,
    'Hours-Minutes': (v) => v * 60,
    'Hours-Days': (v) => v / 24,
    'Days-Hours': (v) => v * 24,
  },
};

export function convertUnit(
  value: number,
  category: string,
  fromUnit: string,
  toUnit: string
): number {
  if (fromUnit === toUnit) return value;

  const key = `${fromUnit}-${toUnit}`;
  const categoryConversions = unitConversions[category];

  if (!categoryConversions) {
    throw new Error(`Unknown category: ${category}`);
  }

  const conversion = categoryConversions[key];
  if (!conversion) {
    throw new Error(`Unknown conversion: ${key} in category ${category}`);
  }

  return conversion(value);
}

export function getUnitsForCategory(category: string): string[] {
  const conversions = unitConversions[category];
  if (!conversions) return [];

  const units = new Set<string>();
  Object.keys(conversions).forEach((key) => {
    const [from, to] = key.split('-');
    units.add(from);
    units.add(to);
  });

  return Array.from(units).sort();
}

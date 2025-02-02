export function formatIndianNumber(num: number): string {
  const numStr = num.toFixed(2);
  const [wholePart, decimalPart] = numStr.split('.');

  // Add commas for Indian number system
  const lastThree = wholePart.slice(-3);
  const otherNumbers = wholePart.slice(0, -3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${formatted ? formatted + ',' : ''}${lastThree}.${decimalPart}`;
}

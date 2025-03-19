export const calculatePercentageChange = (
  valueFrom: number,
  valueTo: number
): number => {
  if (!valueFrom) {
    return 0;
  }
  return ((valueTo - valueFrom) / valueFrom) * 100;
};

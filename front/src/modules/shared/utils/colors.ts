export const generateLightBlueColor = (index: number): string => {
  const baseColor = [115, 103, 240];
  const step = 5;

  const opacity = Math.random() * 0.8 + 0.2;

  const color = baseColor.map((value, idx) => {
    const variation = (index + idx) * step;
    return Math.min(value + variation, 255);
  });

  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
};

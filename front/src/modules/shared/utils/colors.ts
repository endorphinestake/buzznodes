export const generateLightBlueColor = (index: number): string => {
  const baseRed = 100;
  const baseGreen = 150;
  const baseBlueStart = 220;
  const baseBlueEnd = 255;

  const step = 255 / 500;

  const opacity = Math.random() * 0.5 + 0.5;

  const blue = Math.min(baseBlueStart + index * step, baseBlueEnd);

  const green = Math.min(baseGreen + ((index * 0.3) % 40), 200);

  const red = baseRed;

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

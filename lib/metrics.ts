export const calculateSpeed = (
  correctWords: number,
  time_in_seconds: number
) => {
  return +((correctWords * 60) / time_in_seconds).toFixed(2);
};

export const calculateConsistency = (wpm: number[]) => {
  const mean = wpm.reduce((x, y) => x + y, 0) / wpm.length;
  const squaredDifference = wpm.map((wpm) => Math.pow(wpm - mean, 2));
  const variance =
    squaredDifference.reduce((acc, val) => acc + val, 0) / wpm.length;
  const stdDev = Math.sqrt(variance);
  const referenceValue = mean;

  const consistency = ((referenceValue - stdDev) / referenceValue) * 100;
  return +consistency.toFixed(2);
};

export const calculateAccuracy = (
  correctWords: number,
  activeWord: number,
  activeChar: number
) => {
  return +(
    (correctWords /
      (activeWord == 0
        ? activeWord + 1
        : activeChar == 0
        ? activeWord
        : activeWord + 1)) *
    100
  ).toFixed(2);
};

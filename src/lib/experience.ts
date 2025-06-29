
const XP_BASE_PER_LEVEL = 100;

/**
 * Calculates the user's level, progress, and XP details based on total accumulated XP.
 * The XP required for the next level increases by 20% for each level.
 * @param totalXp The total experience points the user has.
 * @returns An object containing level, current XP, XP within the current level,
 * XP needed for the next level, and the progress percentage towards the next level.
 */
export const calculateLevel = (totalXp: number) => {
  if (totalXp < 0) totalXp = 0;

  let level = 1;
  let xpForNext = XP_BASE_PER_LEVEL;
  let remainingXp = totalXp;

  // Loop until we find the current level by subtracting the XP needed for each level
  while (remainingXp >= xpForNext) {
    remainingXp -= xpForNext;
    level++;
    xpForNext = Math.floor(xpForNext * 1.2); // Increase XP needed by 20% for the next level
  }

  return {
    level,
    currentXp: totalXp,
    xpInLevel: remainingXp,
    xpForNextLevel: xpForNext,
    progress: (remainingXp / xpForNext) * 100,
  };
};

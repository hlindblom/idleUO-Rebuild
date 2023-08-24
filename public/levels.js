let levels = {};

for (let i = 1; i <= 59; i++) {
  // Using a quadratic growth function for the XP requirements
  levels[i] = Math.floor(50 * i * i - 50 * i + 100);
}

window.levels = levels;

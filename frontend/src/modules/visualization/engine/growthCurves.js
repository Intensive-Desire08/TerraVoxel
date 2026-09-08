// growthCurves.js
// Implements Chapman-Richards growth model: H(t) = H_max * (1 - exp(-k * t))^m

/**
 * Calculate the expected height of a tree at a given year.
 * @param {number} t - Time in years
 * @param {number} hMax - Maximum height of the tree species in meters
 * @param {number} k - Growth rate constant (default 0.3)
 * @param {number} m - Shape parameter (default 1.5)
 * @returns {number} Height in meters
 */
export function calculateHeight(t, hMax, k = 0.3, m = 1.5) {
  if (t <= 0) return 0;
  return hMax * Math.pow(1 - Math.exp(-k * t), m);
}

/**
 * Calculate the scaling factor for a tree instance based on its current height relative to max height.
 * We'll use this to scale the 3D model uniformly.
 * @param {number} currentHeight - The current height of the tree
 * @param {number} originalModelHeight - The real-world height of the GLB model (assumed to be 10m for normalisation)
 * @returns {number} Scale factor
 */
export function calculateScaleFactor(currentHeight, originalModelHeight = 10) {
  // If the 3D model is modeled at 10m tall, and currentHeight is 5m, scale is 0.5.
  // Using a small base scale so trees are visible at year 0/1.
  const baseScale = 0.05; 
  const targetScale = currentHeight / originalModelHeight;
  return Math.max(baseScale, targetScale);
}

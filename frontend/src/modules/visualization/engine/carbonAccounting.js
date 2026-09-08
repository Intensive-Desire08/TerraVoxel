// carbonAccounting.js
// Compute biomass, CO2e, and carbon credits per year based on tree growth.

// Basic carbon accounting constants (mock values)
const CONSTANTS = {
  // Metric tons of CO2 per cubic meter of wood
  CO2_PER_CUBIC_METER: 0.8,
  // Price per metric ton of carbon credit in USD
  PRICE_PER_CREDIT_USD: 25.0,
};

/**
 * Calculates the total carbon metrics for a given year.
 * @param {Array} treeInstances - Array of tree instance data with their current heights
 * @param {Object} speciesPlan - Species metadata from the backend
 * @param {number} currentYear - The simulation year
 * @returns {Object} Carbon metrics
 */
export function calculateCarbonMetrics(treeInstances, speciesPlan, currentYear) {
  let totalBiomassVolume = 0;
  
  treeInstances.forEach(tree => {
    const species = speciesPlan.species;
    const r = species.canopy_radius_m * 0.2; 
    const h = tree.currentHeight;
    const volume = Math.PI * r * r * h * 0.5;
    totalBiomassVolume += volume;
  });

  const co2Sequestered = totalBiomassVolume * CONSTANTS.CO2_PER_CUBIC_METER;
  const creditsEarned = Math.floor(co2Sequestered);
  const revenueUSD = creditsEarned * CONSTANTS.PRICE_PER_CREDIT_USD;

  return {
    year: currentYear,
    co2Sequestered: parseFloat(co2Sequestered.toFixed(2)),
    creditsEarned,
    revenueUSD,
    totalBiomassVolume: parseFloat(totalBiomassVolume.toFixed(2))
  };
}

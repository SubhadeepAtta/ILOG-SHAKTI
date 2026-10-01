import { SupplyItem, SimulationParameters } from '../types/logistics';

export interface BurnRateCalculation {
  itemId: string;
  itemName: string;
  category: string;
  baseBurn: number;
  projectedDailyBurn: number;
  currentStock: number;
  projectedDaysOfSupply: number;
  isCritical: boolean;
  environmentalMultiplier: number;
}

/**
 * Calculates predictive daily burn rates based on real high-altitude military logistics variables:
 * - Sub-zero temperatures exponentially increase Arctic Fuel (Bukhari heating + engine idling) and Class I caloric needs
 * - Troop surge proportionally scales Rations and Ammo reserve burn
 * - Operational readiness posture scales Class V and Class III reserves
 */
export function calculateProjectedBurnRates(
  items: SupplyItem[],
  stockOverrides: Record<string, number>,
  params: SimulationParameters,
  postElevationMeters: number,
  postBaseGarrison: number
): BurnRateCalculation[] {
  const troopFactor = (1 + (params.troopSurgePercent / 100)) * Math.max(0.5, postBaseGarrison / 120);
  
  // High altitude caloric & heating degradation factor
  const elevationFactor = Math.max(1.0, 1 + (postElevationMeters - 3000) / 10000);
  
  // Severe sub-zero temperature penalty on fuel and rations
  const tempDeltaBelowZero = Math.max(0, -params.ambientTempOffsetC);
  const thermalFuelMultiplier = 1 + (tempDeltaBelowZero * 0.028); // e.g. at -30C -> 1.84x fuel burn
  const thermalCaloricMultiplier = 1 + (tempDeltaBelowZero * 0.012); // e.g. at -30C -> 1.36x rations

  // Posture multipliers
  const postureMultiplierMap = {
    PEACE_BUFFER: 1.0,
    WINTER_STOCKING: 1.25,
    OP_ALERT_HIGH: 1.75
  };
  const postureFactor = postureMultiplierMap[params.operationalPosture] || 1.0;

  return items.map((item) => {
    const currentStock = stockOverrides[item.id] !== undefined ? stockOverrides[item.id] : item.currentStock;
    let environmentalMultiplier = 1.0;

    if (item.category === 'CLASS_III') {
      environmentalMultiplier = thermalFuelMultiplier * elevationFactor;
    } else if (item.category === 'CLASS_I') {
      environmentalMultiplier = thermalCaloricMultiplier * elevationFactor;
    } else if (item.category === 'CLASS_V') {
      environmentalMultiplier = (params.operationalPosture === 'OP_ALERT_HIGH' ? 2.4 : 1.0);
    } else if (item.category === 'CLASS_II') {
      environmentalMultiplier = 1 + (tempDeltaBelowZero * 0.01);
    }

    const projectedDailyBurn = Math.max(
      0.1,
      item.dailyBurnRateBase * troopFactor * environmentalMultiplier * (item.category === 'CLASS_V' ? postureFactor : 1.0)
    );

    const projectedDaysOfSupply = projectedDailyBurn > 0 ? (currentStock / projectedDailyBurn) : 999;
    const isCritical = projectedDaysOfSupply <= 7 || currentStock <= item.criticalThreshold;

    return {
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      baseBurn: item.dailyBurnRateBase,
      projectedDailyBurn: Number(projectedDailyBurn.toFixed(1)),
      currentStock,
      projectedDaysOfSupply: Number(projectedDaysOfSupply.toFixed(1)),
      isCritical,
      environmentalMultiplier: Number(environmentalMultiplier.toFixed(2))
    };
  });
}

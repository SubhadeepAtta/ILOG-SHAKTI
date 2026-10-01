export type SupplyClass = 'CLASS_I' | 'CLASS_II' | 'CLASS_III' | 'CLASS_IV' | 'CLASS_V';

export interface SupplyItem {
  id: string;
  name: string;
  code: string;
  category: SupplyClass;
  categoryLabel: string;
  unit: string;
  weightPerUnitKg: number;
  currentStock: number;
  authorizedStock: number;
  criticalThreshold: number;
  dailyBurnRateBase: number;
  shelfLifeDays?: number;
  storageCondition?: string;
  temperatureSensitive?: boolean;
  minTempC?: number;
  maxTempC?: number;
}

export interface ForwardPost {
  id: string;
  code: string;
  name: string;
  sector: 'LADAKH_NORTH' | 'SIACHEN_SUBSECTOR' | 'KARGIL_DRAS' | 'EASTERN_TAWANG';
  formation: string;
  coordinates: {
    lat: number;
    lng: number;
    mgrs: string;
  };
  elevationMeters: number;
  temperatureC: number;
  weatherCondition: 'CLEAR' | 'SNOWING' | 'BLIZZARD' | 'FOG_LOW_VISIBILITY' | 'AVALANCHE_WARNING';
  connectivityStatus: 'VSAT_ONLINE' | 'DDN_DEGRADED' | 'OFFLINE_MESH';
  garrisonStrength: number;
  currentDaysOfSupply: number;
  criticalItemAlertsCount: number;
  stock: Record<string, number>;
}

export type PassCondition = 'OPEN' | 'ONE_WAY_RESTRICTED' | 'CHAINS_MANDATORY' | 'CLOSED_BLIZZARD' | 'CLOSED_AVALANCHE';

export interface MountainPass {
  id: string;
  name: string;
  elevationFt: number;
  axis: string;
  status: PassCondition;
  snowDepthCm: number;
  clearanceEtaHours: number;
  clearingDozerUnits: number;
  lastUpdatedZulu: string;
  coordinates: { x: number; y: number };
}

export type ConvoyVehicleType = 'ALS_4X4' | 'STALLION_6X6' | 'SNOWCAT_BV206' | 'MI17_V5_AIRLIFT';

export interface ConvoyVehicle {
  id: string;
  callSign: string;
  type: ConvoyVehicleType;
  maxPayloadKg: number;
  currentPayloadKg: number;
  driverRankName: string;
  iotTelemetry: {
    speedKmph: number;
    fuelLevelPct: number;
    coolantTempC: number;
    axleStrainPct: number;
    cargoTempC?: number;
    heaterActive?: boolean;
    lat: number;
    lng: number;
  };
  cargo: {
    itemId: string;
    itemName: string;
    quantity: number;
    weightKg: number;
  }[];
}

export interface ConvoyMovement {
  id: string;
  convoyNumber: string;
  originNode: string;
  destinationNode: string;
  primaryAxis: string;
  contingencyAxis?: string;
  departureTimeZulu: string;
  estimatedArrivalZulu: string;
  status: 'STAGING' | 'EN_ROUTE' | 'HOLD_AT_TCP' | 'DIVERTED' | 'ARRIVED';
  alertStatus?: 'NORMAL' | 'WEATHER_HOLD' | 'AVALANCHE_REROUTE';
  vehicles: ConvoyVehicle[];
  currentProgressPct: number;
  currentLocationName: string;
}

export type PriorityLevel = 'OP_IMMEDIATE' | 'PRIORITY' | 'ROUTINE';

export interface RequisitionIndent {
  voucherNumber: string;
  date: string;
  originUnit: string;
  formation: string;
  destinationPostId: string;
  destinationPostName: string;
  supplyClass: SupplyClass;
  priority: PriorityLevel;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    unit: string;
    justification: string;
  }[];
  authorizingOfficer: {
    rank: string;
    name: string;
    appointment: string;
    serviceNumber: string;
  };
  operationalNotes: string;
  syncState: 'LOCAL_SYNC_PENDING' | 'TRANSMITTED_HQ' | 'APPROVED_CONVOY_MANIFESTED';
  timestampZulu: string;
}

export interface SimulationParameters {
  ambientTempOffsetC: number;
  snowfallSeverityCm: number;
  troopSurgePercent: number;
  roadClosureDelayHours: number;
  operationalPosture: 'PEACE_BUFFER' | 'WINTER_STOCKING' | 'OP_ALERT_HIGH';
}

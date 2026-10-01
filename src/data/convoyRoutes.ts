import { MountainPass, ConvoyMovement } from '../types/logistics';

export const MOUNTAIN_PASSES: MountainPass[] = [
  {
    id: 'pass-khardung-la',
    routeCode: 'R-17',
    name: 'Khardung La Pass (Route R-17)',
    elevationFt: 17982,
    axis: 'Leh - South Pullu - North Pullu - Partapur (Nubra / Siachen)',
    status: 'CHAINS_MANDATORY',
    snowDepthCm: 48,
    clearanceEtaHours: 0,
    clearingDozerUnits: 3,
    lastUpdatedZulu: '1640Z',
    coordinates: { x: 420, y: 280 }
  },
  {
    id: 'pass-chang-la',
    routeCode: 'R-21',
    name: 'Chang La Pass (Route R-21)',
    elevationFt: 17688,
    axis: 'Karu - Shakti - Chang La - Tangste - Durbuk (Pangong / DSDBO)',
    status: 'OPEN',
    snowDepthCm: 18,
    clearanceEtaHours: 0,
    clearingDozerUnits: 2,
    lastUpdatedZulu: '1615Z',
    coordinates: { x: 580, y: 340 }
  },
  {
    id: 'pass-zojila',
    routeCode: 'R-32',
    name: 'Zojila Pass (Route R-32)',
    elevationFt: 11575,
    axis: 'Sonamarg - Baltal - Zojila - Dras - Kargil - Leh (NH-1D)',
    status: 'ONE_WAY_RESTRICTED',
    snowDepthCm: 72,
    clearanceEtaHours: 2.5,
    clearingDozerUnits: 5,
    lastUpdatedZulu: '1655Z',
    coordinates: { x: 190, y: 390 }
  },
  {
    id: 'pass-fotu-la',
    routeCode: 'R-09',
    name: 'Fotu La Pass (Route R-09)',
    elevationFt: 13478,
    axis: 'Kargil - Bodhkharbu - Fotu La - Lamayuru - Khalsi',
    status: 'OPEN',
    snowDepthCm: 12,
    clearanceEtaHours: 0,
    clearingDozerUnits: 1,
    lastUpdatedZulu: '1530Z',
    coordinates: { x: 300, y: 370 }
  },
  {
    id: 'pass-sasser-la',
    routeCode: 'R-44',
    name: 'Sasser La Transit Zone (Route R-44)',
    elevationFt: 17753,
    axis: 'Panamik - Sasser La - Shyok Valley (Special High-Altitude Route)',
    status: 'CLOSED_BLIZZARD',
    snowDepthCm: 135,
    clearanceEtaHours: 18,
    clearingDozerUnits: 2,
    lastUpdatedZulu: '1620Z',
    coordinates: { x: 510, y: 160 }
  }
];

export const INITIAL_CONVOYS: ConvoyMovement[] = [
  {
    id: 'cnv-14c-409',
    convoyNumber: 'CNV/14C/ASC/409',
    originNode: '14 Corps FSD Leh',
    destinationNode: 'Post 114 (Siachen Ridge Sector)',
    primaryAxis: 'Leh-Khardung La-Partapur-Siachen Base',
    contingencyAxis: 'Air-bridge via Partapur Aviation Base (ALH / Mi-17)',
    departureTimeZulu: '0430Z',
    estimatedArrivalZulu: '1845Z',
    status: 'EN_ROUTE',
    alertStatus: 'NORMAL',
    currentProgressPct: 58,
    currentLocationName: 'North Pullu TCP (Approaching Nubra)',
    vehicles: [
      {
        id: 'v-01',
        callSign: 'TIGER-1',
        type: 'STALLION_6X6',
        maxPayloadKg: 5000,
        currentPayloadKg: 4620,
        driverRankName: 'Havildar R. S. Yadav',
        iotTelemetry: {
          speedKmph: 24,
          fuelLevelPct: 82,
          coolantTempC: 84,
          axleStrainPct: 78,
          lat: 34.62,
          lng: 77.58
        },
        cargo: [
          { itemId: 'sku-cl3-01', itemName: 'Arctic HSD Diesel (24 Barrels)', quantity: 24, weightKg: 4128 },
          { itemId: 'sku-cl2-02', itemName: 'Glacier Crampons & Rigging', quantity: 40, weightKg: 44 }
        ]
      },
      {
        id: 'v-02',
        callSign: 'TIGER-2',
        type: 'ALS_4X4',
        maxPayloadKg: 2500,
        currentPayloadKg: 2150,
        driverRankName: 'Naik Gurpreet Singh',
        iotTelemetry: {
          speedKmph: 22,
          fuelLevelPct: 77,
          coolantTempC: 82,
          axleStrainPct: 86,
          cargoTempC: -16.5,
          heaterActive: true,
          lat: 34.61,
          lng: 77.58
        },
        cargo: [
          { itemId: 'sku-cl1-01', itemName: 'SHAPR Mk-IV Rations', quantity: 800, weightKg: 1160 },
          { itemId: 'sku-med-01', itemName: 'Cryo-Blood Plasma (IoT Box #7)', quantity: 45, weightKg: 99 },
          { itemId: 'sku-cl5-01', itemName: '81mm Mortar Bombs', quantity: 30, weightKg: 855 }
        ]
      }
    ]
  },
  {
    id: 'cnv-14c-412',
    convoyNumber: 'CNV/14C/AOC/412',
    originNode: '14 Corps FSD Leh',
    destinationNode: 'Daulat Beg Oldi (DBO Post & ALG)',
    primaryAxis: 'Leh-Karu-Chang La-Durbuk-Shyok-DSDBO Road',
    contingencyAxis: 'Air Drop via C-130J / Il-76 to DBO ALG',
    departureTimeZulu: '0200Z',
    estimatedArrivalZulu: '2130Z',
    status: 'HOLD_AT_TCP',
    alertStatus: 'WEATHER_HOLD',
    currentProgressPct: 34,
    currentLocationName: 'Shakti Staging Post (Pre-Chang La TCP)',
    vehicles: [
      {
        id: 'v-03',
        callSign: 'GARUDA-4',
        type: 'STALLION_6X6',
        maxPayloadKg: 5000,
        currentPayloadKg: 4850,
        driverRankName: 'Subedar M. L. Sharma',
        iotTelemetry: {
          speedKmph: 0,
          fuelLevelPct: 88,
          coolantTempC: 68,
          axleStrainPct: 82,
          lat: 34.02,
          lng: 77.81
        },
        cargo: [
          { itemId: 'sku-cl3-01', itemName: 'Arctic HSD Diesel', quantity: 20, weightKg: 3440 },
          { itemId: 'sku-cl5-02', itemName: '7.62x51mm Ammo Belts', quantity: 45, weightKg: 1341 }
        ]
      }
    ]
  }
];

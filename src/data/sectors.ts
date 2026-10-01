import { ForwardPost } from '../types/logistics';

export const FORWARD_POSTS: ForwardPost[] = [
  {
    id: 'post-siachen-114',
    designator: 'B-17',
    code: 'FDL-SN-114',
    name: 'Forward Post B-17 (Siachen Ridge Sector)',
    sector: 'SIACHEN_SUBSECTOR',
    formation: '102 Indep Inf Bde / 3 Inf Div',
    coordinates: {
      lat: 35.421,
      lng: 77.108,
      mgrs: '43S EU 8291 1904'
    },
    elevationMeters: 5680,
    temperatureC: -31,
    weatherCondition: 'BLIZZARD',
    connectivityStatus: 'OFFLINE_MESH',
    garrisonStrength: 84,
    currentDaysOfSupply: 6.8,
    criticalItemAlertsCount: 2,
    stock: {
      'sku-cl1-01': 570,
      'sku-cl1-02': 190,
      'sku-cl2-01': 72,
      'sku-cl2-02': 64,
      'sku-cl3-01': 148, // Arctic Diesel running low due to 24/7 heater use
      'sku-cl3-02': 110,
      'sku-cl3-03': 12,
      'sku-cl4-01': 6,
      'sku-cl5-01': 48,
      'sku-cl5-02': 94,
      'sku-med-01': 11  // Cryo-Plasma near minimum critical threshold
    }
  },
  {
    id: 'post-dbo-alg',
    designator: 'B-18',
    code: 'FDU-DSDBO-01',
    name: 'Forward Post B-18 (Daulat Beg Oldi ALG)',
    sector: 'LADAKH_NORTH',
    formation: 'Sub-Sector North (SSN) HQ',
    coordinates: {
      lat: 35.398,
      lng: 77.925,
      mgrs: '43S FU 5832 1782'
    },
    elevationMeters: 5065,
    temperatureC: -26,
    weatherCondition: 'SNOWING',
    connectivityStatus: 'DDN_DEGRADED',
    garrisonStrength: 210,
    currentDaysOfSupply: 11.4,
    criticalItemAlertsCount: 1,
    stock: {
      'sku-cl1-01': 1850,
      'sku-cl1-02': 610,
      'sku-cl2-01': 185,
      'sku-cl2-02': 130,
      'sku-cl3-01': 460,
      'sku-cl3-02': 380,
      'sku-cl3-03': 180,
      'sku-cl4-01': 24,
      'sku-cl5-01': 190,
      'sku-cl5-02': 420,
      'sku-med-01': 32
    }
  },
  {
    id: 'post-galwan-km120',
    designator: 'B-19',
    code: 'FDL-GLW-12',
    name: 'Forward Post B-19 (Galwan KM-120)',
    sector: 'LADAKH_NORTH',
    formation: '81 Bde / 3 Inf Div',
    coordinates: {
      lat: 34.785,
      lng: 78.182,
      mgrs: '43S FU 8219 5013'
    },
    elevationMeters: 4420,
    temperatureC: -22,
    weatherCondition: 'CLEAR',
    connectivityStatus: 'VSAT_ONLINE',
    garrisonStrength: 135,
    currentDaysOfSupply: 16.2,
    criticalItemAlertsCount: 0,
    stock: {
      'sku-cl1-01': 1420,
      'sku-cl1-02': 440,
      'sku-cl2-01': 120,
      'sku-cl2-02': 88,
      'sku-cl3-01': 410,
      'sku-cl3-02': 290,
      'sku-cl3-03': 40,
      'sku-cl4-01': 18,
      'sku-cl5-01': 140,
      'sku-cl5-02': 310,
      'sku-med-01': 24
    }
  },
  {
    id: 'post-chushul-gap',
    designator: 'B-22',
    code: 'FDU-CSL-03',
    name: 'Forward Post B-22 (Chushul Sector)',
    sector: 'LADAKH_NORTH',
    formation: '114 Inf Bde',
    coordinates: {
      lat: 33.582,
      lng: 78.650,
      mgrs: '43S GU 2541 1809'
    },
    elevationMeters: 4330,
    temperatureC: -19,
    weatherCondition: 'CLEAR',
    connectivityStatus: 'VSAT_ONLINE',
    garrisonStrength: 180,
    currentDaysOfSupply: 22.5,
    criticalItemAlertsCount: 0,
    stock: {
      'sku-cl1-01': 2100,
      'sku-cl1-02': 780,
      'sku-cl2-01': 210,
      'sku-cl2-02': 140,
      'sku-cl3-01': 680,
      'sku-cl3-02': 460,
      'sku-cl3-03': 90,
      'sku-cl4-01': 35,
      'sku-cl5-01': 240,
      'sku-cl5-02': 510,
      'sku-med-01': 45
    }
  },
  {
    id: 'post-dras-tololing',
    designator: 'B-08',
    code: 'FDL-DRS-08',
    name: 'Forward Post B-08 (Dras Tololing Axis)',
    sector: 'KARGIL_DRAS',
    formation: '56 Mtn Bde / 8 Mtn Div',
    coordinates: {
      lat: 34.431,
      lng: 75.761,
      mgrs: '43S DT 6012 1109'
    },
    elevationMeters: 3820,
    temperatureC: -18,
    weatherCondition: 'SNOWING',
    connectivityStatus: 'VSAT_ONLINE',
    garrisonStrength: 125,
    currentDaysOfSupply: 14.1,
    criticalItemAlertsCount: 0,
    stock: {
      'sku-cl1-01': 1350,
      'sku-cl1-02': 420,
      'sku-cl2-01': 115,
      'sku-cl2-02': 90,
      'sku-cl3-01': 390,
      'sku-cl3-02': 310,
      'sku-cl3-03': 30,
      'sku-cl4-01': 14,
      'sku-cl5-01': 160,
      'sku-cl5-02': 290,
      'sku-med-01': 22
    }
  },
  {
    id: 'post-leh-base',
    designator: 'HQ-14',
    code: 'HQ-14CORPS-FSD',
    name: 'HQ-14 Base Depot (14 Corps FSD Leh)',
    sector: 'LADAKH_NORTH',
    formation: 'HQ 14 Corps Logistics Command',
    coordinates: {
      lat: 34.152,
      lng: 77.577,
      mgrs: '43S FT 2490 8011'
    },
    elevationMeters: 3500,
    temperatureC: -11,
    weatherCondition: 'CLEAR',
    connectivityStatus: 'VSAT_ONLINE',
    garrisonStrength: 1450,
    currentDaysOfSupply: 68.0,
    criticalItemAlertsCount: 0,
    stock: {
      'sku-cl1-01': 45000,
      'sku-cl1-02': 18000,
      'sku-cl2-01': 4800,
      'sku-cl2-02': 3200,
      'sku-cl3-01': 12500,
      'sku-cl3-02': 8900,
      'sku-cl3-03': 3100,
      'sku-cl4-01': 740,
      'sku-cl5-01': 4800,
      'sku-cl5-02': 11200,
      'sku-med-01': 850
    }
  }
];

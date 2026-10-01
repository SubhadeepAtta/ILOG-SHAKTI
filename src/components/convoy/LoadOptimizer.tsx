import React, { useState } from 'react';
import { ForwardPost, ConvoyVehicleType } from '../../types/logistics';
import { INVENTORY_CATALOG } from '../../data/inventoryItems';
import { Truck, ShieldCheck, AlertTriangle, Scale, Plus, Trash2, Plane, Box } from 'lucide-react';
import { formatWeightKg } from '../../utils/formatters';

interface LoadOptimizerProps {
  posts: ForwardPost[];
  onManifestCreated?: (manifest: any) => void;
}

interface LoadedItem {
  itemId: string;
  quantity: number;
}

export const LoadOptimizer: React.FC<LoadOptimizerProps> = ({ posts }) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<ConvoyVehicleType>('STALLION_6X6');
  const [targetPostId, setTargetPostId] = useState<string>('post-siachen-114');
  const [loadedItems, setLoadedItems] = useState<LoadedItem[]>([
    { itemId: 'sku-cl3-01', quantity: 18 }, // Arctic Diesel barrels
    { itemId: 'sku-cl1-01', quantity: 450 }, // SHAPR Mk-IV Rations
    { itemId: 'sku-med-01', quantity: 25 },  // Medical Cryo-Plasma
  ]);

  const targetPost = posts.find((p) => p.id === targetPostId) || posts[0];

  // Vehicle payload ratings
  const vehicleSpecs: Record<ConvoyVehicleType, {
    name: string;
    description: string;
    nominalPayloadKg: number;
    terrainCapability: string;
  }> = {
    ALS_4X4: {
      name: 'Ashok Leyland 4x4 (ALS 2.5T)',
      description: 'Rugged medium terrain cargo truck, high mobility',
      nominalPayloadKg: 2500,
      terrainCapability: 'Medium gradient, narrow passes'
    },
    STALLION_6X6: {
      name: 'Ashok Leyland 6x6 Stallion (5T)',
      description: 'Heavy tactical military logistics carrier, winch-equipped',
      nominalPayloadKg: 5000,
      terrainCapability: 'Standard military axes, snow chains compatible'
    },
    SNOWCAT_BV206: {
      name: 'Hägglunds Bv-206 All-Terrain Carrier',
      description: 'Tracked articulated vehicle for deep snow & crevasses',
      nominalPayloadKg: 2000,
      terrainCapability: 'Glacier terrain, off-road snowdrifts'
    },
    MI17_V5_AIRLIFT: {
      name: 'IAF Mi-17 V5 Tactical Airlift (Helicopter)',
      description: 'Tactical transport helicopter, underslung / internal bay',
      nominalPayloadKg: 4000,
      terrainCapability: 'Helipad / ALG drop, severe weather dependent'
    }
  };

  const currentVehicle = vehicleSpecs[selectedVehicleType];

  // High altitude payload de-rating calculation
  // At >4000m, air density is low, decreasing payload envelope
  const altitudePenaltyRatio = Math.max(0.70, 1 - Math.max(0, (targetPost.elevationMeters - 3000) / 10000));
  const effectiveSafePayloadKg = Math.round(currentVehicle.nominalPayloadKg * altitudePenaltyRatio);

  // Calculate current total load weight
  const totalWeightKg = loadedItems.reduce((acc, curr) => {
    const item = INVENTORY_CATALOG.find((i) => i.id === curr.itemId);
    return acc + (item ? item.weightPerUnitKg * curr.quantity : 0);
  }, 0);

  const payloadPercentage = Math.round((totalWeightKg / effectiveSafePayloadKg) * 100);
  const isOverweight = totalWeightKg > effectiveSafePayloadKg;

  // Handlers for modifying manifest
  const handleUpdateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setLoadedItems(loadedItems.filter((i) => i.itemId !== itemId));
    } else {
      setLoadedItems(loadedItems.map((i) => (i.itemId === itemId ? { ...i, quantity: qty } : i)));
    }
  };

  const handleAddItem = (itemId: string) => {
    const existing = loadedItems.find((i) => i.itemId === itemId);
    if (existing) {
      handleUpdateQty(itemId, existing.quantity + 10);
    } else {
      setLoadedItems([...loadedItems, { itemId, quantity: 10 }]);
    }
  };

  return (
    <div className="space-y-3 select-none font-mono text-xs">
      {/* Fleet Configuration Header */}
      <div className="bg-steel-900 border border-steel-800 rounded p-3">
        <div className="flex flex-wrap items-center justify-between pb-2.5 mb-2.5 border-b border-steel-800 gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-drab-900 border border-drab-700 text-khaki-300">
              <Scale className="w-4 h-4 text-drab-400" />
            </div>
            <div>
              <h2 className="font-bold uppercase tracking-wider text-khaki-100">
                MULTI-MODAL FLEET & HIGH-ALTITUDE CARGO LOAD OPTIMIZER
              </h2>
              <p className="text-[11px] text-steel-400">
                Dynamic high-altitude engine de-rating & axle-strain balancing for forward delivery
              </p>
            </div>
          </div>

          {/* Destination Forward Post */}
          <div className="flex items-center space-x-2">
            <span className="text-steel-400 text-[11px]">DESTINATION POST:</span>
            <select
              value={targetPostId}
              onChange={(e) => setTargetPostId(e.target.value)}
              className="bg-steel-950 text-khaki-200 border border-steel-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-drab-500"
            >
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.elevationMeters}m MSL)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicle Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {(Object.keys(vehicleSpecs) as ConvoyVehicleType[]).map((type) => {
            const spec = vehicleSpecs[type];
            const isSelected = selectedVehicleType === type;
            const Icon = type.includes('AIRLIFT') ? Plane : Truck;

            return (
              <button
                key={type}
                onClick={() => setSelectedVehicleType(type)}
                className={`p-2.5 rounded border text-left transition-all ${
                  isSelected
                    ? 'bg-drab-900/90 border-drab-500 text-khaki-100 shadow-sm'
                    : 'bg-steel-950/60 border-steel-800 text-steel-400 hover:text-khaki-300 hover:border-steel-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-khaki-300' : 'text-steel-400'}`} />
                  <span className="text-[10px] text-steel-500 font-bold">
                    NOMINAL: {formatWeightKg(spec.nominalPayloadKg)}
                  </span>
                </div>
                <div className="font-bold text-khaki-100 text-xs mt-1.5 line-clamp-1">
                  {spec.name}
                </div>
                <div className="text-[10px] text-steel-400 mt-0.5 line-clamp-1">
                  {spec.terrainCapability}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Altitude Penalty & Payload Envelope Summary */}
      <div className="bg-steel-900 border border-steel-800 rounded p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Column 1: Gross Weight Envelope */}
          <div className="bg-steel-950 p-2.5 rounded border border-steel-800">
            <span className="text-[10px] text-steel-500 block uppercase">SAFE PAYLOAD ENVELOPE</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-xl font-bold ${isOverweight ? 'text-red-400' : 'text-khaki-100'}`}>
                {formatWeightKg(totalWeightKg)}
              </span>
              <span className="text-steel-500 text-xs">/ {formatWeightKg(effectiveSafePayloadKg)} max</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-steel-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isOverweight
                    ? 'bg-red-500'
                    : payloadPercentage > 85
                    ? 'bg-amber-500'
                    : 'bg-drab-500'
                }`}
                style={{ width: `${Math.min(100, payloadPercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-steel-400 mt-1">
              <span>{payloadPercentage}% UTILIZED</span>
              <span>{isOverweight ? 'DANGEROUS OVERLOAD' : `${formatWeightKg(effectiveSafePayloadKg - totalWeightKg)} REMAINING`}</span>
            </div>
          </div>

          {/* Column 2: Altitude De-Rating Calculation */}
          <div className="bg-steel-950 p-2.5 rounded border border-steel-800 space-y-1 text-[11px] text-steel-400">
            <span className="text-[10px] text-steel-500 block uppercase">ALTITUDE DENSITY PENALTY</span>
            <div className="flex justify-between">
              <span>Delivery Elevation:</span>
              <strong className="text-khaki-200">{targetPost.elevationMeters}m MSL</strong>
            </div>
            <div className="flex justify-between">
              <span>Air Density Derate:</span>
              <strong className="text-amber-400">-{Math.round((1 - altitudePenaltyRatio) * 100)}% capacity reduction</strong>
            </div>
            <div className="flex justify-between text-[10px] text-steel-500">
              <span>Nominal: {formatWeightKg(currentVehicle.nominalPayloadKg)}</span>
              <span>Effective: {formatWeightKg(effectiveSafePayloadKg)}</span>
            </div>
          </div>

          {/* Column 3: Tactical Clearance Assessment */}
          <div className="bg-steel-950 p-2.5 rounded border border-steel-800 flex flex-col justify-center">
            {isOverweight ? (
              <div className="flex items-start space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <strong className="font-bold block text-xs">LOAD EXCEEDS MOUNTAIN PASS LIMIT:</strong>
                  <span className="text-[10px] text-red-300">
                    High risk of engine overheating or axle fracture on Khardung/Chang La pass gradients.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <div>
                  <strong className="font-bold block text-xs">CLEARED FOR FORWARD MOVEMENT:</strong>
                  <span className="text-[10px] text-steel-400">
                    Axle strain within safety tolerances (MIL-SPEC-810G). Route passability verified.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manifest Builder: Cargo Items Loaded */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left 2 Columns: Active Load Manifest */}
        <div className="lg:col-span-2 bg-steel-900 border border-steel-800 rounded p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-steel-800">
            <h3 className="font-bold uppercase tracking-wider text-khaki-100 flex items-center space-x-1.5">
              <Box className="w-4 h-4 text-khaki-400" />
              <span>VEHICLE CARGO MANIFEST ({loadedItems.length} STORES ALLOCATED)</span>
            </h3>
            <span className="text-[10px] text-steel-400">
              ASC CONSIGNMENT SLIP #CNV-REQ-26251
            </span>
          </div>

          {/* Manifest Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-950 text-steel-400 border-b border-steel-800 text-[11px]">
                <tr>
                  <th className="py-2 px-2.5">ITEM DESCRIPTION</th>
                  <th className="py-2 px-2">CLASS</th>
                  <th className="py-2 px-2">UNIT WEIGHT</th>
                  <th className="py-2 px-2">QTY</th>
                  <th className="py-2 px-2">TOTAL WEIGHT</th>
                  <th className="py-2 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-800/60">
                {loadedItems.map((loaded) => {
                  const item = INVENTORY_CATALOG.find((i) => i.id === loaded.itemId);
                  if (!item) return null;
                  const itemTotalWeight = item.weightPerUnitKg * loaded.quantity;

                  return (
                    <tr key={loaded.itemId} className="hover:bg-steel-850/50">
                      <td className="py-2 px-2.5">
                        <span className="font-semibold text-khaki-100 block">{item.name}</span>
                        <span className="text-[10px] text-steel-500">{item.code}</span>
                      </td>
                      <td className="py-2 px-2 text-steel-400 text-[10px]">
                        {item.category.replace('_', ' ')}
                      </td>
                      <td className="py-2 px-2 text-steel-400">
                        {item.weightPerUnitKg} kg
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleUpdateQty(loaded.itemId, loaded.quantity - 5)}
                            className="w-5 h-5 rounded bg-steel-800 text-khaki-300 hover:bg-steel-700 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-khaki-200">
                            {loaded.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(loaded.itemId, loaded.quantity + 5)}
                            className="w-5 h-5 rounded bg-steel-800 text-khaki-300 hover:bg-steel-700 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-khaki-100 font-bold">
                        {formatWeightKg(itemTotalWeight)}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={() => handleUpdateQty(loaded.itemId, 0)}
                          className="text-steel-500 hover:text-red-400 p-1"
                          title="Remove item from manifest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Quick Add Stores from Catalog */}
        <div className="lg:col-span-1 bg-steel-900 border border-steel-800 rounded p-3 flex flex-col space-y-2">
          <div className="pb-1.5 border-b border-steel-800 flex items-center justify-between">
            <h4 className="font-bold uppercase tracking-wider text-khaki-100 text-xs">
              ADD CATALOG STORES
            </h4>
            <span className="text-[10px] text-steel-400">CLICK TO LOAD</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[340px] pr-1">
            {INVENTORY_CATALOG.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddItem(item.id)}
                className="w-full text-left p-2 rounded bg-steel-950 border border-steel-800 hover:border-drab-600 hover:bg-steel-850 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold text-khaki-200 block text-[11px] line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-steel-500">
                    {item.weightPerUnitKg} kg/{item.unit} | {item.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-1 rounded bg-steel-900 text-khaki-400 hover:bg-drab-700 flex-shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

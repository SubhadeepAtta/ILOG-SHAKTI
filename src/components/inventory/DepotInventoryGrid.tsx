import React, { useState } from 'react';
import { ForwardPost } from '../../types/logistics';
import { INVENTORY_CATALOG } from '../../data/inventoryItems';
import { 
  Layers, 
  Thermometer, 
  Search, 
  Radio, 
  Zap, 
  Droplets 
} from 'lucide-react';

interface DepotInventoryGridProps {
  posts: ForwardPost[];
  selectedPostId: string;
  onSelectPost: (postId: string) => void;
}

export const DepotInventoryGrid: React.FC<DepotInventoryGridProps> = ({
  posts,
  selectedPostId,
  onSelectPost
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  const activePost = posts.find((p) => p.id === selectedPostId) || posts[0];

  // Filter items
  const filteredItems = INVENTORY_CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || item.category === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-3 select-none">
      {/* IoT Sensors Telemetry Live Strip */}
      <div className="bg-steel-900 border border-steel-800 rounded p-3">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-steel-800">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-khaki-100">
              LIVE IOT TELEMETRY & ENVIRONMENTAL REEFERS // {activePost.name}
            </h3>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>3 SENSORS REPORTING LIVE VIA TACTICAL TELEMETRY</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* IoT Sensor 1: Arctic Fuel Bladder Heaters */}
          <div className="bg-steel-950 p-2.5 rounded border border-steel-800">
            <div className="flex items-center justify-between text-[11px] text-steel-400 mb-1">
              <span className="flex items-center space-x-1 text-khaki-200 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>POL BLADDER HEATING (#2)</span>
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950 px-1 rounded border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <div className="space-y-1 text-steel-400 text-[11px]">
              <div className="flex justify-between">
                <span>Fuel Core Temp:</span>
                <span className="text-khaki-100 font-bold">-18.2°C (Safe Flow)</span>
              </div>
              <div className="flex justify-between">
                <span>Anti-Waxing Agitator:</span>
                <span className="text-khaki-200">120 RPM (Cycling)</span>
              </div>
              <div className="flex justify-between text-[10px] text-steel-500">
                <span>Power Draw: 1.4 kW</span>
                <span>Viscosity: 4.8 cSt</span>
              </div>
            </div>
          </div>

          {/* IoT Sensor 2: Stirling Cryo-Cooler Medical Blood Plasma */}
          <div className="bg-steel-950 p-2.5 rounded border border-steel-800">
            <div className="flex items-center justify-between text-[11px] text-steel-400 mb-1">
              <span className="flex items-center space-x-1 text-khaki-200 font-bold">
                <Thermometer className="w-3.5 h-3.5 text-red-400" />
                <span>CRYO-PLASMA STIRLING BOX</span>
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950 px-1 rounded border border-emerald-800">
                NOMINAL
              </span>
            </div>
            <div className="space-y-1 text-steel-400 text-[11px]">
              <div className="flex justify-between">
                <span>Chamber Temp:</span>
                <span className="text-khaki-100 font-bold">-19.5°C (-22°C to -4°C Req)</span>
              </div>
              <div className="flex justify-between">
                <span>Buffer Battery:</span>
                <span className="text-khaki-200">94% (LiFePO4 High-Altitude)</span>
              </div>
              <div className="flex justify-between text-[10px] text-steel-500">
                <span>Seal Integrity: SECURE</span>
                <span>Units Held: 11 Vials</span>
              </div>
            </div>
          </div>

          {/* IoT Sensor 3: Class V Ammo Magazine Humidity */}
          <div className="bg-steel-950 p-2.5 rounded border border-steel-800">
            <div className="flex items-center justify-between text-[11px] text-steel-400 mb-1">
              <span className="flex items-center space-x-1 text-khaki-200 font-bold">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>AMMO BUNKER HUMIDITY</span>
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950 px-1 rounded border border-emerald-800">
                DRY
              </span>
            </div>
            <div className="space-y-1 text-steel-400 text-[11px]">
              <div className="flex justify-between">
                <span>Relative Humidity:</span>
                <span className="text-khaki-100 font-bold">24% RH (Target &lt; 40%)</span>
              </div>
              <div className="flex justify-between">
                <span>Condensation Risk:</span>
                <span className="text-emerald-400">Zero Risk (Sub-zero dry)</span>
              </div>
              <div className="flex justify-between text-[10px] text-steel-500">
                <span>Desiccant Bed: 82% life</span>
                <span>Fuzes: Inspected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stock Inventory Register */}
      <div className="bg-steel-900 border border-steel-800 rounded p-3">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-steel-800 gap-2">
          {/* Post Selection & Counts */}
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded bg-drab-900 border border-drab-700 text-khaki-300">
              <Layers className="w-4 h-4 text-khaki-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-khaki-100">
                  FORWARD STOCK LEDGER
                </h3>
                <span className="text-steel-400 text-xs font-mono">FOR:</span>
                <select
                  value={selectedPostId}
                  onChange={(e) => onSelectPost(e.target.value)}
                  className="bg-steel-950 text-khaki-200 border border-steel-700 rounded px-2 py-0.5 text-xs font-mono focus:outline-none focus:border-drab-500"
                >
                  {posts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search & Class Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-steel-500" />
              <input
                type="text"
                placeholder="Search SKU or Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-steel-950 border border-steel-800 rounded pl-8 pr-3 py-1 text-xs font-mono text-khaki-200 focus:outline-none focus:border-drab-500 w-48"
              />
            </div>

            <div className="flex items-center space-x-1 font-mono text-[11px]">
              {['ALL', 'CLASS_I', 'CLASS_II', 'CLASS_III', 'CLASS_IV', 'CLASS_V'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2 py-1 rounded border ${
                    selectedClass === cls
                      ? 'bg-drab-800 border-drab-600 text-khaki-100'
                      : 'bg-steel-950 border-steel-800 text-steel-400 hover:text-khaki-200'
                  }`}
                >
                  {cls.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Register Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-steel-950 text-steel-400 border-b border-steel-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">MILITARY CODE</th>
                <th className="py-2.5 px-3">ITEM NOMENCLATURE</th>
                <th className="py-2.5 px-2">CLASS</th>
                <th className="py-2.5 px-2">UNIT</th>
                <th className="py-2.5 px-2">ON-HAND BALANCE</th>
                <th className="py-2.5 px-2">AUTHORIZED WSSR</th>
                <th className="py-2.5 px-2">CRITICAL BUFFER</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-800/60">
              {filteredItems.map((item) => {
                const stockQty = activePost.stock[item.id] !== undefined
                  ? activePost.stock[item.id]
                  : item.currentStock;
                const isUnderThreshold = stockQty <= item.criticalThreshold;
                const fillPct = Math.min(100, Math.round((stockQty / item.authorizedStock) * 100));

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-steel-850/50 transition-colors ${
                      isUnderThreshold ? 'bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-steel-400 text-[11px]">
                      {item.code}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-khaki-100 block">{item.name}</span>
                      {item.storageCondition && (
                        <span className="text-[10px] text-steel-500 block">{item.storageCondition}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-steel-400 text-[11px]">
                      {item.category.replace('_', ' ')}
                    </td>
                    <td className="py-2.5 px-2 text-steel-400 text-[11px]">
                      {item.unit}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className={`font-bold text-sm ${isUnderThreshold ? 'text-red-300' : 'text-khaki-100'}`}>
                        {stockQty.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-steel-400">
                      {item.authorizedStock.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-steel-500 text-[11px]">
                      {item.criticalThreshold.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-steel-950 h-1.5 rounded-full overflow-hidden border border-steel-800">
                          <div
                            className={`h-full rounded-full ${
                              isUnderThreshold ? 'bg-red-500' : 'bg-drab-500'
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${isUnderThreshold ? 'text-red-400' : 'text-steel-400'}`}>
                          {fillPct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

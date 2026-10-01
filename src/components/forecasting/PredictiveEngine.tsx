import React, { useState } from 'react';
import { ForwardPost, SimulationParameters } from '../../types/logistics';
import { INVENTORY_CATALOG } from '../../data/inventoryItems';
import { calculateProjectedBurnRates } from '../../utils/math';
import { 
  Cpu, 
  Thermometer, 
  Users, 
  Clock, 
  ShieldAlert, 
  Activity, 
  AlertCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { getDosStatusBadge } from '../../utils/formatters';

interface PredictiveEngineProps {
  posts: ForwardPost[];
  selectedPostId: string;
  onSelectPost: (postId: string) => void;
  simulationParams: SimulationParameters;
  onUpdateParams: (newParams: Partial<SimulationParameters>) => void;
}

export const PredictiveEngine: React.FC<PredictiveEngineProps> = ({
  posts,
  selectedPostId,
  onSelectPost,
  simulationParams,
  onUpdateParams
}) => {
  const [modelType, setModelType] = useState<'HYBRID_ML' | 'TRADITIONAL_MA'>('HYBRID_ML');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  const activePost = posts.find((p) => p.id === selectedPostId) || posts[0];

  // Calculate ML burn rate projections
  const burnCalculations = calculateProjectedBurnRates(
    INVENTORY_CATALOG,
    activePost.stock,
    simulationParams,
    activePost.elevationMeters,
    activePost.garrisonStrength
  );

  const filteredCalculations = selectedClassFilter === 'ALL'
    ? burnCalculations
    : burnCalculations.filter((c) => c.category === selectedClassFilter);

  // Critical items
  const criticalItems = burnCalculations.filter((c) => c.isCritical);

  return (
    <div className="space-y-3 select-none">
      {/* Top Banner: Scenario Parameters & Model Toggle */}
      <div className="bg-[#14191e] border border-[#242e37] p-3">
        <div className="flex flex-wrap items-center justify-between pb-2.5 mb-3 border-b border-[#242e37] gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-[#1a2228] border border-[#2e3b46] text-zinc-300">
              <Cpu className="w-4 h-4 text-neutral-300" />
            </div>
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100 flex items-center space-x-1.5">
                <span>HIGH-ALTITUDE THERMAL BURNDOWN & MULTI-VARIATE FORECAST</span>
                <span className="text-[10px] text-neutral-500 font-normal">(XGBoost v2.1)</span>
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Target Formation: <strong className="text-zinc-200">{activePost.name}</strong> ({activePost.elevationMeters}m MSL)
              </p>
            </div>
          </div>

          {/* Model Architecture Selector */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-neutral-400 text-[11px]">ALGORITHM:</span>
            <div className="inline-flex border border-[#2a3642] bg-[#0f1317] p-0.5">
              <button
                onClick={() => setModelType('HYBRID_ML')}
                className={`px-2 py-1 text-[11px] font-semibold transition-all ${
                  modelType === 'HYBRID_ML'
                    ? 'bg-[#25303c] text-zinc-100 border border-[#3b4c5e]'
                    : 'text-neutral-400 hover:text-zinc-200'
                }`}
              >
                MULTI-VARIATE REGRESSION (XGBoost v2.1)
              </button>
              <button
                onClick={() => setModelType('TRADITIONAL_MA')}
                className={`px-2 py-1 text-[11px] font-semibold transition-all ${
                  modelType === 'TRADITIONAL_MA'
                    ? 'bg-[#25303c] text-zinc-100 border border-[#3b4c5e]'
                    : 'text-neutral-400 hover:text-zinc-200'
                }`}
              >
                LEGACY STATIC BURN RATE (MAN-DAY)
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Contingency Stressor Sliders (Real-time recalculation) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          {/* Slider 1: Temperature Offset */}
          <div className="bg-[#101418] border border-[#1f2831] p-2.5">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="flex items-center space-x-1 text-[11px]">
                <Thermometer className="w-3.5 h-3.5 text-red-400" />
                <span>THERMAL PLUNGE:</span>
              </span>
              <span className="text-zinc-100 font-bold">{simulationParams.ambientTempOffsetC}°C</span>
            </div>
            <input
              type="range"
              min="-45"
              max="-5"
              step="1"
              value={simulationParams.ambientTempOffsetC}
              onChange={(e) => onUpdateParams({ ambientTempOffsetC: Number(e.target.value) })}
              className="w-full accent-neutral-400 bg-[#222b33] cursor-pointer h-1.5"
            />
            <span className="text-[10px] text-neutral-500 block mt-1">
              Fuel heating burn scales non-linearly below -20°C
            </span>
          </div>

          {/* Slider 2: Troop Surge */}
          <div className="bg-[#101418] border border-[#1f2831] p-2.5">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="flex items-center space-x-1 text-[11px]">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>TROOP MOBILIZATION:</span>
              </span>
              <span className="text-zinc-100 font-bold">+{simulationParams.troopSurgePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={simulationParams.troopSurgePercent}
              onChange={(e) => onUpdateParams({ troopSurgePercent: Number(e.target.value) })}
              className="w-full accent-neutral-400 bg-[#222b33] cursor-pointer h-1.5"
            />
            <span className="text-[10px] text-neutral-500 block mt-1">
              Reinforcement battalions deployed to forward FDL
            </span>
          </div>

          {/* Slider 3: Road Closure Delay */}
          <div className="bg-[#101418] border border-[#1f2831] p-2.5">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="flex items-center space-x-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>AXIS PASS BLOCKAGE:</span>
              </span>
              <span className="text-zinc-100 font-bold">+{simulationParams.roadClosureDelayHours} hrs</span>
            </div>
            <input
              type="range"
              min="0"
              max="96"
              step="6"
              value={simulationParams.roadClosureDelayHours}
              onChange={(e) => onUpdateParams({ roadClosureDelayHours: Number(e.target.value) })}
              className="w-full accent-neutral-400 bg-[#222b33] cursor-pointer h-1.5"
            />
            <span className="text-[10px] text-neutral-500 block mt-1">
              Delay in replenishment convoy arrival
            </span>
          </div>

          {/* Forward Formation Selector */}
          <div className="bg-[#101418] border border-[#1f2831] p-2.5 flex flex-col justify-between">
            <div>
              <span className="text-neutral-400 text-[11px] block mb-1">EVALUATE FORWARD POST:</span>
              <select
                value={selectedPostId}
                onChange={(e) => onSelectPost(e.target.value)}
                className="w-full bg-[#161c22] border border-[#2b3744] text-zinc-200 text-xs p-1 font-mono focus:outline-none focus:border-[#4f6479]"
              >
                {posts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.elevationMeters}m)
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Base strength: {activePost.garrisonStrength} troops
            </div>
          </div>
        </div>
      </div>

      {/* Model Insight Box: The High-Altitude Thermal Gap */}
      {modelType === 'HYBRID_ML' ? (
        <div className="bg-[#14191e] border border-[#242e37] p-2.5 flex items-start space-x-2 text-xs font-mono text-zinc-300">
          <Activity className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-100">THERMAL ENGINE COEFFICIENT EXPLANATION:</strong> At {activePost.elevationMeters}m altitude with ambient temperature of {simulationParams.ambientTempOffsetC}°C,
            fuel crystallization risk increases by 64%. Class III Arctic Diesel burn is adjusted upwards by <strong>{((1 + (-simulationParams.ambientTempOffsetC * 0.028)) * 100 - 100).toFixed(0)}%</strong> to power continuous thermal bladder agitators and bukhari heating units.
            Legacy static man-day calculations underestimate depletion by ~3.2 days.
          </div>
        </div>
      ) : (
        <div className="bg-amber-950/40 border border-amber-800 p-2.5 flex items-start space-x-2 text-xs font-mono text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>LEGACY LINEAR CALCULATION ACTIVE:</strong> Standard peacetime consumption factors assume uniform 1.0x burn rate.
            Environmental sub-zero factors, pass closures, and altitude thermal penalties are ignored.
          </div>
        </div>
      )}

      {/* Main Analysis Grid: 14-Day Depletion Projection & SKU Register */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left 2 Columns: Itemized Burn Register */}
        <div className="lg:col-span-2 bg-steel-900 border border-steel-800 rounded p-3 flex flex-col">
          <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-steel-800 text-xs font-mono gap-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-khaki-400" />
              <h3 className="font-bold uppercase tracking-wider text-khaki-100">
                PREDICTIVE STOCK BURNDOWN REGISTER
              </h3>
            </div>

            {/* Filter by Supply Class */}
            <div className="flex items-center space-x-1 text-[11px]">
              {['ALL', 'CLASS_I', 'CLASS_II', 'CLASS_III', 'CLASS_V'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-2 py-0.5 rounded border ${
                    selectedClassFilter === cls
                      ? 'bg-drab-800 border-drab-600 text-khaki-100'
                      : 'bg-steel-950 border-steel-800 text-steel-400 hover:text-khaki-200'
                  }`}
                >
                  {cls.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table of SKUs with Projected DOS */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-steel-950 text-steel-400 border-b border-steel-800 text-[11px]">
                <tr>
                  <th className="py-2 px-2.5">ITEM DESCRIPTION</th>
                  <th className="py-2 px-2">CLASS</th>
                  <th className="py-2 px-2">HELD ON POST</th>
                  <th className="py-2 px-2">BASE BURN</th>
                  <th className="py-2 px-2">AI PROJECTED BURN</th>
                  <th className="py-2 px-2">DAYS OF SUPPLY</th>
                  <th className="py-2 px-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-800/60">
                {filteredCalculations.map((c) => {
                  const badge = getDosStatusBadge(c.projectedDaysOfSupply);
                  return (
                    <tr
                      key={c.itemId}
                      className={`hover:bg-steel-850/60 transition-colors ${
                        c.isCritical ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="py-2 px-2.5">
                        <span className="font-semibold text-khaki-100 block">{c.itemName}</span>
                      </td>
                      <td className="py-2 px-2 text-steel-400 text-[10px]">
                        {c.category.replace('_', ' ')}
                      </td>
                      <td className="py-2 px-2 text-khaki-200 font-semibold">
                        {c.currentStock.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-steel-400">
                        {c.baseBurn} /day
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-amber-300 font-bold">
                          {c.projectedDailyBurn} /day
                        </span>
                        <span className="text-[10px] text-steel-500 block">
                          ({c.environmentalMultiplier}x stress)
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-khaki-100 font-bold text-sm">
                          {c.projectedDaysOfSupply} d
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Stock-Out Warning & Actionable Recommendation */}
        <div className="lg:col-span-1 bg-steel-900 border border-steel-800 rounded p-3 flex flex-col space-y-3 font-mono text-xs">
          <div className="pb-2 border-b border-steel-800 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="font-bold uppercase tracking-wider text-khaki-100">
                CRITICAL STOCK-OUT RISK ANALYSIS
              </h3>
            </div>
            <span className="text-red-400 font-bold bg-red-950 px-1.5 py-0.5 rounded border border-red-800 text-[10px]">
              {criticalItems.length} THREATS
            </span>
          </div>

          {/* List of critical threats */}
          <div className="space-y-2 overflow-y-auto flex-1">
            {criticalItems.length === 0 ? (
              <div className="p-3 bg-steel-950 rounded border border-steel-800 text-emerald-400 text-center text-xs">
                All supply items maintained above the 14-day operational safety threshold.
              </div>
            ) : (
              criticalItems.map((item) => (
                <div
                  key={item.itemId}
                  className="bg-red-950/30 border border-red-800/60 rounded p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-200 text-xs">{item.itemName}</span>
                    <span className="text-[10px] text-red-300 bg-red-900/60 px-1.5 py-0.2 rounded border border-red-700">
                      {item.projectedDaysOfSupply} DAYS LEFT
                    </span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-steel-400 space-y-0.5">
                    <div>Held: <strong className="text-khaki-200">{item.currentStock}</strong> | Projected burn: <strong className="text-amber-300">{item.projectedDailyBurn}/day</strong></div>
                    <div className="text-red-300/90 text-[10px]">
                      Projected Zero-Stockout Date: in {Math.floor(item.projectedDaysOfSupply * 24)} hours.
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Recommended Replenishment Directive */}
          <div className="bg-steel-950 border border-steel-800 p-2.5 rounded text-[11px] space-y-1.5">
            <span className="text-khaki-300 font-bold block uppercase text-[10px] flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-drab-400" />
              <span>COMMAND LOGISTICS DIRECTIVE:</span>
            </span>
            <p className="text-steel-400">
              Immediate convoy dispatch required from <strong>14 Corps FSD Leh</strong> via{' '}
              <strong className="text-khaki-200">Khardung La Axis</strong> within the next <strong>36 hours</strong> before anticipated Western Disturbance storm fronts close the pass.
            </p>
            <div className="pt-1 border-t border-steel-800 flex justify-between text-[10px]">
              <span className="text-steel-500">REQUIRED LIFT:</span>
              <span className="text-khaki-200 font-bold">2x Stallion 6x6 (9.2 Tonnes POL + Rations)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

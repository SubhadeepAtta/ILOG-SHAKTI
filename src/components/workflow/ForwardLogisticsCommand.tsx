import React, { useState } from 'react';
import { ForwardPost, MountainPass, ConvoyMovement } from '../../types/logistics';
import { Truck, FileText, Check } from 'lucide-react';

interface ForwardLogisticsCommandProps {
  posts: ForwardPost[];
  passes: MountainPass[];
  convoys: ConvoyMovement[];
  onNavigateModule: (module: any) => void;
  onSelectPost: (postId: string) => void;
}

export const ForwardLogisticsCommand: React.FC<ForwardLogisticsCommandProps> = ({
  posts,
  passes,
  convoys,
  onNavigateModule,
  onSelectPost
}) => {
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [simulatedStockB17, setSimulatedStockB17] = useState<number>(2140);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Helper to render authentic ASCII-like fill meter
  const renderMeter = (pct: number) => {
    const totalBlocks = 16;
    const filledBlocks = Math.round((pct / 100) * totalBlocks);
    const filled = '█'.repeat(filledBlocks);
    const empty = '░'.repeat(Math.max(0, totalBlocks - filledBlocks));
    return `${filled}${empty}`;
  };

  const handleSimulateDispatch = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setIsDispatched(true);
      setSimulatedStockB17(2760); // 2140 + 620
    }, 600);
  };

  const handleResetSimulation = () => {
    setIsDispatched(false);
    setSimulatedStockB17(2140);
  };

  // Find pass R-17
  const passR17 = passes.find((p) => p.routeCode === 'R-17');
  const passR21 = passes.find((p) => p.routeCode === 'R-21');
  const passR32 = passes.find((p) => p.routeCode === 'R-32');

  return (
    <div className="space-y-3 font-mono text-xs select-none">
      {/* Real-world software telemetry header */}
      <div className="bg-[#12161a] border border-[#222b33] p-2.5 flex flex-wrap items-center justify-between text-neutral-400 gap-2">
        <div className="flex items-center space-x-3">
          <span className="text-zinc-100 font-bold uppercase tracking-wider text-sm flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block"></span>
            <span>FORWARD LOGISTICS COMMAND</span>
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-[11px] text-neutral-400">XIV CORPS THEATER DIRECTORY</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>Data source: <strong className="text-zinc-300">Convoy Telemetry & ASC-SAP v4.2</strong></span>
          <span className="text-neutral-600">|</span>
          <span>Model: <strong className="text-zinc-300">XGBoost v2.1</strong></span>
          <span className="text-neutral-600">|</span>
          <span>Forecast window: <strong className="text-zinc-300">72h</strong></span>
          <span className="text-neutral-600">|</span>
          <span className="text-amber-400 bg-amber-950/60 px-1.5 py-0.5 border border-amber-800/80">
            ⚠ Telemetry delayed by 4 min (VSAT jitter)
          </span>
        </div>
      </div>

      {/* OPERATIONAL OVERVIEW RIBBON */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-[#14191e] border border-[#242e37] p-2.5">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wide">ACTIVE CONVOYS</div>
          <div className="text-xl font-bold text-zinc-100 mt-0.5">{String(convoys.length).padStart(2, '0')}</div>
          <div className="text-[10px] text-neutral-400 mt-1">2 heavy, 6 light ALS (NH-1D & DSDBO)</div>
        </div>

        <div className="bg-[#14191e] border border-[#242e37] p-2.5">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wide">CRITICAL SUPPLIES</div>
          <div className="text-xl font-bold text-amber-400 mt-0.5">14</div>
          <div className="text-[10px] text-neutral-400 mt-1">8 Arctic Fuel, 4 Plasma, 2 Ammo</div>
        </div>

        <div className="bg-[#14191e] border border-[#242e37] p-2.5">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wide">ROUTES AT RISK</div>
          <div className="text-xl font-bold text-red-400 mt-0.5">03</div>
          <div className="text-[10px] text-neutral-400 mt-1">R-17 (Chains), R-32 (1-Way), R-44 (Closed)</div>
        </div>

        <div className="bg-[#14191e] border border-[#242e37] p-2.5">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wide">UNITS REQUIRING RESUPPLY</div>
          <div className="text-xl font-bold text-zinc-100 mt-0.5">{String(posts.filter((p) => p.currentDaysOfSupply <= 14).length).padStart(2, '0')}</div>
          <div className="text-[10px] text-neutral-400 mt-1">B-17 Siachen priority lead</div>
        </div>
      </div>

      {/* MAIN DUAL ROW: SECTOR STATUS & SUPPLY STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left 2 Columns: SECTOR STATUS TABLE */}
        <div className="lg:col-span-2 bg-[#14191e] border border-[#242e37] p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#242e37]">
            <span className="font-bold text-zinc-100 uppercase tracking-wider text-xs">
              SECTOR STATUS // FORWARD DEFENSIVE LOCATIONS
            </span>
            <span className="text-[10px] text-neutral-500">
              UPDATED: 14:32:08 IST
            </span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-neutral-500 border-b border-[#222b33]">
                <tr>
                  <th className="py-1 px-2">SECTOR / POST</th>
                  <th className="py-1 px-2">ELEVATION</th>
                  <th className="py-1 px-2">FUEL (POL)</th>
                  <th className="py-1 px-2">AMMUNITION</th>
                  <th className="py-1 px-2">MEDICAL</th>
                  <th className="py-1 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e252c]">
                {/* B-17 */}
                <tr className="hover:bg-[#1a2128]">
                  <td className="py-2 px-2">
                    <span className="font-bold text-zinc-200">B-17</span>
                    <span className="text-neutral-400 text-[11px] block">Siachen Ridge Post 114</span>
                  </td>
                  <td className="py-2 px-2 text-neutral-400">5,680m</td>
                  <td className="py-2 px-2">
                    <span className={isDispatched ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {isDispatched ? 'Fuel: 68% (Safe)' : 'Fuel: 42% (Critical)'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-zinc-300">Ammo: 71%</td>
                  <td className="py-2 px-2 text-zinc-300">Medical: 83%</td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => onSelectPost('post-siachen-114')}
                      className="px-2 py-0.5 bg-[#1f2730] hover:bg-[#28323e] text-zinc-200 border border-[#303d4a] text-[10px]"
                    >
                      SELECT
                    </button>
                  </td>
                </tr>

                {/* B-18 */}
                <tr className="hover:bg-[#1a2128]">
                  <td className="py-2 px-2">
                    <span className="font-bold text-zinc-200">B-18</span>
                    <span className="text-neutral-400 text-[11px] block">Daulat Beg Oldi (DBO)</span>
                  </td>
                  <td className="py-2 px-2 text-neutral-400">5,065m</td>
                  <td className="py-2 px-2 text-zinc-300">Fuel: 76%</td>
                  <td className="py-2 px-2 text-amber-400 font-bold">Ammo: 39% (Watch)</td>
                  <td className="py-2 px-2 text-zinc-300">Medical: 91%</td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => onSelectPost('post-dbo-alg')}
                      className="px-2 py-0.5 bg-[#1f2730] hover:bg-[#28323e] text-zinc-200 border border-[#303d4a] text-[10px]"
                    >
                      SELECT
                    </button>
                  </td>
                </tr>

                {/* B-19 */}
                <tr className="hover:bg-[#1a2128]">
                  <td className="py-2 px-2">
                    <span className="font-bold text-zinc-200">B-19</span>
                    <span className="text-neutral-400 text-[11px] block">Galwan Forward KM-120</span>
                  </td>
                  <td className="py-2 px-2 text-neutral-400">4,420m</td>
                  <td className="py-2 px-2 text-zinc-300">Fuel: 58%</td>
                  <td className="py-2 px-2 text-zinc-300">Ammo: 84%</td>
                  <td className="py-2 px-2 text-amber-400 font-bold">Medical: 47% (Low)</td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => onSelectPost('post-galwan-km120')}
                      className="px-2 py-0.5 bg-[#1f2730] hover:bg-[#28323e] text-zinc-200 border border-[#303d4a] text-[10px]"
                    >
                      SELECT
                    </button>
                  </td>
                </tr>

                {/* B-22 */}
                <tr className="hover:bg-[#1a2128]">
                  <td className="py-2 px-2">
                    <span className="font-bold text-zinc-200">B-22</span>
                    <span className="text-neutral-400 text-[11px] block">Chushul Garrison</span>
                  </td>
                  <td className="py-2 px-2 text-neutral-400">4,330m</td>
                  <td className="py-2 px-2 text-zinc-300">Fuel: 82%</td>
                  <td className="py-2 px-2 text-zinc-300">Ammo: 68%</td>
                  <td className="py-2 px-2 text-zinc-300">Medical: 95%</td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => onSelectPost('post-chushul-gap')}
                      className="px-2 py-0.5 bg-[#1f2730] hover:bg-[#28323e] text-zinc-200 border border-[#303d4a] text-[10px]"
                    >
                      SELECT
                    </button>
                  </td>
                </tr>

                {/* B-08 */}
                <tr className="hover:bg-[#1a2128]">
                  <td className="py-2 px-2">
                    <span className="font-bold text-zinc-200">B-08</span>
                    <span className="text-neutral-400 text-[11px] block">Dras High-Ridge Node</span>
                  </td>
                  <td className="py-2 px-2 text-neutral-400">3,820m</td>
                  <td className="py-2 px-2 text-zinc-300">Fuel: 64%</td>
                  <td className="py-2 px-2 text-zinc-300">Ammo: 72%</td>
                  <td className="py-2 px-2 text-zinc-300">Medical: 78%</td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => onSelectPost('post-dras-tololing')}
                      className="px-2 py-0.5 bg-[#1f2730] hover:bg-[#28323e] text-zinc-200 border border-[#303d4a] text-[10px]"
                    >
                      SELECT
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: SUPPLY STATUS (ASCII-style dense meters) */}
        <div className="lg:col-span-1 bg-[#14191e] border border-[#242e37] p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#242e37]">
              <span className="font-bold text-zinc-100 uppercase tracking-wider text-xs">
                SUPPLY STATUS (THEATER AGGREGATE)
              </span>
              <span className="text-[10px] text-neutral-500">CORPS BUFFER</span>
            </div>

            <div className="space-y-2.5 text-xs pt-1">
              <div>
                <div className="flex justify-between text-neutral-300 mb-0.5">
                  <span>Fuel (Arctic Grade Diesel)</span>
                  <span className="font-bold">82%</span>
                </div>
                <div className="text-emerald-400 tracking-wider font-mono text-[11px]">
                  {renderMeter(82)}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-0.5">
                  <span>Ammunition (Small Arms & Mortar)</span>
                  <span className="font-bold">61%</span>
                </div>
                <div className="text-amber-400 tracking-wider font-mono text-[11px]">
                  {renderMeter(61)}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-0.5">
                  <span>Medical (Cryo-Plasma & Trauma)</span>
                  <span className="font-bold">74%</span>
                </div>
                <div className="text-emerald-400 tracking-wider font-mono text-[11px]">
                  {renderMeter(74)}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-0.5">
                  <span>Food (High-Altitude Pack Rations)</span>
                  <span className="font-bold">89%</span>
                </div>
                <div className="text-emerald-400 tracking-wider font-mono text-[11px]">
                  {renderMeter(89)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#222b33] text-[10px] text-neutral-500 flex justify-between">
            <span>Buffer Target: 45 Days (WSSR)</span>
            <span>Ref: IAF/LOG/DIR-104</span>
          </div>
        </div>
      </div>

      {/* DUAL COLUMN ROW: ROUTE STATUS & PREDICTIVE ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* ROUTE STATUS */}
        <div className="bg-[#14191e] border border-[#242e37] p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#242e37]">
            <span className="font-bold text-zinc-100 uppercase tracking-wider text-xs">
              ROUTE STATUS // MOUNTAIN AXES
            </span>
            <span className="text-[10px] text-neutral-500">BRO SATELLITE FEED</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-[#101418] border border-[#1f2831]">
              <div>
                <span className="font-bold text-zinc-200">R-17</span>
                <span className="text-neutral-400 ml-2">Khardung La Axis (17,982 ft)</span>
              </div>
              <span className={passR17?.status.startsWith('CLOSED') ? 'text-red-400 bg-red-950/60 px-2 py-0.5 border border-red-800 text-[10px] font-bold' : 'text-amber-400 bg-amber-950/60 px-2 py-0.5 border border-amber-800 text-[10px] font-bold'}>
                {passR17?.status === 'OPEN' ? '✓ Operational' : `⚠ ${passR17?.status.replace(/_/g, ' ') || 'Restricted'}`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#101418] border border-[#1f2831]">
              <div>
                <span className="font-bold text-zinc-200">R-21</span>
                <span className="text-neutral-400 ml-2">Chang La / DSDBO Axis (17,688 ft)</span>
              </div>
              <span className={passR21?.status.startsWith('CLOSED') ? 'text-red-400 bg-red-950/60 px-2 py-0.5 border border-red-800 text-[10px] font-bold' : 'text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 text-[10px] font-bold'}>
                {passR21?.status.startsWith('CLOSED') ? '⚠ Avalanche Blocked' : '✓ Operational'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#101418] border border-[#1f2831]">
              <div>
                <span className="font-bold text-zinc-200">R-32</span>
                <span className="text-neutral-400 ml-2">Zojila Pass NH-1D Axis (11,575 ft)</span>
              </div>
              <span className={passR32?.status.startsWith('CLOSED') ? 'text-red-400 bg-red-950/60 px-2 py-0.5 border border-red-800 text-[10px] font-bold' : 'text-yellow-400 bg-yellow-950/60 px-2 py-0.5 border border-yellow-800 text-[10px] font-bold'}>
                {passR32?.status === 'OPEN' ? '✓ Operational' : `⚠ ${passR32?.status.replace(/_/g, ' ') || 'One-Way Timed'}`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#101418] border border-[#1f2831]">
              <div>
                <span className="font-bold text-zinc-200">R-09</span>
                <span className="text-neutral-400 ml-2">Fotu La / Lamayuru Axis (13,478 ft)</span>
              </div>
              <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 text-[10px] font-bold">
                ✓ Operational
              </span>
            </div>
          </div>
        </div>

        {/* PREDICTIVE ALERTS */}
        <div className="bg-[#14191e] border border-[#242e37] p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#242e37]">
              <span className="font-bold text-zinc-100 uppercase tracking-wider text-xs">
                PREDICTIVE ALERTS (HORIZON: 72H)
              </span>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.2 border border-amber-800">
                3 ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-red-950/20 border border-red-800/60 flex items-start space-x-2">
                <span className="text-red-400 font-bold">●</span>
                <div>
                  <span className="font-bold text-red-200">B-17 fuel shortage in 38h</span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Continuous bukhari heaters and generator runtimes at -31°C will breach 500 L safety reserve.
                  </p>
                </div>
              </div>

              <div className="p-2 bg-amber-950/20 border border-amber-800/60 flex items-start space-x-2">
                <span className="text-amber-400 font-bold">●</span>
                <div>
                  <span className="font-bold text-amber-200">B-19 medical plasma shortage in 51h</span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Cryo-plasma Stirling cooler buffer battery cycling; restocking shipment pending staging.
                  </p>
                </div>
              </div>

              <div className="p-2 bg-[#101418] border border-[#1f2831] flex items-start space-x-2">
                <span className="text-yellow-400 font-bold">●</span>
                <div>
                  <span className="font-bold text-zinc-200">R-17 route delay (+4.5 hrs)</span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Snowdrift clearing underway at North Pullu. Tire chain mandate slowing convoy progress.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-neutral-500">
            Automated generation via High-Altitude Regression Model (v2.1)
          </div>
        </div>
      </div>

      {/* HERO WORKFLOW BOTTOM: REPLENISHMENT DIRECTIVE & REAL SYSTEM DETAILS */}
      <div className="bg-[#14191e] border border-[#242e37] p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#242e37] gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-100 uppercase tracking-wider text-xs">
              REPLENISHMENT DIRECTIVE // B-17 FUEL CRISIS MITIGATION
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">
            Target Node: <strong className="text-zinc-200">Forward Post B-17 (Siachen Ridge)</strong>
          </span>
        </div>

        {/* Real System Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs bg-[#101418] p-2.5 border border-[#1f2831]">
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">SECTOR</span>
            <span className="font-bold text-zinc-200">Post B-17</span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">STORE TYPE</span>
            <span className="font-bold text-zinc-200">Arctic Diesel</span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">CURRENT STOCK</span>
            <span className={isDispatched ? 'font-bold text-emerald-400' : 'font-bold text-amber-300'}>
              {simulatedStockB17.toLocaleString()} L
            </span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">EXP. CONSUMPTION</span>
            <span className="font-bold text-zinc-200">1,760 L (72h)</span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">SAFETY BUFFER</span>
            <span className="font-bold text-neutral-400">500 L</span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">DEFICIT HORIZON</span>
            <span className={isDispatched ? 'font-bold text-emerald-400' : 'font-bold text-red-400'}>
              {isDispatched ? '> 96 hrs' : '38 hrs'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">RECOM. DISPATCH</span>
            <span className="font-bold text-emerald-400">620 L</span>
          </div>
        </div>

        {/* Action Directive Bar */}
        <div className="p-3 bg-[#11161a] border border-[#212a32] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-zinc-100 font-bold block">
              RECOMMENDATION: Dispatch 620 L diesel to B-17 before next convoy window.
            </span>
            <span className="text-[11px] text-neutral-400">
              Allocates 3x 200L insulated barrels via scheduled Convoy CNV/14C/ASC/409 (Stallion 6x6).
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="px-3 py-1.5 bg-[#1a2128] hover:bg-[#222b34] text-zinc-300 border border-[#2e3a46] text-xs font-semibold"
            >
              {showReasoning ? 'Hide reasoning' : 'View reasoning'}
            </button>

            {isDispatched ? (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>DISPATCH STAGED (620 L ALLOCATED)</span>
                </span>
                <button
                  onClick={handleResetSimulation}
                  className="px-2 py-1.5 text-neutral-500 hover:text-zinc-300 text-[11px] underline"
                >
                  Reset
                </button>
              </div>
            ) : (
              <button
                onClick={handleSimulateDispatch}
                disabled={isSimulating}
                className="px-3.5 py-1.5 bg-[#2c4233] hover:bg-[#385341] text-zinc-100 border border-[#44664f] text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                {isSimulating ? (
                  <span>CALCULATING HEADROOM...</span>
                ) : (
                  <>
                    <Truck className="w-3.5 h-3.5" />
                    <span>SIMULATE DISPATCH</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onNavigateModule('REQUISITION')}
              className="px-3 py-1.5 bg-[#1a2128] hover:bg-[#232c36] text-zinc-300 border border-[#2e3a46] text-xs font-semibold flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ISSUE MOVEMENT ORDER (IAF-Z)</span>
            </button>
          </div>
        </div>

        {/* EXPLAINABLE AI REASONING PANEL */}
        {showReasoning && (
          <div className="p-3 bg-[#0d1013] border border-[#26313b] text-xs text-neutral-300 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1f2730]">
              <span className="font-bold text-zinc-100 uppercase tracking-wider text-[11px]">
                WHY THIS ALERT WAS GENERATED
              </span>
              <span className="text-[10px] text-red-400 font-bold bg-red-950/60 px-1.5 py-0.2 border border-red-800">
                RISK LEVEL: HIGH
              </span>
            </div>

            <ul className="space-y-1 text-[11px] text-neutral-400">
              <li className="flex items-center space-x-2">
                <span className="text-neutral-600 font-mono">•</span>
                <span>Current diesel stock: <strong className="text-zinc-200">2,140 L</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-neutral-600 font-mono">•</span>
                <span>Average daily consumption: <strong className="text-zinc-200">590 L</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-neutral-600 font-mono">•</span>
                <span>Expected consumption increase: <strong className="text-amber-400">+18%</strong> (Ambient temperature plunge to -31°C requires continuous heater idling)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-neutral-600 font-mono">•</span>
                <span>Road R-17 (Khardung La Axis): <strong className="text-amber-400">Currently restricted</strong> (BRO snowdrift alert)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-neutral-600 font-mono">•</span>
                <span>Next resupply window: <strong className="text-zinc-200">46 hrs</strong></span>
              </li>
            </ul>

            <div className="pt-2 border-t border-[#1f2730] flex justify-between text-[10px] text-neutral-500">
              <span>Decision Logic: Linear depletion intercept calculated at T+38.4 hours against 500 L baseline reserve.</span>
              <span>Formula: Stock_rem = 2140 - (590 * 1.18 * (t / 24))</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

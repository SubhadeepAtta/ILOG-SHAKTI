import React, { useState, useEffect } from 'react';
import { Shield, Wifi, WifiOff, Clock, AlertTriangle, Crosshair } from 'lucide-react';
import { formatMilitaryDate, formatZuluTime, formatISTTime } from '../../utils/formatters';
import { SimulationParameters } from '../../types/logistics';

interface TacticalHeaderProps {
  simulationParams: SimulationParameters;
  onUpdateParams: (newParams: Partial<SimulationParameters>) => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  criticalAlertCount: number;
  blockedPassCount: number;
  activeConvoyCount: number;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  simulationParams,
  onUpdateParams,
  isOfflineMode,
  onToggleOffline,
  criticalAlertCount,
  blockedPassCount,
  activeConvoyCount
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0c0f12] text-zinc-200 px-3 py-2 select-none border-b border-[#1f262e] font-mono">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Unit & System Identification */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-[#161c22] border border-[#2b3744] flex items-center justify-center text-zinc-300">
            <Shield className="w-4 h-4 text-neutral-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] tracking-wider px-1 py-0.2 bg-[#1b2229] border border-[#2a3541] text-zinc-300 uppercase font-semibold">
                HQ 14 CORPS // NORTHERN COMMAND
              </span>
              <span className="text-[10px] text-neutral-500">DSSC PS-26251</span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center space-x-1.5 mt-0.5">
              <span>ILOG-SHAKTI</span>
              <span className="text-neutral-600 font-normal">|</span>
              <span className="font-normal text-xs text-neutral-400 uppercase tracking-wide">
                FORWARD LOGISTICS COMMAND & REPLENISHMENT DIRECTIVE
              </span>
            </h1>
          </div>
        </div>

        {/* Tactical Controls & Status */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Live Zulu & IST Clocks */}
          <div className="flex items-center space-x-2 px-2.5 py-1 bg-[#13171c] border border-[#222b33] text-xs">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <div className="flex space-x-1.5">
              <span className="text-zinc-100 font-semibold">{formatZuluTime(time)}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">{formatISTTime(time)}</span>
            </div>
            <span className="text-neutral-600 border-l border-[#222b33] pl-2">
              {formatMilitaryDate(time)}
            </span>
          </div>

          {/* Operational Posture Selector */}
          <div className="flex items-center space-x-1.5 bg-[#13171c] border border-[#222b33] px-2 py-1 text-xs">
            <Crosshair className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400 hidden sm:inline text-[11px]">POSTURE:</span>
            <select
              value={simulationParams.operationalPosture}
              onChange={(e) => onUpdateParams({ operationalPosture: e.target.value as any })}
              className="bg-[#1b222a] text-zinc-200 border border-[#2e3b48] px-1.5 py-0.5 text-xs focus:outline-none focus:border-[#4f6479]"
            >
              <option value="PEACE_BUFFER">PEACE BUFFER (DEFCON-4)</option>
              <option value="WINTER_STOCKING">WSSR WINTER STOCKING (ACTIVE)</option>
              <option value="OP_ALERT_HIGH">OP-ALERT LEVEL 1 (DEFCON-2)</option>
            </select>
          </div>

          {/* Offline Resilient Mesh Sync Toggle */}
          <button
            onClick={onToggleOffline}
            title="Toggle border forward post running disconnected on local tactical mesh"
            className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs border transition-colors ${
              isOfflineMode
                ? 'bg-amber-950/80 border-amber-700 text-amber-200'
                : 'bg-[#13171c] border-[#222b33] text-neutral-400 hover:text-zinc-200'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-semibold text-[11px]">TACTICAL MESH (OFFLINE)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">VSAT SECURE (ONLINE)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Operational Summary Strip */}
      <div className="mt-1.5 pt-1.5 border-t border-[#1b2229] flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 inline-block"></span>
            <span>FORWARD POSTS: <strong className="text-zinc-200">6 MONITORED</strong></span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-sky-500 inline-block"></span>
            <span>ACTIVE CONVOYS: <strong className="text-zinc-200">{activeConvoyCount} IN TRANSIT</strong></span>
          </div>

          {blockedPassCount > 0 ? (
            <div className="flex items-center space-x-1.5 text-amber-400 bg-amber-950/40 px-1.5 py-0.2 border border-amber-800/60">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>PASS RESTRICTIONS: <strong>{blockedPassCount} BLOCKED/RESTRICTED</strong></span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <span>ALL STRATEGIC PASSES OPEN</span>
            </div>
          )}

          {criticalAlertCount > 0 && (
            <div className="flex items-center space-x-1.5 text-red-400 bg-red-950/40 px-1.5 py-0.2 border border-red-800/60">
              <span className="w-1.5 h-1.5 bg-red-500 inline-block"></span>
              <span>DEPLETION ALERTS: <strong>{criticalAlertCount} FORWARD POSTS &lt; 7 DOS</strong></span>
            </div>
          )}
        </div>

        <div className="text-[10px] text-neutral-500 flex items-center space-x-1">
          <span>CLASSIFICATION:</span>
          <span className="text-neutral-400 font-bold bg-[#14191e] px-1 border border-[#222b33]">
            RESTRICTED // MILITARY OPERATIONAL USE ONLY
          </span>
        </div>
      </div>
    </header>
  );
};

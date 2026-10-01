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
    <header className="tactical-header-bg text-khaki-100 px-4 py-2.5 select-none border-b border-steel-800">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Unit & System Identification */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-drab-900 border border-drab-700 flex items-center justify-center text-khaki-300 shadow-inner">
            <Shield className="w-6 h-6 text-drab-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-wider px-1.5 py-0.5 rounded bg-drab-800 border border-drab-600 text-khaki-300 uppercase font-semibold">
                HQ 14 CORPS // NORTHERN COMMAND
              </span>
              <span className="text-[11px] font-mono text-steel-400">SIH-26251 (DSSC)</span>
            </div>
            <h1 className="text-base font-bold tracking-tight text-khaki-50 flex items-center space-x-1.5 mt-0.5">
              <span>ILOG-SHAKTI</span>
              <span className="text-steel-500 font-normal">|</span>
              <span className="font-medium text-xs text-khaki-200 uppercase tracking-wide">
                Predictive Forward Logistics & Multi-Modal Supply Management
              </span>
            </h1>
          </div>
        </div>

        {/* Tactical Controls & Status */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Live Zulu & IST Clocks */}
          <div className="flex items-center space-x-3 px-3 py-1.5 rounded bg-steel-900 border border-steel-800 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-steel-400" />
            <div className="flex space-x-2">
              <span className="text-khaki-200 font-semibold">{formatZuluTime(time)}</span>
              <span className="text-steel-500">/</span>
              <span className="text-steel-300">{formatISTTime(time)}</span>
            </div>
            <span className="text-steel-500 font-normal border-l border-steel-800 pl-2">
              {formatMilitaryDate(time)}
            </span>
          </div>

          {/* Operational Posture Selector */}
          <div className="flex items-center space-x-1.5 bg-steel-900 border border-steel-800 px-2 py-1 rounded text-xs font-mono">
            <Crosshair className="w-3.5 h-3.5 text-khaki-400" />
            <span className="text-steel-400 hidden sm:inline">OP-POSTURE:</span>
            <select
              value={simulationParams.operationalPosture}
              onChange={(e) => onUpdateParams({ operationalPosture: e.target.value as any })}
              className="bg-steel-800 text-khaki-200 border border-steel-700 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-drab-500 font-mono"
            >
              <option value="PEACE_BUFFER">PEACE BUFFER (DEFCON-4)</option>
              <option value="WINTER_STOCKING">WSSR WINTER STOCKING (ACTIVE)</option>
              <option value="OP_ALERT_HIGH">OP-ALERT LEVEL 1 (DEFCON-2)</option>
            </select>
          </div>

          {/* Offline Resilient Mesh Sync Toggle */}
          <button
            onClick={onToggleOffline}
            title="Simulate border forward post running disconnected on local tactical mesh"
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              isOfflineMode
                ? 'bg-amber-950/80 border-amber-700 text-amber-200 hover:bg-amber-900/90'
                : 'bg-steel-900 border-steel-700 text-steel-300 hover:bg-steel-800'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-semibold">TACTICAL MESH (OFFLINE)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>VSAT SECURE (ONLINE)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Operational Summary Strip */}
      <div className="mt-2.5 pt-2 border-t border-steel-900 flex flex-wrap items-center justify-between text-xs font-mono text-steel-400 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>FORWARD POSTS: <strong className="text-khaki-200">6 MONITORED</strong></span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>ACTIVE CONVOYS: <strong className="text-khaki-200">{activeConvoyCount} IN TRANSIT</strong></span>
          </div>

          {blockedPassCount > 0 ? (
            <div className="flex items-center space-x-1.5 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>PASS RESTRICTIONS: <strong>{blockedPassCount} BLOCKED/RESTRICTED</strong></span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <span>ALL STRATEGIC PASSES OPEN</span>
            </div>
          )}

          {criticalAlertCount > 0 && (
            <div className="flex items-center space-x-1.5 text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/50">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>DEPLETION ALERTS: <strong>{criticalAlertCount} FORWARD POSTS &lt; 7 DOS</strong></span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-steel-500 flex items-center space-x-1">
          <span>CLASSIFICATION:</span>
          <span className="text-khaki-400 font-bold bg-steel-900 px-1 rounded border border-steel-800">
            RESTRICTED // FOR OFFICIAL OPERATIONAL USE ONLY
          </span>
        </div>
      </div>
    </header>
  );
};

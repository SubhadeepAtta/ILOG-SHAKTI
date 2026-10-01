import React from 'react';
import { MountainPass, PassCondition } from '../../types/logistics';
import { AlertTriangle, CheckCircle, ShieldAlert, Wrench } from 'lucide-react';

interface PassStatusPanelProps {
  passes: MountainPass[];
  onTogglePassStatus: (passId: string, newStatus: PassCondition) => void;
}

export const PassStatusPanel: React.FC<PassStatusPanelProps> = ({
  passes,
  onTogglePassStatus
}) => {
  const getBadgeStyle = (status: PassCondition) => {
    switch (status) {
      case 'OPEN':
        return {
          label: 'OPEN (CLEAR)',
          bg: 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300',
          icon: CheckCircle
        };
      case 'CHAINS_MANDATORY':
        return {
          label: 'CHAINS REQD',
          bg: 'bg-amber-950/70 border-amber-600/70 text-amber-300',
          icon: AlertTriangle
        };
      case 'ONE_WAY_RESTRICTED':
        return {
          label: 'ONE-WAY TIMED',
          bg: 'bg-yellow-950/70 border-yellow-600/70 text-yellow-300',
          icon: AlertTriangle
        };
      case 'CLOSED_BLIZZARD':
        return {
          label: 'CLOSED: BLIZZARD',
          bg: 'bg-red-950/80 border-red-600/80 text-red-200',
          icon: ShieldAlert
        };
      case 'CLOSED_AVALANCHE':
        return {
          label: 'CLOSED: AVALANCHE',
          bg: 'bg-red-950/90 border-red-500 text-red-100',
          icon: ShieldAlert
        };
    }
  };

  return (
    <div className="bg-steel-900 border border-steel-800 rounded p-3 select-none flex flex-col h-full">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-steel-800">
        <div className="flex items-center space-x-2">
          <Wrench className="w-4 h-4 text-khaki-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-khaki-100">
            STRATEGIC PASS PASSABILITY & BORDER ROADS (BRO) MONITOR
          </h3>
        </div>
        <span className="text-[11px] font-mono text-steel-400">
          5 STRATEGIC PASSES
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {passes.map((pass) => {
          const badge = getBadgeStyle(pass.status);
          const Icon = badge.icon;
          const isClosed = pass.status.startsWith('CLOSED');

          return (
            <div
              key={pass.id}
              className={`p-2.5 rounded border transition-all ${
                isClosed
                  ? 'bg-red-950/30 border-red-800/60'
                  : 'bg-steel-950/60 border-steel-800 hover:border-steel-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-khaki-100">
                      {pass.name}
                    </span>
                    <span className="font-mono text-[10px] text-steel-400 bg-steel-900 px-1 py-0.2 rounded border border-steel-800">
                      {pass.elevationFt.toLocaleString()} FT
                    </span>
                  </div>
                  <p className="text-[11px] text-steel-400 font-mono mt-0.5 line-clamp-1">
                    Axis: {pass.axis}
                  </p>
                </div>

                <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center space-x-1 ${badge.bg}`}>
                  <Icon className="w-3 h-3" />
                  <span>{badge.label}</span>
                </div>
              </div>

              {/* Pass Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-1.5 border-t border-steel-900 text-[11px] font-mono text-steel-400">
                <div>
                  <span className="text-steel-500 block text-[9px]">SNOW PACK</span>
                  <span className="text-khaki-200 font-semibold">{pass.snowDepthCm} cm</span>
                </div>
                <div>
                  <span className="text-steel-500 block text-[9px]">BRO DOZERS</span>
                  <span className="text-khaki-200 font-semibold">{pass.clearingDozerUnits} Actv</span>
                </div>
                <div>
                  <span className="text-steel-500 block text-[9px]">CLEARANCE ETA</span>
                  <span className={pass.clearanceEtaHours > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {pass.clearanceEtaHours > 0 ? `${pass.clearanceEtaHours} hrs` : 'Clear'}
                  </span>
                </div>
              </div>

              {/* Tactical Toggle Control for SIH Interactive Presentation */}
              <div className="mt-2 pt-1.5 border-t border-steel-900/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-steel-500">TEST CHOKE POINT CONTINGENCY:</span>
                <div className="flex items-center space-x-1">
                  {isClosed ? (
                    <button
                      onClick={() => onTogglePassStatus(pass.id, 'OPEN')}
                      className="px-2 py-0.5 bg-emerald-950 border border-emerald-700 text-emerald-200 hover:bg-emerald-900 rounded font-semibold transition-colors"
                    >
                      CLEAR PASS (BRO RESTORE)
                    </button>
                  ) : (
                    <button
                      onClick={() => onTogglePassStatus(pass.id, 'CLOSED_AVALANCHE')}
                      className="px-2 py-0.5 bg-red-950/80 border border-red-700 text-red-200 hover:bg-red-900 rounded font-semibold transition-colors"
                    >
                      SIMULATE AVALANCHE CLOSURE
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

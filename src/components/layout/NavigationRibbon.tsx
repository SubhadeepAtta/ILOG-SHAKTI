import React from 'react';
import { Map, TrendingDown, Layers, Truck, FileText } from 'lucide-react';

export type ActiveModule = 'MAP' | 'FORECASTING' | 'INVENTORY' | 'CONVOY' | 'REQUISITION';

interface NavigationRibbonProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  pendingOfflineCount: number;
}

export const NavigationRibbon: React.FC<NavigationRibbonProps> = ({
  activeModule,
  onSelectModule,
  pendingOfflineCount
}) => {
  const tabs = [
    {
      id: 'MAP' as ActiveModule,
      number: '01',
      label: 'TACTICAL GIS TERRAIN & AXES',
      desc: 'Pass status, convoy routes & avalanche blockage simulation',
      icon: Map
    },
    {
      id: 'FORECASTING' as ActiveModule,
      number: '02',
      label: 'PREDICTIVE DEMAND & BURNDOWN',
      desc: 'AI/ML burn curves, climate multipliers & what-if analysis',
      icon: TrendingDown
    },
    {
      id: 'INVENTORY' as ActiveModule,
      number: '03',
      label: 'FORWARD POST STOCKS & IOT',
      desc: 'Class I-V registers, cold-chain telemetry & DOS alerts',
      icon: Layers
    },
    {
      id: 'CONVOY' as ActiveModule,
      number: '04',
      label: 'FLEET & LOAD OPTIMIZER',
      desc: '4x4 / 6x6 / airlift payload envelopes & axle limits',
      icon: Truck
    },
    {
      id: 'REQUISITION' as ActiveModule,
      number: '05',
      label: 'INDENT & CONSIGNMENT (IAF-Z)',
      desc: 'Military indent dispatch & border mesh offline queue',
      icon: FileText,
      badge: pendingOfflineCount > 0 ? `${pendingOfflineCount} QUEUED` : undefined
    }
  ];

  return (
    <nav className="bg-steel-900 border-b border-steel-800 px-4 py-1.5 flex flex-wrap items-center justify-start gap-1 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeModule === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectModule(tab.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-all text-left relative ${
              isActive
                ? 'bg-drab-800 border border-drab-600 text-khaki-100 shadow-sm'
                : 'text-steel-400 hover:text-khaki-300 hover:bg-steel-800/80 border border-transparent'
            }`}
          >
            <span
              className={`font-mono text-[10px] px-1 py-0.2 rounded border font-semibold ${
                isActive
                  ? 'bg-drab-700 border-drab-500 text-khaki-200'
                  : 'bg-steel-800 border-steel-700 text-steel-400'
              }`}
            >
              {tab.number}
            </span>
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-khaki-300' : 'text-steel-400'}`} />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold tracking-wide flex items-center gap-1.5">
                {tab.label}
                {tab.badge && (
                  <span className="bg-amber-900 border border-amber-600 text-amber-200 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </span>
            </div>
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-drab-400 rounded-t" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

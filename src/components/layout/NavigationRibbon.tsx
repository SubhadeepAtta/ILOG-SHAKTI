import React from 'react';
import { Compass, Map, TrendingDown, Layers, Truck, FileText } from 'lucide-react';

export type ActiveModule = 'COMMAND' | 'MAP' | 'FORECASTING' | 'INVENTORY' | 'CONVOY' | 'REQUISITION';

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
      id: 'COMMAND' as ActiveModule,
      number: '01',
      label: 'FORWARD LOGISTICS COMMAND',
      icon: Compass
    },
    {
      id: 'MAP' as ActiveModule,
      number: '02',
      label: 'ROUTE & PASS MONITOR',
      icon: Map
    },
    {
      id: 'FORECASTING' as ActiveModule,
      number: '03',
      label: 'HIGH-ALTITUDE BURNDOWN',
      icon: TrendingDown
    },
    {
      id: 'INVENTORY' as ActiveModule,
      number: '04',
      label: 'DEPOT & FORWARD STOCK',
      icon: Layers
    },
    {
      id: 'CONVOY' as ActiveModule,
      number: '05',
      label: 'FLEET & AXLE LOAD',
      icon: Truck
    },
    {
      id: 'REQUISITION' as ActiveModule,
      number: '06',
      label: 'MOVEMENT ORDER (IAF-Z)',
      icon: FileText,
      badge: pendingOfflineCount > 0 ? `${pendingOfflineCount} QUEUED` : undefined
    }
  ];

  return (
    <nav className="bg-[#101418] border-b border-[#222b33] px-3 py-1 flex flex-wrap items-center justify-start gap-1 select-none font-mono">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeModule === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectModule(tab.id)}
            className={`flex items-center space-x-2 px-2.5 py-1 text-left transition-colors ${
              isActive
                ? 'bg-[#1e2630] border border-[#3b4c5e] text-zinc-100'
                : 'text-neutral-400 hover:text-zinc-200 hover:bg-[#14191e] border border-transparent'
            }`}
          >
            <span
              className={`text-[10px] px-1 py-0.2 border ${
                isActive
                  ? 'bg-[#293542] border-[#44586e] text-zinc-200'
                  : 'bg-[#151a20] border-[#222a33] text-neutral-500'
              }`}
            >
              {tab.number}
            </span>
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-200' : 'text-neutral-500'}`} />
            <span className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
              {tab.label}
              {tab.badge && (
                <span className="bg-amber-950 border border-amber-700 text-amber-300 text-[9px] px-1 py-0.2 font-bold">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

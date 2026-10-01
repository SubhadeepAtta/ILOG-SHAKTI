import React, { useState } from 'react';
import { TacticalHeader } from './components/layout/TacticalHeader';
import { NavigationRibbon, ActiveModule } from './components/layout/NavigationRibbon';
import { ForwardLogisticsCommand } from './components/workflow/ForwardLogisticsCommand';
import { TacticalGISMap } from './components/map/TacticalGISMap';
import { PredictiveEngine } from './components/forecasting/PredictiveEngine';
import { DepotInventoryGrid } from './components/inventory/DepotInventoryGrid';
import { LoadOptimizer } from './components/convoy/LoadOptimizer';
import { IndentForm } from './components/requisition/IndentForm';

import { FORWARD_POSTS } from './data/sectors';
import { MOUNTAIN_PASSES, INITIAL_CONVOYS } from './data/convoyRoutes';
import { ForwardPost, MountainPass, ConvoyMovement, RequisitionIndent, SimulationParameters, PassCondition } from './types/logistics';
import { Radio } from 'lucide-react';

export const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('COMMAND');
  const [selectedPostId, setSelectedPostId] = useState<string>('post-siachen-114');
  const [posts] = useState<ForwardPost[]>(FORWARD_POSTS);
  const [passes, setPasses] = useState<MountainPass[]>(MOUNTAIN_PASSES);
  const [convoys, setConvoys] = useState<ConvoyMovement[]>(INITIAL_CONVOYS);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [queuedIndents, setQueuedIndents] = useState<RequisitionIndent[]>([
    {
      voucherNumber: 'IAF-Z-2096/14C/9012',
      date: '01-OCT-2026',
      originUnit: '102 Indep Inf Bde (FDL-SN-114)',
      formation: '102 Indep Inf Bde / 3 Inf Div',
      destinationPostId: 'post-siachen-114',
      destinationPostName: 'Post 114 (Siachen Ridge Sector)',
      supplyClass: 'CLASS_III',
      priority: 'OP_IMMEDIATE',
      items: [
        {
          itemId: 'sku-cl3-01',
          name: 'Winter Grade High-Speed Diesel (HSD Arctic)',
          quantity: 24,
          unit: 'Barrels (200 Litres)',
          justification: 'Severe blizzards expected on glacier. Emergency pre-heaters active.'
        }
      ],
      authorizingOfficer: {
        rank: 'Major',
        name: 'V. S. Cheema',
        appointment: 'Quartermaster',
        serviceNumber: 'IC-69812K'
      },
      operationalNotes: 'Consigned to Convoy CNV/14C/ASC/409',
      syncState: 'APPROVED_CONVOY_MANIFESTED',
      timestampZulu: '0340Z'
    }
  ]);

  const [simulationParams, setSimulationParams] = useState<SimulationParameters>({
    ambientTempOffsetC: -31,
    snowfallSeverityCm: 45,
    troopSurgePercent: 15,
    roadClosureDelayHours: 12,
    operationalPosture: 'WINTER_STOCKING'
  });

  const [sitrepBanner, setSitrepBanner] = useState<string | null>(
    'OPERATIONAL SITREP: Western Disturbance alert issued across Ladakh Sector. Sasser La transit closed. Chang La and Khardung La passes under active BRO surveillance.'
  );

  // Update simulation parameters
  const handleUpdateParams = (newParams: Partial<SimulationParameters>) => {
    setSimulationParams((prev) => ({ ...prev, ...newParams }));
  };

  // Toggle Mountain Pass status and trigger tactical rerouting
  const handleTogglePassStatus = (passId: string, newStatus: PassCondition) => {
    setPasses((prevPasses) =>
      prevPasses.map((p) => {
        if (p.id === passId) {
          const isClosing = newStatus.startsWith('CLOSED');
          return {
            ...p,
            status: newStatus,
            snowDepthCm: isClosing ? p.snowDepthCm + 60 : 15,
            clearanceEtaHours: isClosing ? 14 : 0
          };
        }
        return p;
      })
    );

    // If Chang La closes, hold or divert Convoy 412
    if (passId === 'pass-chang-la') {
      const isClosing = newStatus.startsWith('CLOSED');
      setConvoys((prevConvoys) =>
        prevConvoys.map((c) => {
          if (c.id === 'cnv-14c-412') {
            return {
              ...c,
              status: isClosing ? 'HOLD_AT_TCP' : 'EN_ROUTE',
              alertStatus: isClosing ? 'WEATHER_HOLD' : 'NORMAL',
              currentLocationName: isClosing
                ? 'Shakti Staging Post (Pre-Chang La TCP - HELD)'
                : 'Chang La Pass Crest (Crossing)'
            };
          }
          return c;
        })
      );

      setSitrepBanner(
        isClosing
          ? 'FLASH SITREP: Avalanche blockage triggered at Chang La Pass (17,688 ft). Convoy CNV/14C/AOC/412 halted at Shakti TCP. AOC Air-Bridge alert transmitted.'
          : 'SITREP UPDATE: Border Roads Organisation (Project HIMANK) cleared Chang La Pass. Convoy CNV/14C/AOC/412 cleared to proceed.'
      );
    } else if (passId === 'pass-khardung-la') {
      const isClosing = newStatus.startsWith('CLOSED');
      setSitrepBanner(
        isClosing
          ? 'FLASH SITREP: Blizzard whiteout at Khardung La Pass (17,982 ft). Dozer units engaged. All heavy convoys restricted to South Pullu staging.'
          : 'SITREP UPDATE: Khardung La Pass cleared by BRO. Tire chains mandatory for Stallion 6x6.'
      );
    }
  };

  // Handle adding an indent
  const handleAddIndent = (newIndent: RequisitionIndent) => {
    setQueuedIndents((prev) => [newIndent, ...prev]);

    // Update target post critical alert count or stock if online
    if (!isOfflineMode) {
      setSitrepBanner(
        `INDENT TRANSMITTED: Voucher ${newIndent.voucherNumber} logged at HQ 14 Corps Logistics. Requisition entered ASC Priority Replenishment Queue.`
      );
    }
  };

  // Reconcile and push offline indents to HQ
  const handleSyncQueuedIndents = () => {
    setQueuedIndents((prev) =>
      prev.map((i) => ({
        ...i,
        syncState: 'TRANSMITTED_HQ'
      }))
    );
    setSitrepBanner(
      'NETWORK SYNC COMPLETE: All cached tactical mesh indents reconciled and cryptographically validated with HQ 14 Corps Server.'
    );
  };

  // Aggregated status counts
  const criticalAlertCount = posts.filter((p) => p.currentDaysOfSupply <= 7).length;
  const blockedPassCount = passes.filter((p) => p.status.startsWith('CLOSED')).length;
  const activeConvoyCount = convoys.length;

  return (
    <div className="min-h-screen bg-steel-950 text-khaki-100 flex flex-col font-sans">
      {/* 1. Tactical Command Header */}
      <TacticalHeader
        simulationParams={simulationParams}
        onUpdateParams={handleUpdateParams}
        isOfflineMode={isOfflineMode}
        onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
        criticalAlertCount={criticalAlertCount}
        blockedPassCount={blockedPassCount}
        activeConvoyCount={activeConvoyCount}
      />

      {/* 2. Navigation Ribbon */}
      <NavigationRibbon
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        pendingOfflineCount={queuedIndents.filter((i) => i.syncState === 'LOCAL_SYNC_PENDING').length}
      />

      {/* Sitrep Flash Bar */}
      {sitrepBanner && (
        <div className="bg-steel-900 border-b border-steel-800 px-4 py-1.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-khaki-200">
            <Radio className="w-3.5 h-3.5 text-drab-400 flex-shrink-0 animate-pulse" />
            <span className="font-semibold text-drab-300">HQ 14 CORPS TACTICAL SITREP:</span>
            <span className="text-steel-300 line-clamp-1">{sitrepBanner}</span>
          </div>
          <button
            onClick={() => setSitrepBanner(null)}
            className="text-steel-500 hover:text-khaki-200 text-[10px] uppercase font-bold pl-2"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* 3. Main Interactive Workspace */}
      <main className="flex-1 p-3 max-w-[1600px] w-full mx-auto overflow-y-auto">
        {activeModule === 'COMMAND' && (
          <ForwardLogisticsCommand
            posts={posts}
            passes={passes}
            convoys={convoys}
            onNavigateModule={setActiveModule}
            onSelectPost={(id) => {
              setSelectedPostId(id);
              setActiveModule('FORECASTING');
            }}
          />
        )}

        {activeModule === 'MAP' && (
          <TacticalGISMap
            posts={posts}
            passes={passes}
            convoys={convoys}
            selectedPostId={selectedPostId}
            onSelectPost={setSelectedPostId}
            onTogglePassStatus={handleTogglePassStatus}
          />
        )}

        {activeModule === 'FORECASTING' && (
          <PredictiveEngine
            posts={posts}
            selectedPostId={selectedPostId}
            onSelectPost={setSelectedPostId}
            simulationParams={simulationParams}
            onUpdateParams={handleUpdateParams}
          />
        )}

        {activeModule === 'INVENTORY' && (
          <DepotInventoryGrid
            posts={posts}
            selectedPostId={selectedPostId}
            onSelectPost={setSelectedPostId}
          />
        )}

        {activeModule === 'CONVOY' && (
          <LoadOptimizer
            posts={posts}
          />
        )}

        {activeModule === 'REQUISITION' && (
          <IndentForm
            posts={posts}
            isOfflineMode={isOfflineMode}
            queuedIndents={queuedIndents}
            onAddIndent={handleAddIndent}
            onSyncQueuedIndents={handleSyncQueuedIndents}
          />
        )}
      </main>

      {/* 4. Military Footer & Hackathon Attribution */}
      <footer className="tactical-header-bg border-t border-steel-800 px-4 py-2 text-[11px] font-mono text-steel-400 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center space-x-3">
          <span className="text-khaki-300 font-bold">ILOG-SHAKTI // DSSC-26251</span>
          <span className="text-steel-600">|</span>
          <span>INDIAN ARMY PREDICTIVE FORWARD LOGISTICS & SUPPLY CHAIN SYSTEM</span>
          <span className="text-steel-600">|</span>
          <span>SMART INDIA HACKATHON 2026</span>
        </div>

        <div className="flex items-center space-x-3 text-steel-500">
          <span>MINISTRY OF DEFENCE (MoD)</span>
          <span>//</span>
          <span>DEFENCE SERVICES STAFF COLLEGE (DSSC)</span>
          <span>//</span>
          <span className="text-khaki-400 font-bold">SECURE OPERATIONAL DEPLOYMENT</span>
        </div>
      </footer>
    </div>
  );
};

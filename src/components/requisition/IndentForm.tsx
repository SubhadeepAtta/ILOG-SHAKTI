import React, { useState } from 'react';
import { ForwardPost, RequisitionIndent, PriorityLevel, SupplyClass } from '../../types/logistics';
import { INVENTORY_CATALOG } from '../../data/inventoryItems';
import { 
  FileText, 
  Send, 
  WifiOff, 
  Wifi, 
  Printer, 
  CheckCircle2, 
  QrCode
} from 'lucide-react';
import { formatMilitaryDate, formatZuluTime } from '../../utils/formatters';

interface IndentFormProps {
  posts: ForwardPost[];
  isOfflineMode: boolean;
  queuedIndents: RequisitionIndent[];
  onAddIndent: (indent: RequisitionIndent) => void;
  onSyncQueuedIndents: () => void;
}

export const IndentForm: React.FC<IndentFormProps> = ({
  posts,
  isOfflineMode,
  queuedIndents,
  onAddIndent,
  onSyncQueuedIndents
}) => {
  const [targetPostId, setTargetPostId] = useState<string>('post-siachen-114');
  const [supplyClass, setSupplyClass] = useState<SupplyClass>('CLASS_III');
  const [priority, setPriority] = useState<PriorityLevel>('OP_IMMEDIATE');
  const [selectedItemId, setSelectedItemId] = useState<string>('sku-cl3-01');
  const [requestedQty, setRequestedQty] = useState<number>(20);
  const [operationalJustification, setOperationalJustification] = useState<string>(
    'Critical fuel buffer replenishment required. Ambient temperature dropped to -31°C; bukhari heaters and generator running 24/7.'
  );
  const [officerRankName, setOfficerRankName] = useState<string>('Major Vikramjit Singh');
  const [officerServiceNo, setOfficerServiceNo] = useState<string>('IC-78219M');
  const [officerAppointment, setOfficerAppointment] = useState<string>('Quartermaster / 102 Indep Inf Bde');
  const [submittedVoucher, setSubmittedVoucher] = useState<RequisitionIndent | null>(null);

  const targetPost = posts.find((p) => p.id === targetPostId) || posts[0];
  const selectedItem = INVENTORY_CATALOG.find((i) => i.id === selectedItemId) || INVENTORY_CATALOG[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const voucherNumber = `IAF-Z-2096/14C/${Math.floor(1000 + Math.random() * 9000)}`;
    const newIndent: RequisitionIndent = {
      voucherNumber,
      date: formatMilitaryDate(),
      originUnit: `${targetPost.formation} (${targetPost.code})`,
      formation: targetPost.formation,
      destinationPostId: targetPost.id,
      destinationPostName: targetPost.name,
      supplyClass,
      priority,
      items: [
        {
          itemId: selectedItem.id,
          name: selectedItem.name,
          quantity: requestedQty,
          unit: selectedItem.unit,
          justification: operationalJustification
        }
      ],
      authorizingOfficer: {
        rank: officerRankName.split(' ')[0] || 'Major',
        name: officerRankName.replace(/^(Major|Capt|Lt Col|Col)\s+/, ''),
        appointment: officerAppointment,
        serviceNumber: officerServiceNo
      },
      operationalNotes: operationalJustification,
      syncState: isOfflineMode ? 'LOCAL_SYNC_PENDING' : 'TRANSMITTED_HQ',
      timestampZulu: formatZuluTime()
    };

    onAddIndent(newIndent);
    setSubmittedVoucher(newIndent);
  };

  return (
    <div className="space-y-3 select-none font-mono text-xs">
      {/* Offline Status & Sync Alert Bar */}
      {isOfflineMode ? (
        <div className="bg-amber-950/50 border border-amber-700/80 rounded p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-amber-200">
            <WifiOff className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <span className="font-bold">TACTICAL MESH DISCONNECTED MODE ACTIVE:</span>
              <p className="text-[11px] text-amber-300/80">
                Border Forward Post link severed. Vouchers are signed and cryptographically stored in local secure flash memory.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-amber-900/80 text-amber-200 px-2 py-1 rounded border border-amber-700">
              {queuedIndents.filter((i) => i.syncState === 'LOCAL_SYNC_PENDING').length} VOUCHERS IN QUEUE
            </span>
          </div>
        </div>
      ) : queuedIndents.some((i) => i.syncState === 'LOCAL_SYNC_PENDING') ? (
        <div className="bg-emerald-950/60 border border-emerald-700 rounded p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-emerald-200">
            <Wifi className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold">VSAT HQ CARRIER RESTORED:</span>
              <p className="text-[11px] text-emerald-300/80">
                You have {queuedIndents.filter((i) => i.syncState === 'LOCAL_SYNC_PENDING').length} cached tactical indents awaiting transmission to HQ 14 Corps Logistics.
              </p>
            </div>
          </div>
          <button
            onClick={onSyncQueuedIndents}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-khaki-100 rounded border border-emerald-600 font-bold transition-colors"
          >
            TRANSMIT & RECONCILE TO HQ
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left 2 Columns: Requisition Form */}
        <div className="lg:col-span-2 bg-steel-900 border border-steel-800 rounded p-3.5">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-steel-800">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-drab-900 border border-drab-700 text-khaki-300">
                <FileText className="w-4 h-4 text-drab-400" />
              </div>
              <div>
                <h2 className="font-bold uppercase tracking-wider text-khaki-100">
                  DEFENCE INDENT & REQUISITION DISPATCH (IAF-Z-2096 SPEC)
                </h2>
                <span className="text-[10px] text-steel-400">
                  Official forward formation supply requisition to 14 Corps ASC/AOC Base Depot
                </span>
              </div>
            </div>

            <span className="text-[10px] text-steel-400 bg-steel-950 px-2 py-0.5 rounded border border-steel-800">
              SERIAL: 2026/IND-MOD
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row 1: Target Formation & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  INDENTING FORWARD FORMATION / POST:
                </label>
                <select
                  value={targetPostId}
                  onChange={(e) => setTargetPostId(e.target.value)}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500"
                >
                  {posts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.formation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  TACTICAL PRIORITY LEVEL:
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500"
                >
                  <option value="OP_IMMEDIATE">OP IMMEDIATE (AIR-DROP / URGENT CONVOY)</option>
                  <option value="PRIORITY">PRIORITY (WITHIN 48 HOURS)</option>
                  <option value="ROUTINE">ROUTINE (NEXT REGULAR TURN-AROUND)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Supply Classification & Item Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  SUPPLY CLASS:
                </label>
                <select
                  value={supplyClass}
                  onChange={(e) => {
                    const sc = e.target.value as SupplyClass;
                    setSupplyClass(sc);
                    const match = INVENTORY_CATALOG.find((i) => i.category === sc);
                    if (match) setSelectedItemId(match.id);
                  }}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500"
                >
                  <option value="CLASS_I">Class I: Rations & Pack MRE</option>
                  <option value="CLASS_II">Class II: Cold Gear & Medical</option>
                  <option value="CLASS_III">Class III: Arctic POL & Kerosene</option>
                  <option value="CLASS_IV">Class IV: Defence Works / Shelters</option>
                  <option value="CLASS_V">Class V: Ammunition & Ordnance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  ITEM NOMENCLATURE:
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500"
                >
                  {INVENTORY_CATALOG.filter((i) => i.category === supplyClass).map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  REQUESTED QUANTITY ({selectedItem.unit}):
                </label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={requestedQty}
                  onChange={(e) => setRequestedQty(Number(e.target.value))}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500 font-bold"
                />
              </div>
            </div>

            {/* Row 3: Operational Justification */}
            <div>
              <label className="text-[11px] text-steel-400 block mb-1">
                OPERATIONAL CIRCUMSTANCES & TACTICAL JUSTIFICATION:
              </label>
              <textarea
                rows={2}
                value={operationalJustification}
                onChange={(e) => setOperationalJustification(e.target.value)}
                className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500 resize-none"
              />
            </div>

            {/* Row 4: Authorizing Quartermaster Officer Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-steel-800">
              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  OFFICER RANK & NAME:
                </label>
                <input
                  type="text"
                  value={officerRankName}
                  onChange={(e) => setOfficerRankName(e.target.value)}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  SERVICE NO:
                </label>
                <input
                  type="text"
                  value={officerServiceNo}
                  onChange={(e) => setOfficerServiceNo(e.target.value)}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-steel-400 block mb-1">
                  APPOINTMENT:
                </label>
                <input
                  type="text"
                  value={officerAppointment}
                  onChange={(e) => setOfficerAppointment(e.target.value)}
                  className="w-full bg-steel-950 border border-steel-700 rounded p-2 text-khaki-100 text-xs focus:outline-none focus:border-drab-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-drab-700 hover:bg-drab-600 text-khaki-50 font-bold rounded border border-drab-500 flex items-center space-x-2 transition-all shadow-md"
              >
                <Send className="w-4 h-4 text-khaki-200" />
                <span>
                  {isOfflineMode
                    ? 'SIGN & QUEUE INDENT LOCALLY (TACTICAL MESH)'
                    : 'AUTHENTICATE & TRANSMIT TO 14 CORPS HQ'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Column: Generated IAF-Z Tactical Consignment Slip */}
        <div className="lg:col-span-1 bg-steel-900 border border-steel-800 rounded p-3.5 flex flex-col space-y-3">
          <div className="pb-2 border-b border-steel-800 flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-wider text-khaki-100 text-xs flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>TACTICAL DISPATCH VOUCHER</span>
            </h3>
            <span className="text-[10px] text-steel-400 font-bold">IAF-Z-2096</span>
          </div>

          {submittedVoucher ? (
            <div className="bg-steel-950 border border-steel-800 rounded p-3 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-steel-900">
                  <span className="text-khaki-100 font-bold">{submittedVoucher.voucherNumber}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                    submittedVoucher.syncState === 'LOCAL_SYNC_PENDING'
                      ? 'bg-amber-950 border-amber-700 text-amber-300'
                      : 'bg-emerald-950 border-emerald-700 text-emerald-300'
                  }`}>
                    {submittedVoucher.syncState.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-steel-400">
                  <div className="flex justify-between">
                    <span>Date / Zulu:</span>
                    <span className="text-khaki-200">{submittedVoucher.date} // {submittedVoucher.timestampZulu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span className="text-khaki-200 font-semibold">{submittedVoucher.destinationPostName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span className="text-red-400 font-bold">{submittedVoucher.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Store:</span>
                    <span className="text-khaki-100">{submittedVoucher.items[0]?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consigned Qty:</span>
                    <span className="text-khaki-100 font-bold">{submittedVoucher.items[0]?.quantity} {submittedVoucher.items[0]?.unit}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-steel-900">
                    <span>Officer:</span>
                    <span className="text-steel-300">{submittedVoucher.authorizingOfficer.rank} {submittedVoucher.authorizingOfficer.name}</span>
                  </div>
                </div>

                {/* Simulated QR Code for Consignment Authenticity */}
                <div className="mt-3 p-2 bg-steel-900 rounded border border-steel-800 flex items-center space-x-2.5">
                  <QrCode className="w-8 h-8 text-khaki-300 flex-shrink-0" />
                  <div className="text-[10px] text-steel-400 truncate">
                    <span className="block font-bold text-khaki-200">MIL-STD QR DIGI-SEAL</span>
                    <span className="truncate block">SHA-256: e82f...a109</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-steel-900 flex space-x-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-1.5 bg-steel-800 hover:bg-steel-700 text-khaki-200 rounded border border-steel-700 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT VOUCHER</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-steel-950 border border-steel-800 rounded p-4 text-center text-steel-500 text-xs flex-1 flex flex-col items-center justify-center">
              <FileText className="w-8 h-8 text-steel-700 mb-2" />
              <span>Submit a requisition indent on the left to generate the official Army Consignment Slip.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

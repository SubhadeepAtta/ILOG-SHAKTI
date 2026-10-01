import React, { useState } from 'react';
import { ForwardPost, MountainPass, ConvoyMovement } from '../../types/logistics';
import { PassStatusPanel } from './PassStatusPanel';
import { ConvoyTrackerModal } from './ConvoyTrackerModal';
import { 
  MapPin, 
  Compass, 
  Eye
} from 'lucide-react';
import { getDosStatusBadge } from '../../utils/formatters';

interface TacticalGISMapProps {
  posts: ForwardPost[];
  passes: MountainPass[];
  convoys: ConvoyMovement[];
  selectedPostId: string;
  onSelectPost: (postId: string) => void;
  onTogglePassStatus: (passId: string, status: any) => void;
}

export const TacticalGISMap: React.FC<TacticalGISMapProps> = ({
  posts,
  passes,
  convoys,
  selectedPostId,
  onSelectPost,
  onTogglePassStatus
}) => {
  const [activeConvoyForModal, setActiveConvoyForModal] = useState<ConvoyMovement | null>(null);
  const [mapLayer, setMapLayer] = useState<'ALL' | 'ROUTES_ONLY' | 'WEATHER_OVERLAY'>('ALL');

  // Find selected post
  const activePost = posts.find((p) => p.id === selectedPostId) || posts[0];

  // Mountain passes status
  const khardungLa = passes.find((p) => p.id === 'pass-khardung-la');
  const changLa = passes.find((p) => p.id === 'pass-chang-la');
  const zojila = passes.find((p) => p.id === 'pass-zojila');

  const isKhardungLaClosed = khardungLa?.status.startsWith('CLOSED');
  const isChangLaClosed = changLa?.status.startsWith('CLOSED');
  const isZojilaClosed = zojila?.status.startsWith('CLOSED');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-full select-none">
      {/* Left 3 Columns: Vector GIS Operational Map */}
      <div className="lg:col-span-3 bg-steel-900 border border-steel-800 rounded flex flex-col overflow-hidden relative">
        {/* Map Header Toolbar */}
        <div className="tactical-header-bg p-2.5 px-3 border-b border-steel-800 flex flex-wrap items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-drab-400" />
            <span className="font-bold text-khaki-100">
              TACTICAL THEATER GIS // XIV CORPS SECTOR (LADAKH & SIACHEN AXIS)
            </span>
            <span className="text-[10px] text-steel-400 bg-steel-950 px-1.5 py-0.5 rounded border border-steel-800">
              SCALE: 1:250,000 CONTOUR MESH
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-steel-400 text-[11px] hidden sm:inline">LAYERS:</span>
            <button
              onClick={() => setMapLayer('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] border ${
                mapLayer === 'ALL'
                  ? 'bg-drab-800 border-drab-600 text-khaki-100'
                  : 'bg-steel-950 border-steel-800 text-steel-400 hover:text-khaki-200'
              }`}
            >
              COMBINED MESH
            </button>
            <button
              onClick={() => setMapLayer('ROUTES_ONLY')}
              className={`px-2 py-0.5 rounded text-[11px] border ${
                mapLayer === 'ROUTES_ONLY'
                  ? 'bg-drab-800 border-drab-600 text-khaki-100'
                  : 'bg-steel-950 border-steel-800 text-steel-400 hover:text-khaki-200'
              }`}
            >
              SUPPLY AXES ONLY
            </button>
            <button
              onClick={() => setMapLayer('WEATHER_OVERLAY')}
              className={`px-2 py-0.5 rounded text-[11px] border ${
                mapLayer === 'WEATHER_OVERLAY'
                  ? 'bg-drab-800 border-drab-600 text-khaki-100'
                  : 'bg-steel-950 border-steel-800 text-steel-400 hover:text-khaki-200'
              }`}
            >
              AVALANCHE & WEATHER
            </button>
          </div>
        </div>

        {/* Tactical Map Container */}
        <div className="relative flex-1 bg-steel-950 tactical-grid-bg min-h-[460px] overflow-hidden flex items-center justify-center">
          {/* Top-left Quick Coordinate readout */}
          <div className="absolute top-2 left-2 z-10 bg-steel-900/90 border border-steel-800 p-2 rounded text-[10px] font-mono space-y-0.5 pointer-events-none">
            <div className="text-steel-400">CENTER: 34.62° N, 77.58° E</div>
            <div className="text-khaki-300">GRID: 43S EU MGRS THEATER</div>
            <div className="text-steel-500">DATUM: WGS-84 / MIL-STD-2525D</div>
          </div>

          {/* Tactical Vector Map Canvas (SVG) */}
          <svg
            className="w-full h-full max-w-[950px] max-h-[580px]"
            viewBox="0 0 900 550"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Tactical filters and patterns */}
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#161f26" strokeWidth="0.8" />
              </pattern>
              
              <linearGradient id="glacierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2c3e50" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1a252f" stopOpacity="0.1" />
              </linearGradient>

              {/* Glowing convoy pulse */}
              <filter id="convoyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.8"/>
              </filter>
            </defs>

            {/* Background Map Grid */}
            <rect width="900" height="550" fill="url(#grid)" />

            {/* Topographic Mountain Contour Silhouette Lines (Stylized Military Ridge Lines) */}
            <g opacity="0.4" stroke="#2a3845" strokeWidth="1" strokeDasharray="3 3">
              {/* Karakoram Ridge lines */}
              <path d="M 120 80 Q 250 40 420 90 T 780 70" />
              <path d="M 150 140 Q 320 110 500 130 T 840 120" />
              {/* Ladakh Range */}
              <path d="M 80 290 Q 280 240 470 270 T 820 250" />
              {/* Zanskar Range */}
              <path d="M 60 440 Q 260 410 460 430 T 850 410" />
            </g>

            {/* Glacier & High-Altitude Cold Zone Shapes */}
            <polygon
              points="340,40 450,30 490,90 410,120 330,90"
              fill="url(#glacierGrad)"
              stroke="#3a4d5f"
              strokeWidth="1.2"
              opacity="0.7"
            />
            <text x="360" y="75" fill="#7a92a5" fontSize="10" fontFamily="monospace" letterSpacing="2">
              SIACHEN GLACIER (SALTORO RIDGE)
            </text>

            {/* STRATEGIC SUPPLY AXES */}
            
            {/* Axis 1: Leh -> Khardung La -> Partapur -> Siachen (Post 114) */}
            <path
              d="M 440 370 L 420 280 L 390 190 L 360 80"
              stroke={isKhardungLaClosed ? '#b91c1c' : '#3f5e46'}
              strokeWidth={isKhardungLaClosed ? '3' : '3.5'}
              strokeDasharray={isKhardungLaClosed ? '6 4' : 'none'}
            />

            {/* Axis 2: Leh -> Karu -> Chang La -> Durbuk -> Shyok -> DBO */}
            <path
              d="M 440 370 L 510 370 L 580 340 L 640 280 L 670 190 L 690 90"
              stroke={isChangLaClosed ? '#b91c1c' : '#8c6d3b'}
              strokeWidth={isChangLaClosed ? '3' : '3.5'}
              strokeDasharray={isChangLaClosed ? '6 4' : 'none'}
            />

            {/* Axis 3: Leh -> Fotu La -> Kargil -> Dras -> Zojila Pass */}
            <path
              d="M 440 370 L 360 370 L 300 370 L 240 380 L 190 390 L 110 410"
              stroke={isZojilaClosed ? '#b91c1c' : '#385368'}
              strokeWidth={isZojilaClosed ? '3' : '3.5'}
              strokeDasharray={isZojilaClosed ? '6 4' : 'none'}
            />

            {/* Axis 4: Leh -> Karu -> Upshi -> Chushul */}
            <path
              d="M 440 370 L 510 370 L 570 420 L 680 440"
              stroke="#435261"
              strokeWidth="2.5"
            />

            {/* Contingency Air-Bridge Vector (Lights up if Khardung La or Chang La is closed) */}
            {(isKhardungLaClosed || isChangLaClosed) && (
              <g>
                <path
                  d="M 440 370 Q 520 200 690 90"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <text x="510" y="210" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                  CONTINGENCY HELI-LIFT AIR-BRIDGE (MI-17 / CHINOOK)
                </text>
              </g>
            )}

            {/* MOUNTAIN PASSES MARKERS */}
            {/* Khardung La Pass */}
            <g
              className="cursor-pointer"
              onClick={() => onTogglePassStatus('pass-khardung-la', isKhardungLaClosed ? 'OPEN' : 'CLOSED_AVALANCHE')}
            >
              <circle
                cx="420"
                cy="280"
                r="7"
                fill={isKhardungLaClosed ? '#991b1b' : '#b45309'}
                stroke="#12171c"
                strokeWidth="2"
              />
              <text x="432" y="284" fill={isKhardungLaClosed ? '#f87171' : '#f59e0b'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                Khardung La {isKhardungLaClosed ? '[BLOCKED]' : '(17,982 FT)'}
              </text>
            </g>

            {/* Chang La Pass */}
            <g
              className="cursor-pointer"
              onClick={() => onTogglePassStatus('pass-chang-la', isChangLaClosed ? 'OPEN' : 'CLOSED_AVALANCHE')}
            >
              <circle
                cx="580"
                cy="340"
                r="7"
                fill={isChangLaClosed ? '#991b1b' : '#22c55e'}
                stroke="#12171c"
                strokeWidth="2"
              />
              <text x="592" y="344" fill={isChangLaClosed ? '#f87171' : '#86efac'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                Chang La {isChangLaClosed ? '[BLOCKED]' : '(17,688 FT)'}
              </text>
            </g>

            {/* Zojila Pass */}
            <g
              className="cursor-pointer"
              onClick={() => onTogglePassStatus('pass-zojila', isZojilaClosed ? 'OPEN' : 'CLOSED_BLIZZARD')}
            >
              <circle
                cx="190"
                cy="390"
                r="7"
                fill={isZojilaClosed ? '#991b1b' : '#eab308'}
                stroke="#12171c"
                strokeWidth="2"
              />
              <text x="120" y="380" fill={isZojilaClosed ? '#f87171' : '#fde047'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                Zojila Pass {isZojilaClosed ? '[CLOSED]' : '(11,575 FT)'}
              </text>
            </g>

            {/* FORWARD POSTS & HUBS */}
            
            {/* 14 Corps Base Depot Leh */}
            <g className="cursor-pointer" onClick={() => onSelectPost('post-leh-base')}>
              <rect
                x="426"
                y="356"
                width="28"
                height="28"
                rx="4"
                fill={selectedPostId === 'post-leh-base' ? '#2f3d33' : '#1a221c'}
                stroke="#566e5d"
                strokeWidth="2"
              />
              <text x="440" y="374" textAnchor="middle" fill="#d9cdb5" fontSize="12" fontWeight="bold">
                HQ
              </text>
              <text x="440" y="400" textAnchor="middle" fill="#ece5d8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                14 Corps FSD Leh
              </text>
            </g>

            {/* Post 114 (Siachen Ridge) */}
            <g className="cursor-pointer" onClick={() => onSelectPost('post-siachen-114')}>
              <circle
                cx="360"
                cy="80"
                r="10"
                fill={selectedPostId === 'post-siachen-114' ? '#7f1d1d' : '#991b1b'}
                stroke="#fca5a5"
                strokeWidth={selectedPostId === 'post-siachen-114' ? '3' : '1.5'}
              />
              <circle cx="360" cy="80" r="15" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" />
              <text x="360" y="62" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">
                POST 114 (SIACHEN)
              </text>
              <text x="360" y="105" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="monospace">
                DOS: 6.8 Days (CRITICAL)
              </text>
            </g>

            {/* Daulat Beg Oldi (DBO) */}
            <g className="cursor-pointer" onClick={() => onSelectPost('post-dbo-alg')}>
              <polygon
                points="690,75 702,95 678,95"
                fill={selectedPostId === 'post-dbo-alg' ? '#78350f' : '#b45309'}
                stroke="#fde68a"
                strokeWidth="1.5"
              />
              <text x="690" y="70" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold">
                DBO ALG & POST
              </text>
              <text x="690" y="112" textAnchor="middle" fill="#d4d4d8" fontSize="9" fontFamily="monospace">
                SSN Sector (5,065m)
              </text>
            </g>

            {/* Galwan Forward Node KM-120 */}
            <g className="cursor-pointer" onClick={() => onSelectPost('post-galwan-km120')}>
              <circle
                cx="670"
                cy="190"
                r="7"
                fill={selectedPostId === 'post-galwan-km120' ? '#164e63' : '#0891b2'}
                stroke="#cffafe"
                strokeWidth="1.5"
              />
              <text x="682" y="195" fill="#a5f3fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Galwan KM-120
              </text>
            </g>

            {/* Chushul Forward Garrison */}
            <g className="cursor-pointer" onClick={() => onSelectPost('post-chushul-gap')}>
              <circle
                cx="680"
                cy="440"
                r="7"
                fill={selectedPostId === 'post-chushul-gap' ? '#14532d' : '#16a34a'}
                stroke="#bbf7d0"
                strokeWidth="1.5"
              />
              <text x="692" y="445" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Chushul Garrison
              </text>
            </g>

            {/* Dras High-Ridge (Tololing) */}
            <g className="cursor-pointer" onClick={() => onSelectPost('post-dras-tololing')}>
              <circle
                cx="240"
                cy="380"
                r="7"
                fill={selectedPostId === 'post-dras-tololing' ? '#1e293b' : '#334155'}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <text x="240" y="405" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Dras Node (8 Mtn Div)
              </text>
            </g>

            {/* LIVE CONVOYS IN TRANSIT */}
            
            {/* Convoy 1: Heading to Siachen Post 114 */}
            <g
              className="cursor-pointer"
              onClick={() => setActiveConvoyForModal(convoys[0])}
              filter="url(#convoyGlow)"
            >
              {/* Convoy Position: North Pullu / Nubra Axis */}
              <circle cx="400" cy="220" r="9" fill="#0284c7" stroke="#e0f2fe" strokeWidth="2" />
              <text x="400" y="224" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                C1
              </text>
              <rect x="415" y="210" width="130" height="20" rx="3" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
              <text x="420" y="224" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                CNV/409 [ASC 6x6] 58%
              </text>
            </g>

            {/* Convoy 2: Heading to DBO (Held at TCP if Chang La is blocked or moving) */}
            <g
              className="cursor-pointer"
              onClick={() => setActiveConvoyForModal(convoys[1])}
            >
              <circle
                cx={isChangLaClosed ? 530 : 610}
                cy={isChangLaClosed ? 360 : 310}
                r="9"
                fill={isChangLaClosed ? '#b91c1c' : '#d97706'}
                stroke="#fef3c7"
                strokeWidth="2"
              />
              <text
                x={isChangLaClosed ? 530 : 610}
                y={isChangLaClosed ? 364 : 314}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
              >
                C2
              </text>
              <rect
                x={isChangLaClosed ? 440 : 625}
                y={isChangLaClosed ? 375 : 300}
                width="145"
                height="20"
                rx="3"
                fill="#0f172a"
                stroke={isChangLaClosed ? '#ef4444' : '#f59e0b'}
                strokeWidth="1"
              />
              <text
                x={isChangLaClosed ? 445 : 630}
                y={isChangLaClosed ? 389 : 314}
                fill={isChangLaClosed ? '#f87171' : '#fbbf24'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {isChangLaClosed ? 'CNV/412 [TCP HOLD]' : 'CNV/412 [STALLION]'}
              </text>
            </g>
          </svg>

          {/* Bottom Overlay Map Legend */}
          <div className="absolute bottom-2 left-2 right-2 bg-steel-900/90 border border-steel-800 p-2 rounded flex flex-wrap items-center justify-between text-[11px] font-mono text-steel-400 gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-khaki-300 font-bold">AXIS STATUS:</span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-1 bg-drab-500 rounded"></span>
                <span>Siachen Axis</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-1 bg-amber-600 rounded"></span>
                <span>DSDBO Axis</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-1 bg-sky-700 rounded"></span>
                <span>NH-1D Kargil</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-1 bg-red-600 rounded border border-red-400"></span>
                <span>Choke Blockage</span>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-steel-300">
              <Eye className="w-3.5 h-3.5 text-steel-400" />
              <span>CLICK ANY FORWARD POST OR CONVOY PIN TO INSPECT</span>
            </div>
          </div>
        </div>

        {/* Selected Post Quick Intelligence Strip */}
        <div className="p-3 bg-steel-950 border-t border-steel-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded bg-steel-900 border border-steel-800 text-khaki-300">
              <MapPin className="w-4 h-4 text-drab-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-khaki-100 font-bold text-sm">{activePost.name}</span>
                <span className="text-steel-400 text-[11px]">({activePost.code})</span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getDosStatusBadge(activePost.currentDaysOfSupply).bgClass} ${getDosStatusBadge(activePost.currentDaysOfSupply).textClass} ${getDosStatusBadge(activePost.currentDaysOfSupply).borderClass}`}>
                  {activePost.currentDaysOfSupply} DAYS OF SUPPLY
                </span>
              </div>
              <span className="text-steel-400 text-[11px]">
                {activePost.formation} // Elevation: {activePost.elevationMeters}m // Temp: {activePost.temperatureC}°C // Weather: {activePost.weatherCondition}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <span className="text-steel-500 text-[10px] block">GARRISON STRENGTH</span>
              <span className="text-khaki-200 font-bold">{activePost.garrisonStrength} Troops</span>
            </div>
            <div className="h-6 w-px bg-steel-800 mx-1"></div>
            <div className="text-right">
              <span className="text-steel-500 text-[10px] block">CONNECTIVITY</span>
              <span className="text-khaki-200 font-bold">{activePost.connectivityStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right 1 Column: Pass Status & BRO Clearance Simulation */}
      <div className="lg:col-span-1 flex flex-col space-y-3">
        <PassStatusPanel
          passes={passes}
          onTogglePassStatus={onTogglePassStatus}
        />
      </div>

      {/* Modal for In-Transit Convoy IoT Inspection */}
      <ConvoyTrackerModal
        convoy={activeConvoyForModal}
        onClose={() => setActiveConvoyForModal(null)}
      />
    </div>
  );
};

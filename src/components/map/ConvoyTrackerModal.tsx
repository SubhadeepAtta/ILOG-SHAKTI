import React from 'react';
import { ConvoyMovement } from '../../types/logistics';
import { Truck, X, Thermometer, Gauge, Fuel, Navigation, AlertCircle } from 'lucide-react';
import { formatWeightKg } from '../../utils/formatters';

interface ConvoyTrackerModalProps {
  convoy: ConvoyMovement | null;
  onClose: () => void;
}

export const ConvoyTrackerModal: React.FC<ConvoyTrackerModalProps> = ({ convoy, onClose }) => {
  if (!convoy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-steel-950/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-steel-900 border border-steel-700 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="tactical-header-bg p-3.5 flex items-center justify-between border-b border-steel-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-drab-900 border border-drab-700 text-khaki-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-khaki-100">
                  {convoy.convoyNumber}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 uppercase">
                  STATUS: {convoy.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-steel-400 font-mono mt-0.5">
                Axis: {convoy.primaryAxis}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-steel-400 hover:text-khaki-200 p-1 rounded hover:bg-steel-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Progress & Transit Milestone */}
          <div className="bg-steel-950/70 border border-steel-800 rounded p-3">
            <div className="flex items-center justify-between font-mono text-xs mb-1.5">
              <span className="text-steel-400">CURRENT POSITION / TCP:</span>
              <span className="text-khaki-200 font-semibold">{convoy.currentLocationName}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-steel-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-drab-500 h-full rounded-full transition-all"
                style={{ width: `${convoy.currentProgressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-steel-500 mt-1">
              <span>Origin: {convoy.originNode}</span>
              <span>{convoy.currentProgressPct}% Complete</span>
              <span>Destination: {convoy.destinationNode}</span>
            </div>
          </div>

          {/* Contingency Reroute Information */}
          {convoy.alertStatus === 'WEATHER_HOLD' && (
            <div className="bg-amber-950/40 border border-amber-800/80 rounded p-2.5 flex items-start space-x-2 text-xs font-mono text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>WEATHER HOLD AT STAGING TCP:</strong> Movement paused per Northern Command Mountain Pass advisory.
                {convoy.contingencyAxis && (
                  <span className="block text-steel-300 mt-0.5">
                    Authorized Contingency Axis: <strong>{convoy.contingencyAxis}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Vehicle Manifest & Real-time IoT Telemetry */}
          <div>
            <h4 className="font-mono text-xs font-bold text-khaki-200 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Gauge className="w-4 h-4 text-khaki-400" />
              <span>VEHICLE TELEMETRY & IOT SENSOR STREAM ({convoy.vehicles.length} VEHICLES)</span>
            </h4>

            <div className="space-y-3">
              {convoy.vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-steel-950 border border-steel-800 rounded p-3 font-mono text-xs"
                >
                  <div className="flex items-start justify-between pb-2 border-b border-steel-800">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-khaki-100 font-bold">{v.callSign}</span>
                        <span className="text-steel-400 text-[10px] bg-steel-900 px-1.5 py-0.5 rounded border border-steel-800">
                          {v.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-steel-400">Driver: {v.driverRankName}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-steel-400 text-[10px] block">PAYLOAD UTILIZATION</span>
                      <span className="text-khaki-200 font-bold">
                        {formatWeightKg(v.currentPayloadKg)} / {formatWeightKg(v.maxPayloadKg)} (
                        {Math.round((v.currentPayloadKg / v.maxPayloadKg) * 100)}%)
                      </span>
                    </div>
                  </div>

                  {/* IoT Telemetry Gauges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-1 text-[11px]">
                    <div className="bg-steel-900/60 p-1.5 rounded border border-steel-800/60">
                      <div className="flex items-center space-x-1 text-steel-400">
                        <Navigation className="w-3 h-3 text-sky-400" />
                        <span>SPEED</span>
                      </div>
                      <span className="text-khaki-200 font-semibold">{v.iotTelemetry.speedKmph} km/h</span>
                    </div>

                    <div className="bg-steel-900/60 p-1.5 rounded border border-steel-800/60">
                      <div className="flex items-center space-x-1 text-steel-400">
                        <Fuel className="w-3 h-3 text-amber-400" />
                        <span>FUEL (ARCTIC)</span>
                      </div>
                      <span className="text-khaki-200 font-semibold">{v.iotTelemetry.fuelLevelPct}%</span>
                    </div>

                    <div className="bg-steel-900/60 p-1.5 rounded border border-steel-800/60">
                      <div className="flex items-center space-x-1 text-steel-400">
                        <Gauge className="w-3 h-3 text-drab-400" />
                        <span>AXLE STRAIN</span>
                      </div>
                      <span className="text-khaki-200 font-semibold">{v.iotTelemetry.axleStrainPct}%</span>
                    </div>

                    <div className="bg-steel-900/60 p-1.5 rounded border border-steel-800/60">
                      <div className="flex items-center space-x-1 text-steel-400">
                        <Thermometer className="w-3 h-3 text-red-400" />
                        <span>CARGO / THERMAL</span>
                      </div>
                      <span className="text-khaki-200 font-semibold">
                        {v.iotTelemetry.cargoTempC !== undefined
                          ? `${v.iotTelemetry.cargoTempC}°C (Active)`
                          : `${v.iotTelemetry.coolantTempC}°C Engine`}
                      </span>
                    </div>
                  </div>

                  {/* Consigned Cargo Manifest */}
                  <div className="mt-2.5 pt-2 border-t border-steel-900">
                    <span className="text-steel-500 text-[10px] uppercase font-bold block mb-1">
                      CONSIGNED STORES MANIFEST:
                    </span>
                    <div className="space-y-1">
                      {v.cargo.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[11px] bg-steel-900/40 px-2 py-1 rounded"
                        >
                          <span className="text-khaki-300">{c.itemName}</span>
                          <span className="text-steel-400">
                            Qty: <strong className="text-khaki-200">{c.quantity}</strong> ({formatWeightKg(c.weightKg)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="tactical-header-bg p-3 border-t border-steel-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-steel-800 hover:bg-steel-700 text-khaki-200 text-xs font-mono rounded border border-steel-700 transition-colors"
          >
            DISMISS MANIFEST
          </button>
        </div>
      </div>
    </div>
  );
};

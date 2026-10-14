import React from "react";

const formatDate = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ItemJourneyTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 italic">
        No journey data available for this item.
      </div>
    );
  }

  // Sort reverse chronological (newest first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-lg text-slate-900">Item Journey</h3>
        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
          {events.length} Events
        </span>
      </div>
      
      <div className="p-0 overflow-y-auto grow min-h-0">
        <div className="py-2">
          {sortedEvents.map((evt, index) => {
            const isLatest = index === 0;
            const isLast = index === sortedEvents.length - 1;
            return (
              <div key={evt.id} className="px-4 md:px-16 lg:px-32 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4 md:gap-6">
                  
                  {/* Timeline Line & Dot */}
                  <div className="flex flex-col items-center pt-5 min-w-[12px]">
                    <span className={`shrink-0 w-2.5 h-2.5 rounded-full relative z-10 ${isLatest ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
                    {!isLast && (
                      <div className="w-[1.5px] grow bg-slate-200 mt-1.5 -mb-4"></div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="flex-1 py-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-4">
                      <h4 className={`text-sm font-bold ${isLatest ? 'text-slate-900' : 'text-slate-700'}`}>
                        {evt.event}
                        {isLatest && <span className="ml-2 text-[10px] uppercase font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">Current</span>}
                      </h4>
                      <span className="text-xs text-slate-500 whitespace-nowrap font-medium md:text-right">
                        {formatDate(evt.timestamp)}
                      </span>
                    </div>
                    
                    {/* Details */}
                    <div className="mt-1 text-sm text-slate-600 space-y-1">
                      {evt.type === 'movement' && (evt.party || evt.to) && (
                        <div>{evt.party ? evt.party.name : `To: ${evt.to}`}</div>
                      )}
                      {evt.return?.reason && (
                        <div>Return Reason: {evt.return.reason}</div>
                      )}
                      {evt.details?.repair_reason && (
                        <div>Repair Details: {evt.details.repair_reason}</div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

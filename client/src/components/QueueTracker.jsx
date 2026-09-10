import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Sprout, 
  Building2,
  AlertCircle,
  Truck,
  FlaskConical,
  Scale,
  BadgeIndianRupee
} from 'lucide-react';

export default function QueueTracker() {
  const { 
    t, 
    lang, 
    farmerUser, 
    activeBooking, 
    setFarmerView, 
    bookings,
    selectedCentreId,
    centres
  } = useApp();

  const booking = activeBooking;

  if (!booking) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          {t.noActiveBooking}
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          {lang === 'hi' ? 'कतार स्थिति देखने के लिए पहले एक खरीद स्लॉट बुक करें।' : 'Book a procurement slot first to track your token in the queue.'}
        </p>
        <button
          onClick={() => setFarmerView('book-slot')}
          className="px-6 py-3 rounded-2xl bg-green-600 text-white font-bold text-sm shadow-lg shadow-green-600/30"
        >
          {t.bookSlotBtn}
        </button>
      </div>
    );
  }

  // 5 Stages of Procurement
  const stages = [
    { key: 'Booked', label: t.statusBooked, icon: Clock, color: 'blue' },
    { key: 'Arrived', label: t.statusArrived, icon: Truck, color: 'indigo' },
    { key: 'Quality Check', label: t.statusQC, icon: FlaskConical, color: 'amber' },
    { key: 'Procured', label: t.statusProcured, icon: Scale, color: 'emerald' },
    { key: 'Payment Done', label: t.statusPaymentDone, icon: BadgeIndianRupee, color: 'green' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === booking.status);
  const farmersAhead = booking.farmersAhead ?? 0;

  // Estimated wait time calculation: ~15 mins per farmer ahead
  const estimatedWaitMinutes = Math.max(0, farmersAhead * 15);

  const getStageExplanation = () => {
    switch (booking.status) {
      case 'Booked': return t.stageNotice1;
      case 'Arrived': return t.stageNotice2;
      case 'Quality Check': return t.stageNotice3;
      case 'Procured': return t.stageNotice4;
      case 'Payment Done': return t.stageNotice5;
      default: return '';
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFarmerView('dashboard')}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {t.queueTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {booking.centreName}
            </p>
          </div>
        </div>

        {/* View Payment Button */}
        {['Procured', 'Payment Done'].includes(booking.status) && (
          <button
            id="queue-view-payment-btn"
            onClick={() => setFarmerView('payment')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t.viewPaymentStatus}</span>
          </button>
        )}
      </div>

      {/* Main Token & Queue Position Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/80">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Live Mandi Queue
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-2 font-display">
              Token #{booking.tokenNumber}
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>{booking.farmerName}</span>
              <span>•</span>
              <span className="text-emerald-300 font-semibold">{booking.crop}</span>
              <span>•</span>
              <span>{booking.slotTime}</span>
            </div>
          </div>

          {/* Live Farmers Ahead Pill */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 text-center sm:text-right shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center sm:justify-end gap-1">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>{t.farmersAheadText}</span>
            </div>
            <div 
              id="live-farmers-ahead-count"
              className="text-3xl sm:text-4xl font-black text-emerald-400 mt-0.5 font-display"
            >
              {booking.status === 'Payment Done' ? 0 : farmersAhead}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {farmersAhead === 0 ? (
                <span className="text-emerald-400 font-semibold">
                  {booking.status === 'Payment Done' ? 'Procurement Complete' : 'Your vehicle is at the gate!'}
                </span>
              ) : (
                `~${estimatedWaitMinutes} mins ${t.estimatedWait}`
              )}
            </div>
          </div>
        </div>

        {/* Current Stage Highlight Banner */}
        <div className="pt-4 flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping mt-1.5 shrink-0"></div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {lang === 'hi' ? 'वर्तमान स्थिति:' : 'Active Stage:'} {booking.status}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
              {getStageExplanation()}
            </p>
          </div>
        </div>

      </div>

      {/* Visual 5-Stage Stepper */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">
          {t.statusTimeline}
        </h3>

        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;
            const isPending = currentStageIndex < idx;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex items-center gap-4">
                
                {/* Step Circle & Line */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : isCurrent
                        ? 'bg-green-600 text-white ring-4 ring-green-100 shadow-md shadow-green-600/30 animate-pulse'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  {idx < stages.length - 1 && (
                    <div 
                      className={`w-0.5 h-6 mt-1 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isCurrent ? 'text-green-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      {stage.label}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {lang === 'hi' ? 'पूर्ण' : 'Passed'}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 animate-pulse">
                        {lang === 'hi' ? 'चालू' : 'In Progress'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {stage.key === 'Booked' && `Slot: ${booking.slotTime}`}
                    {stage.key === 'Arrived' && (booking.arrivedAt ? `Gate entry: ${booking.arrivedAt}` : 'Vehicle arrival at mandi')}
                    {stage.key === 'Quality Check' && (booking.qcPassedAt ? `Grading passed: ${booking.qcPassedAt}` : 'Moisture & purity check')}
                    {stage.key === 'Procured' && (booking.quantityQuintals ? `Weighed: ${booking.quantityQuintals} Qtls` : 'Electronic weighbridge measurement')}
                    {stage.key === 'Payment Done' && (booking.paymentStatus === 'Completed' ? `Transferred via DBT` : 'Direct bank credit')}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Helpful Mandi Notice */}
      <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {lang === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Mandatory Mandi Protocol:'}
          </span>{' '}
          {lang === 'hi' 
            ? 'कृपया गेट नंबर 1 पर यह डिजिटल टोकन दिखाएं। आपकी ट्रॉली को सीधे निर्धारित तौल कांटे पर निर्देशित किया जाएगा।' 
            : 'Present this digital token at Mandi Gate #1 upon arrival. Your vehicle will be guided directly to the allocated weighing bay.'}
        </div>
      </div>

    </div>
  );
}

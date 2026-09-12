import React from 'react';
import { useApp } from '../context/AppContext';
import WeatherWidget from './WeatherWidget';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  CreditCard, 
  Building2, 
  HelpCircle,
  PhoneCall,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function FarmerDashboard() {
  const { 
    t, 
    lang, 
    farmerUser, 
    activeBooking, 
    farmerBookings,
    selectedTokenNumber,
    setSelectedTokenNumber,
    setFarmerView, 
    centres, 
    selectedCentreId, 
    setSelectedCentreId 
  } = useApp();

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Top Greeting & Mandi Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {t.welcome}, {farmerUser?.name || 'Kisan Mitra'}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-display">
            {farmerUser?.village ? `${lang === 'hi' ? 'ग्राम' : 'Village'} ${farmerUser.village}` : (lang === 'hi' ? 'किसान डैशबोर्ड' : 'Farmer Dashboard')}
          </h1>
        </div>

        {/* Selected Centre Dropdown */}
        <div className="sm:text-right">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            {t.selectedCentre}
          </div>
          <select
            id="mandi-centre-selector"
            value={selectedCentreId}
            onChange={(e) => setSelectedCentreId(e.target.value)}
            className="mt-0.5 text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
          >
            {centres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WEATHER WIDGET (Mandatory Open-Meteo integration with ☀️ Safe vs 🌧️ Rain Warning) */}
      <WeatherWidget />

      {/* MULTI-TOKEN SELECTOR (If farmer has multiple tokens, e.g. 101 completed & 105 active) */}
      {farmerBookings && farmerBookings.length > 1 && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-green-600" />
              <span>{lang === 'hi' ? 'आपके टोकन एवं स्लॉट:' : 'Your Booked Tokens:'}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {farmerBookings.length} {lang === 'hi' ? 'टोकन उपलब्ध' : 'deliveries'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {farmerBookings.map((b) => {
              const isSelected = activeBooking?.tokenNumber === b.tokenNumber;
              const isDone = b.status === 'Payment Done';

              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedTokenNumber(b.tokenNumber)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-display">Token #{b.tokenNumber}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isSelected ? 'bg-emerald-700/60 text-emerald-100' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {b.crop}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-300' : 'bg-amber-400 animate-pulse'}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE TOKEN BANNER (If user has an active booking) */}
      {activeBooking ? (
        <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
              {t.activeBooking}
            </span>
            <span className="text-xs font-bold text-slate-300">
              {activeBooking.date}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4">
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-display">
                Token #{activeBooking.tokenNumber}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-bold text-emerald-950 bg-emerald-300 px-2.5 py-0.5 rounded-lg">
                  {activeBooking.crop} • {activeBooking.quantityQuintals} Quintals
                </span>
                <span className="text-xs text-emerald-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeBooking.slotTime}</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeBooking.centreName}</span>
              </div>
            </div>

            {/* Current Status Badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center sm:text-right">
              <div className="text-[10px] text-emerald-300 uppercase font-bold">
                {lang === 'hi' ? 'वर्तमान स्थिति' : 'Current Stage'}
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {activeBooking.status}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                {activeBooking.farmersAhead > 0 
                  ? `${activeBooking.farmersAhead} ${t.farmersAheadText}`
                  : 'Ready for processing'}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              id="dashboard-track-queue-btn"
              onClick={() => setFarmerView('queue')}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <Users className="w-4 h-4" />
              <span>{t.viewQueueStatus}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {['Procured', 'Payment Done'].includes(activeBooking.status) && (
              <button
                id="dashboard-view-payment-btn"
                onClick={() => setFarmerView('payment')}
                className="w-full py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/20"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t.viewPaymentStatus}</span>
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* BIG PROMINENT "BOOK MY SLOT" BUTTON (As specified: Big clear button) */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-sm">
          <Ticket className="w-7 h-7" />
        </div>
        
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
            {lang === 'hi' ? 'सरकारी खरीद स्लॉट बुकिंग' : 'MSP Procurement Slot Booking'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {lang === 'hi' 
              ? 'बिना लंबी कतारों के पूर्व-निर्धारित समय पर मंडी पहुंचें। सुरक्षित एवं त्वरित तौल।' 
              : 'Select your preferred date and receive an auto-assigned time window with guaranteed gate entry.'}
          </p>
        </div>

        <button
          id="dashboard-book-slot-btn"
          onClick={() => setFarmerView('book-slot')}
          className="w-full py-4 sm:py-5 rounded-2xl bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-black text-base sm:text-lg shadow-xl shadow-green-600/30 transition-all flex items-center justify-center gap-3"
        >
          <Calendar className="w-6 h-6" />
          <span>{t.bookSlotBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Trust & Support Information Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-green-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-800 block">Govt. MSP Assurance</span>
            <span className="text-slate-500">Fixed rate payment directly via bank DBT</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-3">
          <PhoneCall className="w-7 h-7 text-sky-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-800 block">Mandi Helpline: 1800-180-1551</span>
            <span className="text-slate-500">Toll-free Kisan call centre 24x7 support</span>
          </div>
        </div>
      </div>

    </div>
  );
}

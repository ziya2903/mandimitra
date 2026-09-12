import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Ticket, 
  ArrowLeft, 
  ArrowRight, 
  Scale, 
  Sprout, 
  Sparkles,
  QrCode,
  MapPin,
  AlertCircle
} from 'lucide-react';

export default function SlotBookingView() {
  const { 
    t, 
    lang, 
    farmerUser, 
    centres, 
    selectedCentreId, 
    setSelectedCentreId, 
    bookSlot, 
    setFarmerView 
  } = useApp();

  // Generate next 4 calendar days
  const availableDays = Array.from({ length: 4 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' });
    const label = index === 0 ? (lang === 'hi' ? 'आज' : 'Today') : index === 1 ? (lang === 'hi' ? 'कल' : 'Tomorrow') : dayName;
    return { dateStr, dayName, monthDay, label, isToday: index === 0 };
  });

  const [selectedDate, setSelectedDate] = useState(availableDays[1]?.dateStr || availableDays[0]?.dateStr);
  const [crop, setCrop] = useState(farmerUser?.crop || 'Wheat');
  const [quantityQuintals, setQuantityQuintals] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTicket, setBookedTicket] = useState(null);

  // MSP rates mapping
  const mspRates = {
    'Wheat': 2275,
    'Paddy': 2320,
    'Mustard': 5650,
    'Gram (Chana)': 5440,
    'Maize': 2090
  };

  const currentMsp = mspRates[crop] || 2275;
  const estimatedPayout = (Number(quantityQuintals) || 0) * currentMsp;

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await bookSlot({
      date: selectedDate,
      crop,
      quantityQuintals: Number(quantityQuintals) || 40,
      centreId: selectedCentreId
    });

    setIsSubmitting(false);

    if (result.success) {
      setBookedTicket(result.booking);
      // Trigger festive confetti for successful token generation
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  // If already booked, show the confirmed digital ticket screen
  if (bookedTicket) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            {t.bookingSuccess}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {t.tokenTicketNotice}
          </p>
        </div>

        {/* Digital Mandi Token Ticket */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ticket-cutout">
          
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white p-6 text-center relative">
            <div className="flex items-center justify-between text-xs opacity-80 uppercase tracking-widest font-semibold mb-2">
              <span>{t.appName} Official Token</span>
              <span>Dept. of Food & Supplies</span>
            </div>
            
            <div className="text-xs font-semibold uppercase tracking-wider text-green-100">
              {t.tokenAssigned}
            </div>
            <div className="text-5xl sm:text-6xl font-black tracking-tight my-2 text-white font-display">
              #{bookedTicket.tokenNumber}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold text-white">
              <Clock className="w-3.5 h-3.5" />
              <span>{bookedTicket.slotTime}</span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dashed border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">{t.fullName}</span>
                <span className="text-sm font-bold text-slate-800">{bookedTicket.farmerName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t.village}</span>
                <span className="text-sm font-bold text-slate-800">{bookedTicket.village}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t.cropType}</span>
                <span className="text-sm font-bold text-emerald-700">{bookedTicket.crop}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t.estimatedQty}</span>
                <span className="text-sm font-bold text-slate-800">{bookedTicket.quantityQuintals} Quintals</span>
              </div>
            </div>

            {/* Centre & Date */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{t.selectedCentre}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {bookedTicket.centreName}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Date: {bookedTicket.date}
                </div>
              </div>

              {/* Simulated QR Code */}
              <div className="p-2 bg-white rounded-xl border border-slate-200 shrink-0 text-center">
                <QrCode className="w-10 h-10 text-slate-800" />
                <span className="text-[8px] font-bold text-slate-400 block mt-0.5">GATE SCAN</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                id="view-live-queue-btn"
                onClick={() => setFarmerView('queue')}
                className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 text-base"
              >
                <span>{t.goToQueueTracker}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setFarmerView('dashboard')}
                className="w-full py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-xs"
              >
                {lang === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Back to Dashboard'}
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-8">
      
      {/* Back Button & Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setFarmerView('dashboard')}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            {t.bookSlotTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {farmerUser?.name} • {farmerUser?.phone}
          </p>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-6">
        
        {/* Date Selector Cards */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-green-600" />
            <span>{t.selectDate}</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {availableDays.map((day) => {
              const isSelected = selectedDate === day.dateStr;
              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/25 scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className={`text-xs font-bold uppercase ${isSelected ? 'text-green-100' : 'text-slate-500'}`}>
                    {day.label}
                  </div>
                  <div className="text-lg font-black mt-0.5 font-display">
                    {day.monthDay}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Crop Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-green-600" />
            <span>{t.cropType}</span>
          </label>
          <select
            id="slot-crop-select"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none text-base font-bold bg-white text-slate-900"
          >
            <option value="Wheat">Wheat / गेहूं (Govt MSP: ₹2,275/Qtl)</option>
            <option value="Paddy">Paddy / धान (Govt MSP: ₹2,320/Qtl)</option>
            <option value="Mustard">Mustard / सरसों (Govt MSP: ₹5,650/Qtl)</option>
            <option value="Gram (Chana)">Gram / चना (Govt MSP: ₹5,440/Qtl)</option>
            <option value="Maize">Maize / मक्का (Govt MSP: ₹2,090/Qtl)</option>
          </select>
        </div>

        {/* Estimated Quantity (Quintals) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-green-600" />
              <span>{t.estimatedQty}</span>
            </label>
            <span className="text-[11px] text-slate-500">{t.quintalsHelp}</span>
          </div>

          <div className="relative">
            <input
              id="slot-qty-input"
              type="number"
              min="5"
              max="500"
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(e.target.value)}
              className="w-full pl-4 pr-16 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none text-xl font-extrabold text-slate-900"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
              Qtls
            </div>
          </div>

          {/* Quick Quintal Chips */}
          <div className="flex gap-2 mt-2">
            {[25, 40, 60, 100].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantityQuintals(q)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                  Number(quantityQuintals) === q
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {q} Qtl
              </button>
            ))}
          </div>
        </div>

        {/* Expected Financial Value Card */}
        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-900 font-semibold">
              {t.govMspRate}: <span className="font-bold">₹{currentMsp.toLocaleString('en-IN')}/{t.perQuintal}</span>
            </div>
            <div className="text-xs text-emerald-700 mt-0.5">
              {lang === 'hi' ? 'अनुमानित सरकारी भुगतान:' : 'Estimated MSP Sanction:'}
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 font-display">
            ₹{estimatedPayout.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Smart Scheduler Notice */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <span>
            {lang === 'hi' 
              ? 'मंडीमित्र स्वचालित स्मार्ट शेड्यूलर आपको भीड़भाड़ से बचाने के लिए सबसे अनुकूल समय स्लॉट और टोकन प्रदान करेगा।' 
              : 'MandiMitra Smart Scheduler auto-assigns an optimal 1-hour time window and sequential token to prevent bottlenecking at the weighing bay.'}
          </span>
        </div>

        {/* Submit Booking Button */}
        <button
          id="confirm-slot-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-bold text-base shadow-xl shadow-green-600/30 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Allocating Token...</span>
          ) : (
            <>
              <Ticket className="w-5 h-5" />
              <span>{t.confirmBooking}</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}

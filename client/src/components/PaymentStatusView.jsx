import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Scale, 
  BadgeCheck, 
  Building, 
  Landmark, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function PaymentStatusView() {
  const { t, lang, activeBooking, setFarmerView } = useApp();
  const booking = activeBooking;

  if (!booking) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{t.noActiveBooking}</h3>
        <button
          onClick={() => setFarmerView('dashboard')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold text-xs"
        >
          {t.welcome}
        </button>
      </div>
    );
  }

  const isCompleted = booking.paymentStatus === 'Completed' || booking.status === 'Payment Done';
  const isProcessing = booking.paymentStatus === 'Processing';

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFarmerView('queue')}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            {t.paymentTitle}
          </h2>
          <p className="text-xs text-slate-500">
            Token #{booking.tokenNumber} • {booking.farmerName}
          </p>
        </div>
      </div>

      {/* Main Payment Status Card */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-200/80 overflow-hidden">
        
        {/* Status Badge Banner */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isCompleted 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
            : isProcessing 
            ? 'bg-blue-50 border-blue-100 text-blue-900' 
            : 'bg-amber-50 border-amber-100 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
            ) : isProcessing ? (
              <Clock className="w-5 h-5 text-blue-600 animate-spin" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.paymentStage}:
            </span>
          </div>

          <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
            isCompleted 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : isProcessing 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-amber-500 text-white shadow-sm'
          }`}>
            {isCompleted ? t.paymentCompleted : isProcessing ? t.paymentProcessing : t.paymentPending}
          </span>
        </div>

        {/* Big Payout Amount Block */}
        <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.totalPayable}
          </div>
          <div 
            id="payment-total-amount"
            className="text-4xl sm:text-5xl font-black text-emerald-700 mt-2 font-display"
          >
            ₹{booking.totalAmount?.toLocaleString('en-IN') || '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {booking.crop} @ Official Govt MSP Rate
          </div>
        </div>

        {/* Procurement Breakdown Fields */}
        <div className="p-6 space-y-4 text-sm">
          
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-slate-400" />
              <span>{t.totalWeight}</span>
            </span>
            <span className="font-extrabold text-slate-900 text-base">
              {booking.quantityQuintals} Quintals
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-slate-400" />
              <span>{t.mspApplied}</span>
            </span>
            <span className="font-extrabold text-slate-900 text-base">
              ₹{booking.mspRate?.toLocaleString('en-IN')} / Qtl
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{t.selectedCentre}</span>
            </span>
            <span className="font-semibold text-slate-700 text-right max-w-[200px] truncate text-xs">
              {booking.centreName}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{lang === 'hi' ? 'तौल का समय' : 'Procured Time'}</span>
            </span>
            <span className="font-semibold text-slate-700">
              {booking.procuredAt || 'Scheduled'}
            </span>
          </div>

        </div>
      </div>

      {/* Direct Benefit Transfer (DBT) Assurance Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-3xl p-5 shadow-lg flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-200 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-white">
            {lang === 'hi' ? '100% प्रत्यक्ष लाभ अंतरण (DBT)' : '100% Direct Benefit Transfer (DBT)'}
          </h4>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
            {t.dbtNotice}
          </p>
        </div>
      </div>

      {/* Return Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => setFarmerView('queue')}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'कतार स्थिति पर वापस जाएं' : 'Back to Live Queue'}</span>
        </button>
        <button
          onClick={() => setFarmerView('dashboard')}
          className="w-full py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>{lang === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Back to Farmer Dashboard'}</span>
        </button>
      </div>

    </div>
  );
}

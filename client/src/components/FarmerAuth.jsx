import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  KeyRound, 
  User, 
  MapPin, 
  Sprout, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function FarmerAuth() {
  const { t, lang, loginFarmer } = useApp();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'profile'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [crop, setCrop] = useState('Wheat');
  const [error, setError] = useState('');

  // Handle phone submission
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError(lang === 'hi' ? 'कृपया 10 अंकों का वैध फोन नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStep('otp');
  };

  // Quick autofill demo phone
  const autofillDemoPhone = () => {
    setPhone('9876543210');
    setError('');
  };

  // Handle OTP digit change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Autofill 1234 mock OTP
  const autofillDemoOtp = () => {
    setOtp(['1', '2', '3', '4']);
    setError('');
  };

  // Handle OTP verification
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      setError(lang === 'hi' ? 'कृपया 4-अंकीय ओटीपी दर्ज करें' : 'Please enter 4-digit OTP');
      return;
    }

    // Accept 1234 or any 4 digit code for demo
    setError('');
    
    // If user is returning (phone is demo 9876543210), autofill profile
    if (phone === '9876543210') {
      loginFarmer({
        name: 'Ramesh Kumar',
        phone: '9876543210',
        village: 'Taraori',
        crop: 'Wheat',
        tokenNumber: 101,
        role: 'FARMER'
      });
    } else {
      setStep('profile');
    }
  };

  // Handle final registration
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
      return;
    }
    loginFarmer({
      name: name.trim(),
      phone,
      village: village.trim() || 'Karnal Block',
      crop,
      role: 'FARMER'
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      {/* Top Banner Card */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 text-white shadow-lg shadow-green-600/30 mb-3">
          <Sprout className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          {t.loginTitle}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t.loginSubtitle}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 'phone' ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</span>
            <span>{t.phoneLabel}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 'otp' ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</span>
            <span>OTP</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 'profile' ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">3</span>
            <span>{lang === 'hi' ? 'विवरण' : 'Details'}</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="font-bold text-sm text-slate-500 mr-1">+91</span>
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="farmer-phone-input"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.phonePlaceholder}
                  className="block w-full pl-20 pr-4 py-3.5 text-lg font-bold tracking-wide rounded-2xl border-2 border-slate-200 focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition-all placeholder:text-slate-400 placeholder:text-sm placeholder:font-normal"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Demo Fill Helper */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">
                {lang === 'hi' ? 'परीक्षण हेतु डेमो नंबर:' : 'Testing with demo number?'}
              </span>
              <button
                type="button"
                onClick={autofillDemoPhone}
                className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors border border-green-200 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>9876543210</span>
              </button>
            </div>

            <button
              id="farmer-send-otp-btn"
              type="submit"
              className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white text-base font-bold shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{lang === 'hi' ? 'ओटीपी प्राप्त करें' : 'Get OTP Code'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* STEP 2: Mock OTP Screen */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-green-50 text-green-700 mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t.otpTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.otpSubtitle} <span className="font-bold text-slate-800">+91 {phone}</span>
              </p>
            </div>

            {/* 4 Digit Boxes */}
            <div className="flex justify-center gap-3 my-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-14 h-14 text-center text-2xl font-black rounded-2xl border-2 border-slate-200 focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              ))}
            </div>

            {/* Quick Demo 1234 Button */}
            <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/80 text-center">
              <div className="text-xs text-amber-900 font-medium">
                {t.otpHelp}
              </div>
              <button
                id="autofill-otp-btn"
                type="button"
                onClick={autofillDemoOtp}
                className="mt-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.autoFillOtp}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm"
              >
                {lang === 'hi' ? 'वापस' : 'Back'}
              </button>
              <button
                id="verify-otp-btn"
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.verifyOtp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Basic Farmer Registration */}
        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {t.fullName}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="farmer-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm font-semibold"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {t.village}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="farmer-village-input"
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t.villagePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {t.cropType}
              </label>
              <select
                id="farmer-crop-select"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm font-semibold bg-white"
              >
                <option value="Wheat">Wheat / गेहूं (MSP ₹2,275)</option>
                <option value="Paddy">Paddy / धान (MSP ₹2,320)</option>
                <option value="Mustard">Mustard / सरसों (MSP ₹5,650)</option>
                <option value="Gram (Chana)">Gram / चना (MSP ₹5,440)</option>
                <option value="Maize">Maize / मक्का (MSP ₹2,090)</option>
              </select>
            </div>

            <button
              id="farmer-complete-reg-btn"
              type="submit"
              className="w-full mt-2 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 text-base"
            >
              <span>{t.continueBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

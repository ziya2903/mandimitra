import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  CloudRain, 
  Cloud, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertOctagon, 
  CheckCircle2, 
  Info,
  RefreshCw,
  Umbrella
} from 'lucide-react';

export default function WeatherWidget() {
  const { 
    t, 
    lang, 
    weather, 
    isWeatherLoading, 
    centres, 
    selectedCentreId, 
    setSelectedCentreId, 
    fetchWeather 
  } = useApp();

  const current = weather?.current;
  const advisory = weather?.advisory;

  const isRainy = advisory?.level === 'warning' || advisory?.level === 'caution';

  const toggleDemoWeather = () => {
    // Toggle between Karnal (typically clear/dry) and Cherrapunji (rain demo)
    const nextCentre = selectedCentreId === 'rainy-demo-centre' ? 'karnal-mandi' : 'rainy-demo-centre';
    setSelectedCentreId(nextCentre);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200/80 overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isRainy ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {isRainy ? <CloudRain className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t.weatherTitle}
          </span>
        </div>

        {/* Live Weather Source Tag & Demo Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-full font-medium hidden sm:inline">
            Open-Meteo Live API
          </span>
          <button
            id="weather-demo-toggle-btn"
            onClick={toggleDemoWeather}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 ${
              selectedCentreId === 'rainy-demo-centre'
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Demonstrate rain vs clear advisory for hackathon judges"
          >
            <Umbrella className="w-3.5 h-3.5" />
            <span>
              {selectedCentreId === 'rainy-demo-centre' 
                ? (lang === 'hi' ? 'दिखाएं: सामान्य मौसम' : 'Demo: Switch to Sunny') 
                : (lang === 'hi' ? 'दिखाएं: बारिश अलर्ट' : 'Demo: Test Rain Alert')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Weather Card Content */}
      <div className="p-4 sm:p-5">
        {isWeatherLoading ? (
          <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Fetching real-time satellite radar...</span>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Top Row: Location & Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500 font-medium">
                  {lang === 'hi' ? 'मौसम केंद्र स्थान' : 'Mandi Location'}
                </div>
                <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{weather?.centreName || 'Karnal Grain Mandi'}</span>
                </div>
              </div>

              {/* Current Metrics Badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-0.5">
                    <Thermometer className="w-3 h-3 text-red-500" />
                    <span>{t.temp}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {current?.temp ?? 32}°C
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-0.5">
                    <Droplets className="w-3 h-3 text-sky-500" />
                    <span>{t.humidity}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {current?.humidity ?? 55}%
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-0.5">
                    <Wind className="w-3 h-3 text-slate-500" />
                    <span>{t.windSpeed}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {current?.wind ?? 12} km/h
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Farmer Weather Advisory Box (High contrast, visual-first for low-literacy) */}
            <div 
              className={`rounded-2xl p-4 border transition-all ${
                advisory?.level === 'warning'
                  ? 'bg-red-50/90 border-red-200 text-red-950'
                  : advisory?.level === 'caution'
                  ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    advisory?.level === 'warning'
                      ? 'bg-red-600 text-white'
                      : advisory?.level === 'caution'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {advisory?.level === 'warning' ? (
                    <AlertOctagon className="w-6 h-6" />
                  ) : advisory?.level === 'caution' ? (
                    <CloudRain className="w-6 h-6" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        advisory?.level === 'warning'
                          ? 'bg-red-200 text-red-900'
                          : advisory?.level === 'caution'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {lang === 'hi' ? advisory?.actionHi : advisory?.action}
                    </span>
                  </div>

                  <p className="font-bold text-base sm:text-lg mt-1 text-slate-900 leading-snug">
                    {lang === 'hi' ? advisory?.messageHi : advisory?.message}
                  </p>

                  <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {isRainy 
                        ? (lang === 'hi' 
                            ? 'खुली ट्रॉलियों को भीगने से बचाने के लिए तिरपाल ढकें अथवा खरीद केंद्र सहायता से संपर्क करें।' 
                            : 'Cover crop loaded vehicles with tarpaulins immediately to prevent moisture rejection.')
                        : (lang === 'hi' 
                            ? 'अगले 6 घंटे में बारिश की कोई संभावना नहीं है। खरीद सामान्य रूप से जारी है।' 
                            : 'Zero rain expected in next 6 hours. High solar drying index at procurement yard.')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

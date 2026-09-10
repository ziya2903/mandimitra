import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  ShieldCheck, 
  Globe, 
  User, 
  LogOut, 
  Radio, 
  LayoutDashboard, 
  Smartphone,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { 
    lang, 
    setLang, 
    t, 
    portal, 
    setPortal, 
    farmerUser, 
    logoutFarmer, 
    adminUser, 
    logoutAdmin,
    wsConnected,
    setFarmerView
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              if (portal === 'farmer') setFarmerView('dashboard');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900 font-display">
                  Mandi<span className="text-green-600">Mitra</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block leading-none">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center: Dual Portal Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="portal-farmer-tab"
              onClick={() => setPortal('farmer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                portal === 'farmer'
                  ? 'bg-white text-green-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.farmerPortal}</span>
            </button>
            <button
              id="portal-admin-tab"
              onClick={() => setPortal('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                portal === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.adminPortal}</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Realtime Indicator */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 border border-slate-200"
              title={wsConnected ? 'Real-time sync active' : 'Connecting to real-time sync...'}
            >
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-slate-600">{wsConnected ? 'Live Sync' : 'Connecting...'}</span>
            </div>

            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-700 bg-white"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-green-600" />
              <span>{t.langToggle}</span>
            </button>

            {/* User Profile / Logout */}
            {portal === 'farmer' && farmerUser && (
              <div className="flex items-center gap-1.5 pl-1">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                    {farmerUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {farmerUser.village || 'Farmer'}
                  </div>
                </div>
                <button
                  onClick={logoutFarmer}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {portal === 'admin' && adminUser && (
              <div className="flex items-center gap-1.5 pl-1">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    Staff Console
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    Verified Officer
                  </div>
                </div>
                <button
                  onClick={logoutAdmin}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LiveAlertBanner from './components/LiveAlertBanner';
import FarmerAuth from './components/FarmerAuth';
import FarmerDashboard from './components/FarmerDashboard';
import SlotBookingView from './components/SlotBookingView';
import QueueTracker from './components/QueueTracker';
import PaymentStatusView from './components/PaymentStatusView';
import AdminPortal from './components/AdminPortal';
import { 
  Home, 
  Ticket, 
  Clock, 
  CreditCard, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const { 
    portal, 
    farmerView, 
    setFarmerView, 
    farmerUser, 
    activeBooking, 
    t, 
    lang 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-green-100 selection:text-green-900 pb-20 md:pb-8">
      {/* Top Navigation */}
      <Navbar />

      {/* Floating In-App Real-time Progression Alert */}
      <LiveAlertBanner />

      {/* Main Container */}
      <main className="flex-1">
        {portal === 'farmer' ? (
          <>
            {!farmerUser ? (
              <FarmerAuth />
            ) : (
              <div className="animate-fade-in">
                {farmerView === 'dashboard' && <FarmerDashboard />}
                {farmerView === 'book-slot' && <SlotBookingView />}
                {farmerView === 'queue' && <QueueTracker />}
                {farmerView === 'payment' && <PaymentStatusView />}
              </div>
            )}
          </>
        ) : (
          <AdminPortal />
        )}
      </main>

      {/* Farmer Mobile Bottom Navigation Bar (Visible only on phone screens when logged in as Farmer) */}
      {portal === 'farmer' && farmerUser && (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-slate-200 z-30 px-3 py-2 flex items-center justify-around shadow-lg">
          <button
            id="mobile-nav-dashboard"
            onClick={() => setFarmerView('dashboard')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
              farmerView === 'dashboard' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'होम' : 'Home'}</span>
          </button>

          <button
            id="mobile-nav-book"
            onClick={() => setFarmerView('book-slot')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
              farmerView === 'book-slot' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'स्लॉट बुक' : 'Book Slot'}</span>
          </button>

          <button
            id="mobile-nav-queue"
            onClick={() => setFarmerView('queue')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl relative transition-colors ${
              farmerView === 'queue' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Clock className="w-5 h-5" />
            {activeBooking && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            )}
            <span className="text-[10px]">{lang === 'hi' ? 'कतार' : 'Queue'}</span>
          </button>

          <button
            id="mobile-nav-payment"
            onClick={() => setFarmerView('payment')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
              farmerView === 'payment' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'भुगतान' : 'Payout'}</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">MandiMitra</span>
            <span>•</span>
            <span>Smart Automation for Procurement Congestion (SIH26032)</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Real-time Sync & Open-Meteo Weather Advisory Engine
          </div>
        </div>
      </footer>
    </div>
  );
}

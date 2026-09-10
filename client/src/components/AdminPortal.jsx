import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Search, 
  Filter, 
  TrendingUp, 
  CloudRain, 
  Sun, 
  RefreshCw, 
  ChevronRight, 
  ShieldCheck, 
  CreditCard, 
  KeyRound, 
  Mail, 
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  Building,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

export default function AdminPortal() {
  const { 
    t, 
    lang, 
    adminUser, 
    loginAdmin, 
    logoutAdmin, 
    bookings, 
    updateBookingStatus, 
    updateProcurement, 
    weather, 
    selectedCentreId, 
    setSelectedCentreId, 
    centres,
    resetDemo,
    wsConnected
  } = useApp();

  // Admin login form state
  const [email, setEmail] = useState('admin@mandimitra.gov.in');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Table filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Procurement Weighment Modal state
  const [activeModalBooking, setActiveModalBooking] = useState(null);
  const [modalQty, setModalQty] = useState('');
  const [modalRate, setModalRate] = useState('');
  const [modalPaymentStatus, setModalPaymentStatus] = useState('Completed');
  const [modalNotes, setModalNotes] = useState('');
  const [isSavingProcurement, setIsSavingProcurement] = useState(false);

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const res = await loginAdmin(email, password);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.message || 'Invalid credentials');
    }
  };

  // Quick autofill demo credentials
  const fillDemoAdmin = () => {
    setEmail('admin@mandimitra.gov.in');
    setPassword('admin123');
    setLoginError('');
  };

  // Advance stage with 1 click
  const advanceStage = async (booking) => {
    let nextStage = 'Arrived';
    if (booking.status === 'Booked') nextStage = 'Arrived';
    else if (booking.status === 'Arrived') nextStage = 'Quality Check';
    else if (booking.status === 'Quality Check') {
      // Open weighment modal directly
      openWeighmentModal(booking);
      return;
    } else if (booking.status === 'Procured') nextStage = 'Payment Done';

    await updateBookingStatus(booking.id, nextStage);
  };

  const openWeighmentModal = (booking) => {
    setActiveModalBooking(booking);
    setModalQty(booking.quantityQuintals || 45);
    setModalRate(booking.mspRate || 2275);
    setModalPaymentStatus('Processing');
    setModalNotes(booking.notes || 'Grade-A produce, moisture verified under 12%');
  };

  const handleSaveProcurement = async (e) => {
    e.preventDefault();
    if (!activeModalBooking) return;
    setIsSavingProcurement(true);

    await updateProcurement(activeModalBooking.id, {
      quantityQuintals: Number(modalQty),
      mspRate: Number(modalRate),
      paymentStatus: modalPaymentStatus,
      notes: modalNotes
    });

    setIsSavingProcurement(false);
    setActiveModalBooking(null);
  };

  // If not logged in as Admin, show Staff Login Screen
  if (!adminUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            {t.adminTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official login for Procurement Officers & Mandi Weighbridge Operators
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Staff Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="admin-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-semibold"
                  placeholder="admin@mandimitra.gov.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Staff Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-semibold"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Autofill Helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">SIH Evaluator Demo Login:</span>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Auto-fill Admin</span>
              </button>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoggingIn ? 'Verifying...' : 'Access Staff Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(b.tokenNumber).includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Operational Metrics
  const totalFarmersToday = bookings.length;
  const completedFarmers = bookings.filter(b => b.status === 'Payment Done').length;
  const activeInQueue = bookings.filter(b => ['Arrived', 'Quality Check', 'Procured'].includes(b.status)).length;
  const totalQuintals = bookings.reduce((sum, b) => sum + (Number(b.quantityQuintals) || 0), 0);
  const totalDisbursed = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const avgWaitMins = activeInQueue > 0 ? (activeInQueue * 14) : 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner: Centre Title & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white">
              Official Staff Console
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 font-display">
            {centres.find(c => c.id === selectedCentreId)?.name || 'Karnal Grain Mandi (Centre #12)'}
          </h1>
          <p className="text-xs text-slate-500">
            Automated Weighbridge, Moisture Lab & Direct MSP Settlement Terminal
          </p>
        </div>

        {/* Center & Demo Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            id="admin-mandi-select"
            value={selectedCentreId}
            onChange={(e) => setSelectedCentreId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
          >
            {centres.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            id="admin-reset-demo-btn"
            onClick={resetDemo}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            title="Reset queue tokens to clean demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDemo}</span>
          </button>
        </div>
      </div>

      {/* TOP ANALYTICS & WEATHER RADAR ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Total Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.totalToday}</span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-display">
            {totalFarmersToday}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Registered for today's slots
          </div>
        </div>

        {/* Metric 2: Active in Mandi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.activeInQueue}</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-display">
            {activeInQueue}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            At gate or testing bays
          </div>
        </div>

        {/* Metric 3: Completed Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-display">
            {completedFarmers}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Procured & paid via DBT
          </div>
        </div>

        {/* Metric 4: Procured Quantity */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Tonnage</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-display">
            {totalQuintals} <span className="text-sm font-bold text-slate-500">Qtls</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            ₹{totalDisbursed.toLocaleString('en-IN')} value
          </div>
        </div>

        {/* Staff Weather Planning Radar Card (Visible to admin to plan pace) */}
        <div className={`p-4 rounded-2xl border shadow-soft md:col-span-4 lg:col-span-1 ${
          weather?.advisory?.level === 'warning' 
            ? 'bg-red-50/90 border-red-200 text-red-950' 
            : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              Mandi Weather Radar
            </span>
            {weather?.advisory?.level === 'warning' ? (
              <CloudRain className="w-4 h-4 text-red-600" />
            ) : (
              <Sun className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className="text-sm font-extrabold mt-1 leading-tight">
            {weather?.current?.temp ?? 32}°C • {weather?.advisory?.action}
          </div>
          <p className="text-[11px] mt-1 text-slate-600 line-clamp-2">
            {weather?.advisory?.message}
          </p>
        </div>

      </div>

      {/* QUEUE TABLE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        
        {/* Table Header Controls: Search & Filter Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Booked', 'Arrived', 'Quality Check', 'Procured', 'Payment Done'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'ALL' ? t.allStatuses : status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="admin-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none"
            />
          </div>

        </div>

        {/* Live Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{t.tableToken}</th>
                <th className="py-3.5 px-4">{t.tableFarmer}</th>
                <th className="py-3.5 px-4">{t.tableCrop}</th>
                <th className="py-3.5 px-4">{t.tableSlot}</th>
                <th className="py-3.5 px-4">{t.tableStatus}</th>
                <th className="py-3.5 px-4">{t.tableQty}</th>
                <th className="py-3.5 px-4">{t.tableAmount}</th>
                <th className="py-3.5 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                    No matching farmer bookings found in current view.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isDone = b.status === 'Payment Done';
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Token # */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          #{b.tokenNumber}
                        </span>
                      </td>

                      {/* Farmer Name & Village */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.farmerName}</div>
                        <div className="text-[10px] text-slate-400">
                          {b.village} • +91 {b.phone}
                        </div>
                      </td>

                      {/* Crop */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {b.crop}
                        </span>
                      </td>

                      {/* Slot Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {b.slotTime}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          b.status === 'Payment Done'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Procured'
                            ? 'bg-teal-100 text-teal-800'
                            : b.status === 'Quality Check'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : b.status === 'Arrived'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            b.status === 'Payment Done' ? 'bg-emerald-600' :
                            b.status === 'Procured' ? 'bg-teal-600' :
                            b.status === 'Quality Check' ? 'bg-amber-500' :
                            b.status === 'Arrived' ? 'bg-indigo-600' : 'bg-slate-400'
                          }`}></span>
                          <span>{b.status}</span>
                        </span>
                      </td>

                      {/* Weight (Quintals) */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {b.quantityQuintals} Qtl
                      </td>

                      {/* Total Amount (₹) */}
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        ₹{b.totalAmount ? b.totalAmount.toLocaleString('en-IN') : '-'}
                      </td>

                      {/* Stage Progression Actions (Key live sync demo feature) */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {b.status === 'Booked' && (
                            <button
                              id={`action-arrive-${b.tokenNumber}`}
                              onClick={() => advanceStage(b)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <span>{t.markArrived}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          {b.status === 'Arrived' && (
                            <button
                              id={`action-qc-${b.tokenNumber}`}
                              onClick={() => advanceStage(b)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <span>{t.passQC}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          {b.status === 'Quality Check' && (
                            <button
                              id={`action-weigh-${b.tokenNumber}`}
                              onClick={() => openWeighmentModal(b)}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Scale className="w-3 h-3" />
                              <span>{t.recordProcurement}</span>
                            </button>
                          )}

                          {b.status === 'Procured' && (
                            <button
                              id={`action-pay-${b.tokenNumber}`}
                              onClick={() => advanceStage(b)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <BadgeIndianRupee className="w-3 h-3" />
                              <span>{t.completePayment}</span>
                            </button>
                          )}

                          {isDone && (
                            <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </span>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* WEIGHMENT & MSP RECORDING MODAL */}
      {activeModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Weighbridge Entry Bay
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Token #{activeModalBooking.tokenNumber} • {activeModalBooking.farmerName}
                </h3>
              </div>
              <span className="font-bold text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100">
                {activeModalBooking.crop}
              </span>
            </div>

            <form onSubmit={handleSaveProcurement} className="space-y-4 my-4">
              
              {/* Quantity Quintals */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Actual Weighed Quantity (Quintals)
                </label>
                <div className="relative">
                  <input
                    id="modal-weighed-qty-input"
                    type="number"
                    step="0.1"
                    min="1"
                    value={modalQty}
                    onChange={(e) => setModalQty(e.target.value)}
                    className="w-full pl-4 pr-14 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none text-lg font-black text-slate-900"
                    required
                  />
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400">
                    Qtls
                  </span>
                </div>
              </div>

              {/* MSP Rate */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Applicable MSP Rate (₹ / Quintal)
                </label>
                <div className="relative">
                  <input
                    id="modal-msp-rate-input"
                    type="number"
                    value={modalRate}
                    onChange={(e) => setModalRate(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none text-base font-bold text-slate-900"
                    required
                  />
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400">
                    ₹
                  </span>
                </div>
              </div>

              {/* Auto-Calculated Total */}
              <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">
                  Total Calculated Payout:
                </span>
                <span className="text-xl font-black text-emerald-800 font-display">
                  ₹{((Number(modalQty) || 0) * (Number(modalRate) || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Stage */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Payment Routing Status
                </label>
                <select
                  id="modal-payment-status-select"
                  value={modalPaymentStatus}
                  onChange={(e) => setModalPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-slate-900 text-xs font-bold bg-white"
                >
                  <option value="Processing">Processing (Under Verification)</option>
                  <option value="Completed">Completed (Sanctioned DBT)</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalBooking(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  id="modal-confirm-weighment-btn"
                  type="submit"
                  disabled={isSavingProcurement}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <Scale className="w-4 h-4" />
                  <span>Confirm Weighment</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

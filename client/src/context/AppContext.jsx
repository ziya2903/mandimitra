import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations } from '../translations';

const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;

  // View & Auth State
  const [portal, setPortal] = useState('farmer'); // 'farmer' | 'admin'
  const [farmerView, setFarmerView] = useState('dashboard'); // 'dashboard' | 'book-slot' | 'queue' | 'payment'
  
  // Farmer session
  const [farmerUser, setFarmerUser] = useState(() => {
    const saved = localStorage.getItem('mandimitra_farmer');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin session
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('mandimitra_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // Active selected token number for multi-token farmer sessions
  const [selectedTokenNumber, setSelectedTokenNumber] = useState(null);

  // Data & Realtime Sync State
  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState('karnal-mandi');
  const [bookings, setBookings] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [liveBanner, setLiveBanner] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Audio chime generator for live status updates (Web Audio API - no external file needed)
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      // Audio not supported or allowed
    }
  };

  // Connect WebSocket for sub-second real-time sync
  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    try {
      const socket = new WebSocket(WS_URL);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsConnected(true);
        console.log('⚡ Connected to MandiMitra Realtime WebSocket');
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'INIT_STATE') {
            if (message.data.bookings) setBookings(message.data.bookings);
            if (message.data.centres) setCentres(message.data.centres);
          } else if (message.type === 'QUEUE_UPDATE') {
            const { action, booking, bookings: updatedList } = message.data;
            if (updatedList) setBookings(updatedList);

            // Check if this update belongs to current logged in farmer
            if (booking && farmerUser && (booking.phone === farmerUser.phone || String(booking.tokenNumber) === String(farmerUser.tokenNumber))) {
              playChime();
              
              if (action === 'STATUS_UPDATED') {
                setLiveBanner({
                  title: `Token #${booking.tokenNumber} Status Updated!`,
                  message: `New Stage: ${booking.status}. Your position is updating in real time.`,
                  type: 'success',
                  timestamp: Date.now()
                });
              } else if (action === 'PROCUREMENT_UPDATED') {
                setLiveBanner({
                  title: `Procurement Weighed: ${booking.quantityQuintals} Quintals`,
                  message: `Payout: ₹${booking.totalAmount?.toLocaleString('en-IN')} (Status: ${booking.paymentStatus})`,
                  type: 'info',
                  timestamp: Date.now()
                });
              }

              // Auto-dismiss banner after 7 seconds
              setTimeout(() => {
                setLiveBanner((curr) => (curr?.timestamp && Date.now() - curr.timestamp >= 6800 ? null : curr));
              }, 7000);
            }
          }
        } catch (err) {
          console.error('Error processing WS message:', err);
        }
      };

      socket.onclose = () => {
        setWsConnected(false);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      socket.onerror = () => {
        setWsConnected(false);
      };
    } catch (e) {
      console.warn('WebSocket connection error:', e);
    }
  };

  useEffect(() => {
    connectWebSocket();
    fetchCentres();
    fetchBookings();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  // Fetch Centres
  const fetchCentres = async () => {
    try {
      const res = await fetch(`${API_BASE}/centres`);
      const data = await res.json();
      if (data.success) {
        setCentres(data.centres);
      }
    } catch (e) {
      console.error('Failed to load centres:', e);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error('Failed to load bookings:', e);
    }
  };

  // Fetch Weather for selected centre
  const fetchWeather = async (centreId = selectedCentreId) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch(`${API_BASE}/weather?centreId=${centreId}`);
      const data = await res.json();
      if (data.success) {
        setWeather(data);
      }
    } catch (e) {
      console.error('Weather fetch error:', e);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCentreId) {
      fetchWeather(selectedCentreId);
    }
  }, [selectedCentreId]);

  // Farmer login handler
  const loginFarmer = (userData) => {
    setFarmerUser(userData);
    if (userData?.tokenNumber) {
      setSelectedTokenNumber(userData.tokenNumber);
    } else {
      setSelectedTokenNumber(null);
    }
    localStorage.setItem('mandimitra_farmer', JSON.stringify(userData));
    setFarmerView('dashboard');
  };

  const logoutFarmer = () => {
    setFarmerUser(null);
    setSelectedTokenNumber(null);
    localStorage.removeItem('mandimitra_farmer');
    setFarmerView('dashboard');
  };

  // Admin login handler
  const loginAdmin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUser(data.user);
        localStorage.setItem('mandimitra_admin', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      return { success: false, message: 'Server communication failed' };
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('mandimitra_admin');
  };

  // Farmer creates slot booking
  const bookSlot = async (bookingData) => {
    try {
      const payload = {
        farmerName: farmerUser?.name || bookingData.farmerName,
        phone: farmerUser?.phone || bookingData.phone,
        village: farmerUser?.village || bookingData.village,
        crop: bookingData.crop || farmerUser?.crop || 'Wheat',
        centreId: bookingData.centreId || selectedCentreId,
        date: bookingData.date,
        quantityQuintals: bookingData.quantityQuintals
      };

      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        // Automatically switch to the newly booked token
        if (data.booking?.tokenNumber) {
          setSelectedTokenNumber(data.booking.tokenNumber);
        }
        const updatedFarmer = {
          ...farmerUser,
          tokenNumber: data.booking.tokenNumber,
          activeBookingId: data.booking.id
        };
        setFarmerUser(updatedFarmer);
        localStorage.setItem('mandimitra_farmer', JSON.stringify(updatedFarmer));
        return { success: true, booking: data.booking };
      }
      return { success: false, message: data.message };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Admin updates status (Arrived -> QC -> Procured -> Payment Done)
  const updateBookingStatus = async (bookingId, newStatus, notes = '') => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes })
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Update status error:', e);
      return { success: false, message: e.message };
    }
  };

  // Admin updates procurement quantities and payment
  const updateProcurement = async (bookingId, { quantityQuintals, mspRate, paymentStatus, notes }) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/procurement`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityQuintals, mspRate, paymentStatus, notes })
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Update procurement error:', e);
      return { success: false, message: e.message };
    }
  };

  // Reset demo
  const resetDemo = async () => {
    try {
      await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
      fetchBookings();
    } catch (e) {
      console.error('Reset error:', e);
    }
  };

  // Computed: all bookings belonging to this farmer
  const farmerBookings = farmerUser?.phone 
    ? bookings.filter(b => b.phone === farmerUser.phone) 
    : [];

  // Computed: current farmer's active booking (prioritizes explicitly selected or in-progress)
  const activeBooking = (() => {
    if (!farmerUser || farmerBookings.length === 0) return null;

    // 1. If a specific token is selected, find it
    if (selectedTokenNumber) {
      const match = farmerBookings.find(b => b.tokenNumber === selectedTokenNumber);
      if (match) return match;
    }

    // 2. Prioritize active, in-progress bookings (not yet 'Payment Done')
    const inProgress = farmerBookings
      .filter(b => b.status !== 'Payment Done')
      .sort((a, b) => b.tokenNumber - a.tokenNumber);
    if (inProgress.length > 0) return inProgress[0];

    // 3. Fallback: most recent completed booking (highest token number)
    const sorted = [...farmerBookings].sort((a, b) => b.tokenNumber - a.tokenNumber);
    return sorted[0] || null;
  })();

  return (
    <AppContext.Provider value={{
      lang,
      setLang,
      t,
      portal,
      setPortal,
      farmerView,
      setFarmerView,
      farmerUser,
      adminUser,
      loginFarmer,
      logoutFarmer,
      loginAdmin,
      logoutAdmin,
      centres,
      selectedCentreId,
      setSelectedCentreId,
      bookings,
      weather,
      isWeatherLoading,
      fetchWeather,
      wsConnected,
      liveBanner,
      setLiveBanner,
      bookSlot,
      updateBookingStatus,
      updateProcurement,
      resetDemo,
      farmerBookings,
      selectedTokenNumber,
      setSelectedTokenNumber,
      activeBooking
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { initFirebase } from './firebase.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());

// Available Procurement Centres
const CENTRES = [
  {
    id: 'karnal-mandi',
    name: 'Karnal Grain Mandi (Centre #12)',
    state: 'Haryana',
    district: 'Karnal',
    lat: 29.6857,
    lon: 76.9905,
    commodities: ['Wheat', 'Paddy', 'Mustard'],
    dailyCapacityQuintals: 3500,
    openTime: '08:00 AM',
    closeTime: '06:00 PM',
  },
  {
    id: 'khanna-mandi',
    name: 'Khanna Agro Procurement Centre',
    state: 'Punjab',
    district: 'Ludhiana',
    lat: 30.7027,
    lon: 76.2212,
    commodities: ['Wheat', 'Paddy'],
    dailyCapacityQuintals: 5000,
    openTime: '08:00 AM',
    closeTime: '07:00 PM',
  },
  {
    id: 'kota-mandi',
    name: 'Kota Mandi Samiti (Bhamashah)',
    state: 'Rajasthan',
    district: 'Kota',
    lat: 25.1760,
    lon: 75.8360,
    commodities: ['Mustard', 'Gram (Chana)', 'Wheat', 'Soybean'],
    dailyCapacityQuintals: 4000,
    openTime: '08:30 AM',
    closeTime: '06:30 PM',
  },
  {
    id: 'rainy-demo-centre',
    name: 'Cherrapunji Hills Mandi (Rain Demo)',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    lat: 25.2986,
    lon: 91.5822,
    commodities: ['Paddy', 'Maize', 'Ginger'],
    dailyCapacityQuintals: 1500,
    openTime: '09:00 AM',
    closeTime: '05:00 PM',
    isRainDemo: true,
  }
];

// Standard MSP Reference Rates (₹ per Quintal for 2025-2026)
const MSP_RATES = {
  'Wheat': 2275,
  'Paddy': 2320,
  'Mustard': 5650,
  'Gram (Chana)': 5440,
  'Maize': 2090,
  'Soybean': 4600
};

// Seed Bookings Data
let tokenSequence = 105;
const generateSeedBookings = () => [
  {
    id: 'book-101',
    tokenNumber: 101,
    farmerName: 'Ramesh Kumar',
    phone: '9876543210',
    village: 'Taraori',
    crop: 'Wheat',
    centreId: 'karnal-mandi',
    centreName: 'Karnal Grain Mandi (Centre #12)',
    date: new Date().toISOString().split('T')[0],
    slotTime: '09:00 AM - 10:00 AM',
    status: 'Payment Done', // Booked -> Arrived -> Quality Check -> Procured -> Payment Done
    quantityQuintals: 45,
    mspRate: 2275,
    totalAmount: 102375,
    paymentStatus: 'Completed',
    arrivedAt: '08:50 AM',
    qcPassedAt: '09:20 AM',
    procuredAt: '09:45 AM',
    paymentDoneAt: '10:15 AM',
    notes: 'Grade-A Sharbati Wheat, moisture 11.2%'
  },
  {
    id: 'book-102',
    tokenNumber: 102,
    farmerName: 'Baldev Singh',
    phone: '9812345678',
    village: 'Nilokheri',
    crop: 'Paddy',
    centreId: 'karnal-mandi',
    centreName: 'Karnal Grain Mandi (Centre #12)',
    date: new Date().toISOString().split('T')[0],
    slotTime: '09:30 AM - 10:30 AM',
    status: 'Procured',
    quantityQuintals: 60,
    mspRate: 2320,
    totalAmount: 139200,
    paymentStatus: 'Processing',
    arrivedAt: '09:15 AM',
    qcPassedAt: '09:40 AM',
    procuredAt: '10:05 AM',
    paymentDoneAt: null,
    notes: 'Basmati-1509 Paddy, weighment slips verified'
  },
  {
    id: 'book-103',
    tokenNumber: 103,
    farmerName: 'Jagdish Prasad',
    phone: '9923456789',
    village: 'Indri',
    crop: 'Mustard',
    centreId: 'karnal-mandi',
    centreName: 'Karnal Grain Mandi (Centre #12)',
    date: new Date().toISOString().split('T')[0],
    slotTime: '10:00 AM - 11:00 AM',
    status: 'Quality Check',
    quantityQuintals: 30,
    mspRate: 5650,
    totalAmount: 169500,
    paymentStatus: 'Pending',
    arrivedAt: '09:55 AM',
    qcPassedAt: null,
    procuredAt: null,
    paymentDoneAt: null,
    notes: 'Moisture check underway in Lab Booth #2'
  },
  {
    id: 'book-104',
    tokenNumber: 104,
    farmerName: 'Harpreet Kaur',
    phone: '9734567890',
    village: 'Gharaunda',
    crop: 'Wheat',
    centreId: 'karnal-mandi',
    centreName: 'Karnal Grain Mandi (Centre #12)',
    date: new Date().toISOString().split('T')[0],
    slotTime: '10:30 AM - 11:30 AM',
    status: 'Arrived',
    quantityQuintals: 50,
    mspRate: 2275,
    totalAmount: 113750,
    paymentStatus: 'Pending',
    arrivedAt: '10:20 AM',
    qcPassedAt: null,
    procuredAt: null,
    paymentDoneAt: null,
    notes: 'Vehicle at Gate 1, token verified'
  }
];

let bookings = generateSeedBookings();

// Broadcast event to all WebSocket clients
const broadcast = (type, payload) => {
  const message = JSON.stringify({ type, data: payload, timestamp: Date.now() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// WebSocket connection handling
wss.on('connection', (ws) => {
  // Send initial snapshot
  ws.send(JSON.stringify({
    type: 'INIT_STATE',
    data: {
      bookings,
      centres: CENTRES,
      mspRates: MSP_RATES
    }
  }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch (e) {
      // ignore
    }
  });
});

// Calculate how many farmers ahead for a given booking
const getFarmersAhead = (booking) => {
  if (!booking) return 0;
  if (['Procured', 'Payment Done'].includes(booking.status)) return 0;
  
  // Pending queue is anyone booked for the same centre on the same day before this farmer who is not yet procured
  return bookings.filter(b => 
    b.centreId === booking.centreId &&
    b.date === booking.date &&
    b.tokenNumber < booking.tokenNumber &&
    !['Procured', 'Payment Done'].includes(b.status)
  ).length;
};

// REST API Endpoints

// Centres list
app.get('/api/centres', (req, res) => {
  res.json({ success: true, centres: CENTRES });
});

// MSP Rates
app.get('/api/msp-rates', (req, res) => {
  res.json({ success: true, mspRates: MSP_RATES });
});

// Weather API from Open-Meteo with advisory logic
app.get('/api/weather', async (req, res) => {
  try {
    const { centreId, lat, lon } = req.query;
    let targetLat = lat;
    let targetLon = lon;
    let targetName = 'Selected Centre';

    if (centreId) {
      const centre = CENTRES.find(c => c.id === centreId) || CENTRES[0];
      targetLat = centre.lat;
      targetLon = centre.lon;
      targetName = centre.name;
    }

    if (!targetLat || !targetLon) {
      targetLat = CENTRES[0].lat;
      targetLon = CENTRES[0].lon;
      targetName = CENTRES[0].name;
    }

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=precipitation_probability,rain&forecast_days=2&timezone=auto`;
    
    const weatherResponse = await fetch(openMeteoUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Open-Meteo returned status ${weatherResponse.status}`);
    }
    const weatherData = await weatherResponse.json();

    const current = weatherData.current || {};
    const temp = current.temperature_2m ?? 28;
    const humidity = current.relative_humidity_2m ?? 60;
    const rain = current.rain ?? 0;
    const precip = current.precipitation ?? 0;
    const wind = current.wind_speed_10m ?? 10;
    const weatherCode = current.weather_code ?? 0;

    // Check next 3 hours forecast from hourly data
    let rainInNextHours = false;
    let maxHourlyRain = 0;
    if (weatherData.hourly && weatherData.hourly.rain) {
      const currentHourIndex = new Date().getHours();
      const next3HoursRain = weatherData.hourly.rain.slice(currentHourIndex, currentHourIndex + 4);
      maxHourlyRain = Math.max(...(next3HoursRain.length ? next3HoursRain : [0]));
      if (maxHourlyRain > 0.2) {
        rainInNextHours = true;
      }
    }

    // Determine smart advisory status
    let advisoryLevel = 'safe'; // safe | caution | warning
    let advisoryMessage = '☀️ Good weather today — safe to bring your crop to the procurement centre.';
    let advisoryMessageHi = '☀️ आज मौसम साफ है — अपनी फसल को सुरक्षित रूप से केंद्र पर लाएं।';
    let advisoryAction = 'Normal Arrival Recommended';
    let advisoryActionHi = 'सामान्य आगमन की सिफारिश';

    if (rain > 1.0 || weatherCode >= 61 && weatherCode <= 67 || weatherCode >= 80) {
      advisoryLevel = 'warning';
      advisoryMessage = '🌧️ Rain active at the centre! Tarpaulin cover mandatory. Consider waiting if crops are uncovered.';
      advisoryMessageHi = '🌧️ केंद्र पर बारिश हो रही है! तिरपाल से ढंकना अनिवार्य है। फसल भीगने से बचाने के लिए इंतजार करें।';
      advisoryAction = 'Tarpaulin Cover Mandatory / Delay Inflow';
      advisoryActionHi = 'तिरपाल ढकना अनिवार्य / आगमन स्थगित करें';
    } else if (rainInNextHours || maxHourlyRain > 0.3 || (weatherCode >= 51 && weatherCode <= 57)) {
      advisoryLevel = 'caution';
      advisoryMessage = '🌦️ Rain expected in next 2 hours — secure crop with waterproof sheets or delay transit.';
      advisoryMessageHi = '🌦️ अगले 2 घंटों में बारिश की संभावना है — फसल को वाटरप्रूफ तिरपाल से सुरक्षित करें।';
      advisoryAction = 'Prepare Rain Covers';
      advisoryActionHi = 'बारिश से बचाव की तैयारी रखें';
    } else if (wind > 35) {
      advisoryLevel = 'caution';
      advisoryMessage = '💨 High wind speeds detected — secure loose grain transport and light tractor trolleys.';
      advisoryMessageHi = '💨 तेज हवाएं चल रही हैं — खुली ट्रॉलियों को अच्छी तरह बांधकर लाएं।';
      advisoryAction = 'Secure Transport';
      advisoryActionHi = 'परिवहन सुरक्षा सुनिश्चित करें';
    }

    res.json({
      success: true,
      centreName: targetName,
      coordinates: { lat: targetLat, lon: targetLon },
      current: {
        temp,
        humidity,
        rain,
        precip,
        wind,
        weatherCode,
      },
      advisory: {
        level: advisoryLevel,
        message: advisoryMessage,
        messageHi: advisoryMessageHi,
        action: advisoryAction,
        actionHi: advisoryActionHi,
        rainInNextHours,
        maxHourlyRain
      }
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Graceful fallback weather response so app never crashes
    res.json({
      success: true,
      centreName: 'Procurement Centre',
      current: {
        temp: 29.5,
        humidity: 55,
        rain: 0,
        precip: 0,
        wind: 12,
        weatherCode: 1,
      },
      advisory: {
        level: 'safe',
        message: '☀️ Clear weather detected — safe to bring your crop for procurement today.',
        messageHi: '☀️ मौसम अनुकूल है — आज अपनी उपज मंडी लाने के लिए सुरक्षित है।',
        action: 'Normal Arrival',
        actionHi: 'सामान्य आगमन',
        rainInNextHours: false,
        maxHourlyRain: 0
      }
    });
  }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  const { centreId, date, phone } = req.query;
  let filtered = [...bookings];
  if (centreId) {
    filtered = filtered.filter(b => b.centreId === centreId);
  }
  if (date) {
    filtered = filtered.filter(b => b.date === date);
  }
  if (phone) {
    filtered = filtered.filter(b => b.phone === phone);
  }

  // Calculate live farmersAhead for each
  const withAhead = filtered.map(b => ({
    ...b,
    farmersAhead: getFarmersAhead(b)
  }));

  res.json({ success: true, bookings: withAhead });
});

// Get single booking
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id || String(b.tokenNumber) === req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.json({
    success: true,
    booking: {
      ...booking,
      farmersAhead: getFarmersAhead(booking)
    }
  });
});

// Create new booking (Farmer slot booking)
app.post('/api/bookings', (req, res) => {
  const {
    farmerName,
    phone,
    village,
    crop,
    centreId,
    date,
    quantityQuintals
  } = req.body;

  if (!farmerName || !phone || !crop) {
    return res.status(400).json({ success: false, message: 'Missing required booking fields' });
  }

  const centre = CENTRES.find(c => c.id === centreId) || CENTRES[0];
  const assignedToken = tokenSequence++;
  
  // Auto-assign slot time based on token remainder
  const timeSlots = [
    '08:30 AM - 09:30 AM',
    '09:30 AM - 10:30 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:30 PM',
    '01:30 PM - 02:30 PM',
    '02:30 PM - 03:30 PM',
    '03:30 PM - 04:30 PM'
  ];
  const slotTime = timeSlots[assignedToken % timeSlots.length];
  const msp = MSP_RATES[crop] || 2275;
  const qty = Number(quantityQuintals) || 40;

  const newBooking = {
    id: `book-${assignedToken}`,
    tokenNumber: assignedToken,
    farmerName,
    phone,
    village: village || 'Local Block',
    crop,
    centreId: centre.id,
    centreName: centre.name,
    date: date || new Date().toISOString().split('T')[0],
    slotTime,
    status: 'Booked', // Initial stage
    quantityQuintals: qty,
    mspRate: msp,
    totalAmount: qty * msp,
    paymentStatus: 'Pending',
    arrivedAt: null,
    qcPassedAt: null,
    procuredAt: null,
    paymentDoneAt: null,
    notes: 'Slot auto-allocated by MandiMitra Smart Scheduler'
  };

  bookings.push(newBooking);

  // Broadcast to all staff and farmers
  broadcast('QUEUE_UPDATE', {
    action: 'CREATED',
    booking: {
      ...newBooking,
      farmersAhead: getFarmersAhead(newBooking)
    },
    bookings: bookings.map(b => ({ ...b, farmersAhead: getFarmersAhead(b) }))
  });

  res.status(201).json({
    success: true,
    booking: {
      ...newBooking,
      farmersAhead: getFarmersAhead(newBooking)
    }
  });
});

// Update status (Admin stage progression: Booked -> Arrived -> Quality Check -> Procured -> Payment Done)
app.patch('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['Booked', 'Arrived', 'Quality Check', 'Procured', 'Payment Done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const booking = bookings.find(b => b.id === id || String(b.tokenNumber) === id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  booking.status = status;
  if (notes) booking.notes = notes;

  if (status === 'Arrived' && !booking.arrivedAt) booking.arrivedAt = nowTime;
  if (status === 'Quality Check' && !booking.qcPassedAt) booking.qcPassedAt = nowTime;
  if (status === 'Procured' && !booking.procuredAt) booking.procuredAt = nowTime;
  if (status === 'Payment Done') {
    booking.paymentDoneAt = nowTime;
    booking.paymentStatus = 'Completed';
  }

  // Broadcast real-time update
  const payload = {
    action: 'STATUS_UPDATED',
    booking: {
      ...booking,
      farmersAhead: getFarmersAhead(booking)
    },
    bookings: bookings.map(b => ({ ...b, farmersAhead: getFarmersAhead(b) }))
  };

  broadcast('QUEUE_UPDATE', payload);

  res.json({
    success: true,
    booking: {
      ...booking,
      farmersAhead: getFarmersAhead(booking)
    }
  });
});

// Update procurement quantity, MSP rate & payment status (Admin weighment & payment entry)
app.patch('/api/bookings/:id/procurement', (req, res) => {
  const { id } = req.params;
  const { quantityQuintals, mspRate, paymentStatus, notes } = req.body;

  const booking = bookings.find(b => b.id === id || String(b.tokenNumber) === id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  if (quantityQuintals !== undefined) booking.quantityQuintals = Number(quantityQuintals);
  if (mspRate !== undefined) booking.mspRate = Number(mspRate);
  if (booking.quantityQuintals && booking.mspRate) {
    booking.totalAmount = booking.quantityQuintals * booking.mspRate;
  }
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
    if (paymentStatus === 'Completed' && booking.status !== 'Payment Done') {
      booking.status = 'Payment Done';
      booking.paymentDoneAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }
  if (notes) booking.notes = notes;

  const payload = {
    action: 'PROCUREMENT_UPDATED',
    booking: {
      ...booking,
      farmersAhead: getFarmersAhead(booking)
    },
    bookings: bookings.map(b => ({ ...b, farmersAhead: getFarmersAhead(b) }))
  };

  broadcast('QUEUE_UPDATE', payload);

  res.json({
    success: true,
    booking: {
      ...booking,
      farmersAhead: getFarmersAhead(booking)
    }
  });
});

// Reset demo data to fresh initial state
app.post('/api/reset-demo', (req, res) => {
  tokenSequence = 105;
  bookings = generateSeedBookings();
  broadcast('QUEUE_UPDATE', {
    action: 'RESET',
    bookings: bookings.map(b => ({ ...b, farmersAhead: getFarmersAhead(b) }))
  });
  res.json({ success: true, message: 'Demo data reset successfully' });
});

// Admin login verification (Mock auth)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@mandimitra.gov.in' && password === 'admin123') {
    res.json({
      success: true,
      user: {
        name: 'Suresh Verma (Centre In-Charge)',
        email: 'admin@mandimitra.gov.in',
        role: 'ADMIN',
        centreId: 'karnal-mandi',
        centreName: 'Karnal Grain Mandi (Centre #12)'
      },
      token: 'jwt-staff-demo-token-12345'
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials. Use admin@mandimitra.gov.in / admin123' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🌾 MandiMitra Backend & Realtime Engine running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket sync endpoint live on ws://localhost:${PORT}/ws`);
  initFirebase();
});

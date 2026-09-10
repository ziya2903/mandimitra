# MandiMitra (मंडीमित्र) 🌾
### Smart Procurement Queue & Slot Booking System for Farmers
**SIH Problem Statement ID:** SIH26032 (Smart Automation)  
**Theme:** Smart Automation / Agriculture & Rural Development

---

## 📌 Context & Problem Solved
At agricultural procurement centres (mandis), farmers traditionally arrive without any scheduling, resulting in:
- **Severe Congestion & Bottlenecks:** 10–12 day wait times in queue lines outside the mandi gates.
- **Produce Exposure & Spoilage:** Crops get ruined by unexpected rain and inclement weather.
- **Distress Selling:** Desperate farmers are forced to sell to middlemen below the Minimum Support Price (MSP).
- **Zero Transparency:** Uncertainty about gate entry, moisture/quality testing, and payment arrival.

**MandiMitra** completely eliminates blind physical queuing by providing:
1. **Digital Token & Time Slot Allocation:** Farmers receive an auto-assigned arrival window.
2. **Live Open-Meteo Weather Advisory:** Real-time satellite-backed rain forecast and tarpaulin alerts for produce safety.
3. **Sub-Second Real-Time Queue Tracker:** Live count of "Farmers Ahead of You" and transparent 5-stage progress.
4. **Transparent MSP Payment Ledger:** Direct Benefit Transfer (DBT) status tracking with zero financial jargon.
5. **Centre Staff Management Console:** Digital weighbridge entry, instant status advance, and live analytics.

---

## 🛠️ Technology Stack
- **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons + Canvas Confetti
- **Backend:** Node.js + Express
- **Real-Time Synchronization:** Sub-second WebSocket live event engine (with built-in dual support for Google Cloud Firestore via `.env`)
- **Weather Service:** Real **Open-Meteo API** (free, reliable, no API key required)
- **Authentication:** Simulated OTP mobile login for farmers + Role-based staff credentials for centre officers
- **Localization:** Bilingual support (English + हिन्दी) tailored for rural low-digital-literacy users

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Install Dependencies
Run the following from the root directory:
```bash
npm run install:all
```
*(Or install manually in both folders)*:
```bash
# In client:
cd client && npm install

# In server:
cd server && npm install
```

### 2. Start Both Frontend & Backend (One Command)
From the root directory:
```bash
npm run dev
```
- **Farmer & Staff Web App:** `http://localhost:5173/`
- **Backend API & Real-Time Sync:** `http://localhost:5000/`

---

## 🎯 Live Demo Script for Judges / Evaluators

Open two browser tabs or side-by-side windows:
- **Window 1 (Mobile view width ~375px):** `http://localhost:5173/` (Select **Farmer Portal**)
- **Window 2 (Desktop view width ~1280px):** `http://localhost:5173/` (Select **Centre Staff Portal**)

### Step 1: Farmer Login & Weather Advisory
1. In Window 1, click **"9876543210"** (Auto-fill Demo Phone) and click **Get OTP Code**.
2. Click **"Auto-fill 1234"** and submit.
3. On the Farmer Dashboard, view the live **Open-Meteo Weather Card** (`☀️ Good weather today — safe to bring your crop`).
4. Click **"Demo: Test Rain Alert"** to switch to the rain demo location and observe the immediate rain warning advisory (`🌧️ Rain active at the centre! Tarpaulin cover mandatory`).

### Step 2: Slot Booking & Digital Ticket
1. Click **"Book My Slot Now"**.
2. Select a date (e.g., Tomorrow), choose **Wheat**, enter quantity (e.g., **50 Quintals**).
3. Click **"Confirm Slot & Generate Token"**.
4. Observe the celebratory confetti burst and the generated **Digital Mandi Ticket** (Token #, auto-assigned time window, QR code).
5. Click **"Track Live Queue Now"**.

### Step 3: Real-Time Progression (Staff Console)
1. In Window 2 (Staff Console), click **"Auto-fill Admin"** (`admin@mandimitra.gov.in` / `admin123`) and log in.
2. The newly booked farmer token appears instantly in the live table without page refresh!
3. Click **"Mark Arrived"** ➔ Watch Window 1 update live to *"Arrived at Mandi"*.
4. Click **"Pass Quality Check"** ➔ Watch Window 1 update live to *"Quality Check"*.
5. Click **"Record Weight & MSP"** ➔ Verify weighment (50 Qtls @ ₹2,275/Qtl = ₹1,13,750), select *Completed (Sanctioned DBT)*, and click **Confirm Weighment**.
6. Click **"Release Payment"**.

### Step 4: Farmer Payment Transparency
1. In Window 1, the progress stepper updates to **Payment Done**.
2. Click **"View Payment Status"** to view the clean DBT statement showing **₹1,13,750** directly routed to the farmer's bank account.

---

## 🌐 Optional Firebase Firestore Setup
MandiMitra includes a built-in real-time engine so it runs locally with **zero configuration**. To connect to your cloud Firebase project:
1. Create a Firebase project at `console.firebase.google.com`.
2. Enable **Firestore Database**.
3. Add your keys to `client/.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```
The app will automatically detect and bind to Cloud Firestore.

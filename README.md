# ILOG-SHAKTI | Indian Army Predictive Forward Logistics & Supply Chain Platform

**Smart India Hackathon (SIH 2026)**  
**Problem Statement ID:** 26251  
**Organization:** Ministry of Defence (MoD)  
**Department:** Defence Services Staff College (DSSC)  
**Theme:** Transportation & Logistics  
**Category:** Software  

---

## 1. Operational Overview

Forward military formations deployed in high-altitude, glaciated, and operationally contentious environments (such as Northern Command XIV Corps across Ladakh, Siachen, DBO, and Kargil sectors) face severe supply disruptions caused by:

1. **Information Silos:** Disconnected streams between depot inventory, troop strength variations, and route weather forecasts.
2. **Extreme High-Altitude Consumption Spikes:** Sub-zero temperatures (-35°C to -50°C) increase caloric intake needs for Class I pack rations and cause exponential increases in Class III Arctic Fuel burn (bukhari space heaters, generator continuous runtimes, and anti-waxing agitators).
3. **Severe Choke Points:** Critical passes (Khardung La at 17,982 ft, Chang La at 17,688 ft, Zojila at 11,575 ft) are prone to sudden avalanche closures, requiring immediate dynamic multi-modal rerouting (diverting to ALH Dhruv / Mi-17 V5 air-bridges).
4. **Intermittent Border Connectivity:** Forward outposts operate in DDN/VSAT shadow zones, requiring resilient local queuing with zero-data-loss tactical mesh reconciliation upon carrier restoration.

**ILOG-SHAKTI** is an integrated tactical logistics command platform that unifies real-time predictive demand modeling, vector GIS terrain surveillance, IoT cold-chain tracking, payload envelope optimization, and IAF-Z military requisition workflows.

---

## 2. Key Architectural Modules

### Module 01: Tactical GIS Terrain & Strategic Axes
- Vector topographical command map rendered with military grid coordinates (MGRS 43S EU sector).
- Monitored nodes: 14 Corps FSD Leh, Siachen Post 114, DBO Post & ALG (SSN Sector), Galwan KM-120, Chushul Garrison, and Dras Tololing Node.
- Interactive Mountain Pass Incident Simulator: Toggle real-time avalanche/blizzard blockages at Khardung La, Chang La, or Zojila to test automated convoy holds and multi-modal air-bridge triggers.
- Live convoy tracking drawer displaying speed, GPS positions, axle strain, and driver call-signs.

### Module 02: AI/ML Predictive Demand & Burndown Engine
- Non-linear thermal consumption modeling comparing Traditional Moving Averages against Multi-Factor High-Altitude Regression.
- Dynamic stress-testing sliders:
  - Sub-zero temperature drop (-5°C down to -45°C)
  - Rapid troop reinforcement surge (+0% to +50%)
  - Pass clearance delay (+0h to +96h)
- Days of Supply (DOS) burndown curves with automated early-warning countdowns for imminent stockouts.

### Module 03: Forward Post Stock Registers & IoT Telemetry
- Comprehensive Class I to Class V supply ledger conforming to Army Service Corps (ASC) and Army Ordnance Corps (AOC) classifications.
- Live IoT sensor telemetry streams:
  - Arctic Diesel fuel bladder heating core temperatures and anti-waxing agitator cycles.
  - Stirling cryo-cooler chambers for medical freeze-dried blood plasma (-22°C to -4°C).
  - Ammunition underground magazine relative humidity (RH %) and fuze integrity.

### Module 04: Multi-Modal Fleet & Cargo Load Optimizer
- Vehicle platform selector:
  - Ashok Leyland 4x4 (ALS 2.5T)
  - Ashok Leyland 6x6 Stallion (5T)
  - Hägglunds Bv-206 All-Terrain Tracked Snowcat (2T)
  - IAF Mi-17 V5 Tactical Airlift (4T)
- Dynamic High-Altitude Engine De-rating: Accounts for combustion air density loss above 3,500m MSL, preventing dangerous overloads on mountain passes.
- Interactive drag/increment manifest builder with gross vehicle weight (GVW) validation.

### Module 05: Requisition Indent & Consignment (IAF-Z-2096 Spec)
- Formal military requisition form capturing Unit, Formation, Priority (Operational Immediate, Priority, Routine), Officer Service Number, and operational justification.
- Tactical Offline Mesh Sync: Forward posts disconnected from HQ can generate cryptographically signed vouchers stored locally; a single-click reconciliation transmits the batch once VSAT carrier is restored.
- Printable tactical dispatch slip with verification QR codes and SHA-256 hashes.

---

## 3. Technology Stack

- **Frontend Core:** React 18 with TypeScript 5 (Strict Mode, zero unused parameters)
- **Bundler & Build Tool:** Vite 6
- **Styling Architecture:** Tailwind CSS 3 with custom utilitarian military tactical palette (`drab`, `steel`, `khaki`, and muted tactical indicators)
- **Vector Graphics & UI Elements:** Lucide Tactical Icons & Custom SVG Tactical Grid Terrain
- **State Management:** Reactive local state with offline-first mesh persistence pattern

---

## 4. Local Setup & Execution

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/indian-army-predictive-logistics.git

# Enter project directory
cd indian-army-predictive-logistics

# Install production and development dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production
```bash
npm run build
```
This generates an optimized, minified bundle in the `dist/` directory verified with strict TypeScript compilation.

---

## 5. Security & Operational Doctrine Compliance

- Strict adherence to official military supply classifications (Class I Rations, Class II Clothing/Camp, Class III POL, Class IV Defence Works, Class V Ammunition).
- Designed for low-bandwidth environments with zero external runtime dependencies on proprietary cloud fonts or analytics trackers.
- Military color palette adheres to low-fatigue night/combat command operations.

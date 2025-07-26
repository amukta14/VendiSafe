# VendiSafe – Smart Vendor Zoning Platform

**A civic technology platform for street vendor compliance and hygiene monitoring in Delhi**

VendiSafe addresses core challenges in urban governance by digitizing street vendor zoning, enabling real-time hygiene reporting, and offering visibility into legal status and vendor accountability. It supports both the public and municipal authorities in creating a transparent, efficient, and compliant vendor ecosystem.

---

## Problem Statement

- **Unregulated vending zones**: A significant percentage of vendors operate in restricted or illegal zones  
- **Lack of hygiene data**: No centralized mechanism for citizens to report or view hygiene violations  
- **Ineffective policy enforcement**: Municipal implementation of the Street Vendors Act remains inconsistent  
- **Public health and safety risks**: Citizens have no access to trusted vendor information

---

## Key Features

### Live Zone Mapping  
- Real-time interactive map of Delhi  
- Visual overlays for legal and illegal vending areas  
- 247+ vendors tracked with geo-tagged locations  
- 12 designated zones with capacity indicators

### Hygiene Heatmap  
- Public reporting system for hygiene issues  
- Severity-based classification (Critical, High, Medium, Low)  
- Dynamic visual heatmaps highlighting complaint density

### Vendor Dashboard  
- Phone-based lookup for vendor details  
- License status and compliance info  
- Hygiene scores and inspection history  
- Eviction risk alerts based on zone legality

### Admin Portal  
- Zone creation and management interface  
- Report triage and resolution workflows  
- Vendor tracking and compliance analytics  
- Real-time database updates

---

## Tech Stack

- **Frontend**: React, Leaflet.js  
- **Backend**: Base44 platform with live sync capabilities  
- **Database**: Structured entity schema with GeoJSON support  
- **Mapping**: OpenStreetMap with zone overlays  
- **Styling**: Tailwind CSS with an accessible civic design system

---

## Impact Overview

- 247 vendors actively registered and updated  
- 12 zones mapped across different areas in Delhi  
- Citizens enabled to report hygiene violations with photos and descriptions  
- Seamless experience across mobile and desktop  
- System aligned with the Street Vendors Act for real-world deployment

---

## Demo Flow

1. **Zone Map** – Explore legal vs. illegal vending zones  
2. **Vendor Lookup** – Enter phone number to view vendor status  
3. **Hygiene Reporting** – Citizens submit and track issue reports  
4. **Admin Controls** – Authorities manage zones and address reports  
5. **Mobile Optimization** – All features accessible on any device

---

## Project Structure

- `/src/components` – React UI components (Map, Dashboard, Cards)  
- `/src/entities` – Data models for Vendor, Zone, and Reports  
- `/src/pages` – Core routing and layout views  
- `/public` – Static assets, zone overlays, and map tiles  
- `.env.example` – Example configuration file for environment setup

---

## Getting Started

To run the platform locally:

```bash
git clone https://github.com/your-org/vendisafe.git
cd vendisafe
npm install
npm run dev

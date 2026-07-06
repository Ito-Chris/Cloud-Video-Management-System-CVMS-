# Cloud VMS (Video Management System)
# Cloud Video Management System (CVMS)
A cloud-based video management system for CCTV monitoring featuring real-time analytics, IoT integration, and intelligent threat detection.
A comprehensive cloud-based video management system for law enforcement featuring real-time analytics, IoT integration, and intelligent threat detection.
## Features
### Core Features
- Real-time AI-powered Video Analytics
  - Facial recognition for suspect identification
  - Facial recognition with gender and age detection
  - Automatic Number Plate Recognition (ANPR)
  - Behavior detection (loitering, suspicious movements)
  - Gender demographics analysis
  
  - Behavior detection and analysis
### IoT Integration
- Smart Traffic Management
  - Adaptive signal control
  - Emergency vehicle priority system
- Environmental Monitoring
  - Air quality monitoring
  - Air quality sensors
  - Real-time sensor data analysis
### Security Features
-0
+6
- End-to-end encryption
- Chain of custody tracking
- Tamper-proof storage
### Dashboard Features
- Real-time camera grid view
- Analytics dashboard with gender distribution
- Real-time alert feed
- Incident tracking
## Tech Stack
- Frontend: React + TypeScript
-1
+4
   ```bash
   npm install
   ```
3. Set up environment variables (see .env.example)
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure required environment variables
4. Start the development server:
   ```bash
   npm run dev
-6
+20
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utility functions
├── server/           # Backend Express application
│   ├── routes.ts
│   └── storage.ts
│   ├── routes.ts     # API routes
│   └── storage.ts    # Database operations
└── shared/           # Shared types and schemas
    └── schema.ts
    └── schema.ts     # Database schema and types
```
## Database Schema
- **cameras**: CCTV camera information and status
- **events**: Detection events and analytics data
- **incidents**: Security incidents and responses
- **officers**: Law enforcement personnel data
- **evidence**: Digital evidence management
- **trafficLights**: Smart traffic control system
- **environmentalSensors**: IoT sensor data
## Environment Variables
See `.env.example` for required environment variables.
## License
MIT

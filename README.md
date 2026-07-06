# Cloud Video Management System (CVMS)

A comprehensive cloud-based video management system for law enforcement featuring real-time analytics, IoT integration, and intelligent threat detection.

![CVMS Dashboard](screenshots/dashboard.png)

## Overview

CVMS is a state-of-the-art video management system designed for law enforcement agencies, offering advanced surveillance capabilities, real-time analytics, and IoT integration. The system provides a unified platform for monitoring multiple camera feeds, analyzing video content in real-time, and managing security incidents efficiently.

## Key Features

### Real-time AI-powered Video Analytics
- 🎯 Facial recognition with gender and age detection
- 🚗 Automatic Number Plate Recognition (ANPR)
- 👥 Behavior detection and analysis
- 📊 Real-time gender demographics tracking

### Smart Traffic Management
- 🚦 Adaptive signal control based on traffic conditions
- 🚨 Emergency vehicle priority system
- 📈 Traffic flow analysis and optimization
- ⚡ Real-time congestion monitoring

### Environmental Monitoring
- 🌡️ Air quality sensors integration
- 📊 Real-time environmental data analysis
- ⚠️ Pollution threshold alerts
- 🌍 Environmental impact tracking

### Secure Digital Evidence Management
- 🔒 Encrypted cloud storage
- 📝 Tamper-proof video footage
- ⛓️ Chain of custody tracking
- 📋 Automated case file generation

### Command Center Dashboard
- 📺 Real-time camera grid view
- 📊 Analytics dashboard with gender distribution
- 🚨 Real-time alert feed
- 🎯 Incident tracking and management

## Technology Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Recharts for data visualization
- shadcn/ui for UI components
- Tailwind CSS for styling

### Backend
- Express.js server
- WebSocket for real-time updates
- PostgreSQL database with Drizzle ORM
- Real-time data processing

### Security
- End-to-end encryption
- JWT authentication
- Role-based access control
- Secure WebSocket connections

## Getting Started

### Prerequisites
- Node.js (v20 or later)
- PostgreSQL database
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/cvms.git
cd cvms
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utility functions
├── server/           # Backend Express application
│   ├── routes.ts     # API routes
│   ├── storage.ts    # Database operations
│   └── db.ts        # Database configuration
└── shared/           # Shared types and schemas
    └── schema.ts     # Database schema and types
```

## Database Schema

### Core Tables
- **cameras**: CCTV camera information and status
- **events**: Detection events and analytics data
- **incidents**: Security incidents and responses
- **officers**: Law enforcement personnel data
- **evidence**: Digital evidence management

### IoT Integration Tables
- **trafficLights**: Smart traffic control system
- **environmentalSensors**: IoT sensor data

## API Documentation

### WebSocket Events
- `event`: Real-time detection events
- `incident`: Security incident notifications
- `iot_update`: IoT sensor data updates

### REST Endpoints
- `/api/cameras`: Camera management
- `/api/events`: Event tracking
- `/api/incidents`: Incident management
- `/api/traffic-lights`: Traffic control
- `/api/environmental-sensors`: Environmental monitoring

## Environment Variables

See `.env.example` for a complete list of required environment variables.

## Security Considerations

- All API endpoints are secured with JWT authentication
- WebSocket connections use secure protocols
- Database credentials are properly encrypted
- Evidence data maintains chain of custody

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- shadcn/ui for the beautiful UI components
- Drizzle ORM for database management
- TanStack Query for efficient data fetching
- React and TypeScript communities

## Support

For support, please open an issue in the GitHub repository or contact the ISMS K9 Development team.

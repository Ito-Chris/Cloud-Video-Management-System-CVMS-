import type {
  Camera,
  DetectionEvent,
  Incident,
  Officer,
  Evidence,
  TrafficLight,
  EnvironmentalSensor,
  DashboardStats,
  AnalyticsData,
} from "../shared/schema.js";

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const cameras: Camera[] = [
  { id: 1, name: "CAM-001", location: "Main Entrance", status: "online", type: "fixed", ipAddress: "192.168.1.101", lat: 51.505, lng: -0.09, createdAt: "2024-01-15T08:00:00Z" },
  { id: 2, name: "CAM-002", location: "Parking Lot A", status: "online", type: "ptz", ipAddress: "192.168.1.102", lat: 51.506, lng: -0.088, createdAt: "2024-01-15T08:00:00Z" },
  { id: 3, name: "CAM-003", location: "North Perimeter", status: "offline", type: "fixed", ipAddress: "192.168.1.103", lat: 51.507, lng: -0.091, createdAt: "2024-01-15T08:00:00Z" },
  { id: 4, name: "CAM-004", location: "South Gate", status: "online", type: "anpr", ipAddress: "192.168.1.104", lat: 51.504, lng: -0.089, createdAt: "2024-01-15T08:00:00Z" },
  { id: 5, name: "CAM-005", location: "Control Room", status: "online", type: "fixed", ipAddress: "192.168.1.105", lat: 51.505, lng: -0.093, createdAt: "2024-01-15T08:00:00Z" },
  { id: 6, name: "CAM-006", location: "East Corridor", status: "maintenance", type: "fixed", ipAddress: "192.168.1.106", lat: 51.506, lng: -0.086, createdAt: "2024-01-15T08:00:00Z" },
  { id: 7, name: "CAM-007", location: "West Wing", status: "online", type: "thermal", ipAddress: "192.168.1.107", lat: 51.505, lng: -0.094, createdAt: "2024-01-15T08:00:00Z" },
  { id: 8, name: "CAM-008", location: "Rooftop", status: "online", type: "ptz", ipAddress: "192.168.1.108", lat: 51.508, lng: -0.09, createdAt: "2024-01-15T08:00:00Z" },
  { id: 9, name: "CAM-009", location: "Loading Bay", status: "online", type: "fixed", ipAddress: "192.168.1.109", lat: 51.503, lng: -0.088, createdAt: "2024-01-15T08:00:00Z" },
];

export let events: DetectionEvent[] = [
  { id: 1, cameraId: 1, cameraName: "Main Entrance", type: "facial_recognition", severity: "high", description: "Suspect match: John Doe (warrant outstanding)", metadata: { confidence: 94.2, age: 34, gender: "male" }, timestamp: new Date(Date.now() - 2 * 60000).toISOString(), resolved: false },
  { id: 2, cameraId: 4, cameraName: "South Gate", type: "anpr", severity: "critical", description: "Stolen vehicle detected: AB12 XYZ", metadata: { plate: "AB12 XYZ", make: "Ford", model: "Focus", color: "Black" }, timestamp: new Date(Date.now() - 5 * 60000).toISOString(), resolved: false },
  { id: 3, cameraId: 2, cameraName: "Parking Lot A", type: "behavior", severity: "medium", description: "Loitering detected — individual stationary >15 min", metadata: { duration: 920, confidence: 87.1 }, timestamp: new Date(Date.now() - 12 * 60000).toISOString(), resolved: false },
  { id: 4, cameraId: 7, cameraName: "West Wing", type: "intrusion", severity: "critical", description: "Perimeter breach detected in restricted zone", metadata: { zone: "Z-4", confidence: 98.0 }, timestamp: new Date(Date.now() - 18 * 60000).toISOString(), resolved: true },
  { id: 5, cameraId: 1, cameraName: "Main Entrance", type: "facial_recognition", severity: "low", description: "Gender/age analytics: Female, ~28 years", metadata: { confidence: 91.5, age: 28, gender: "female" }, timestamp: new Date(Date.now() - 25 * 60000).toISOString(), resolved: true },
  { id: 6, cameraId: 9, cameraName: "Loading Bay", type: "behavior", severity: "high", description: "Aggressive behaviour detected near vehicle", metadata: { confidence: 82.3 }, timestamp: new Date(Date.now() - 35 * 60000).toISOString(), resolved: false },
  { id: 7, cameraId: 4, cameraName: "South Gate", type: "anpr", severity: "low", description: "Vehicle entry logged: GH34 KLM", metadata: { plate: "GH34 KLM", make: "Toyota", model: "Corolla", color: "White" }, timestamp: new Date(Date.now() - 42 * 60000).toISOString(), resolved: true },
  { id: 8, cameraId: 5, cameraName: "Control Room", type: "facial_recognition", severity: "medium", description: "Unrecognised individual in restricted area", metadata: { confidence: 88.9, age: 45, gender: "male" }, timestamp: new Date(Date.now() - 55 * 60000).toISOString(), resolved: false },
  { id: 9, cameraId: 2, cameraName: "Parking Lot A", type: "anpr", severity: "medium", description: "Vehicle with expired registration: QR56 STU", metadata: { plate: "QR56 STU" }, timestamp: new Date(Date.now() - 68 * 60000).toISOString(), resolved: true },
  { id: 10, cameraId: 8, cameraName: "Rooftop", type: "behavior", severity: "low", description: "Crowd density increase detected — 12 individuals", metadata: { count: 12, confidence: 79.4 }, timestamp: new Date(Date.now() - 80 * 60000).toISOString(), resolved: true },
];

export const officers: Officer[] = [
  { id: 1, name: "Det. Sarah Connor", badge: "PD-1042", rank: "Detective", department: "CID", status: "active", email: "s.connor@police.gov", phone: "+44 7700 900001" },
  { id: 2, name: "Sgt. Marcus Webb", badge: "PD-0871", rank: "Sergeant", department: "Patrol", status: "active", email: "m.webb@police.gov", phone: "+44 7700 900002" },
  { id: 3, name: "PC James Holt", badge: "PD-2233", rank: "Constable", department: "Patrol", status: "on-call", email: "j.holt@police.gov", phone: "+44 7700 900003" },
  { id: 4, name: "Insp. Fiona Nash", badge: "PD-0512", rank: "Inspector", department: "Operations", status: "active", email: "f.nash@police.gov", phone: "+44 7700 900004" },
  { id: 5, name: "PC David Reyes", badge: "PD-3301", rank: "Constable", department: "Traffic", status: "off-duty", email: "d.reyes@police.gov", phone: "+44 7700 900005" },
  { id: 6, name: "Sgt. Amara Singh", badge: "PD-0690", rank: "Sergeant", department: "CID", status: "active", email: "a.singh@police.gov", phone: "+44 7700 900006" },
];

export let incidents: Incident[] = [
  { id: 1, title: "Stolen Vehicle Pursuit — AB12 XYZ", description: "Stolen Ford Focus detected at South Gate. Officers dispatched for interception.", status: "investigating", priority: "critical", assignedOfficerId: 2, assignedOfficerName: "Sgt. Marcus Webb", cameraId: 4, location: "South Gate / High Street", createdAt: new Date(Date.now() - 10 * 60000).toISOString(), updatedAt: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: 2, title: "Perimeter Breach — West Wing Zone 4", description: "Thermal camera detected individual crossing restricted perimeter.", status: "open", priority: "high", assignedOfficerId: 1, assignedOfficerName: "Det. Sarah Connor", cameraId: 7, location: "West Wing, Zone 4", createdAt: new Date(Date.now() - 22 * 60000).toISOString(), updatedAt: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 3, title: "Suspect Identification — Wanted Individual", description: "Facial recognition matched individual with outstanding arrest warrant.", status: "investigating", priority: "high", assignedOfficerId: 6, assignedOfficerName: "Sgt. Amara Singh", cameraId: 1, location: "Main Entrance", createdAt: new Date(Date.now() - 7 * 60000).toISOString(), updatedAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 4, title: "Aggressive Behaviour — Loading Bay", description: "Camera detected altercation near delivery vehicles.", status: "open", priority: "high", assignedOfficerId: 3, assignedOfficerName: "PC James Holt", cameraId: 9, location: "Loading Bay", createdAt: new Date(Date.now() - 40 * 60000).toISOString(), updatedAt: new Date(Date.now() - 38 * 60000).toISOString() },
  { id: 5, title: "Unattended Package — Main Hall", description: "Suspicious package left unattended for >20 minutes. Bomb disposal notified.", status: "resolved", priority: "critical", location: "Main Hall", createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 6, title: "Loitering — Parking Lot A", description: "Individual loitering in parking area for extended period. No criminal activity confirmed.", status: "closed", priority: "low", assignedOfficerId: 5, assignedOfficerName: "PC David Reyes", cameraId: 2, location: "Parking Lot A", createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 4 * 3600000).toISOString() },
];

export const evidence: Evidence[] = [
  { id: 1, incidentId: 1, incidentTitle: "Stolen Vehicle Pursuit", type: "video", filename: "cam004_2024_07_06_08h22.mp4", description: "ANPR camera footage of stolen vehicle at South Gate", fileHash: "sha256:a3f5c9e1b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6", fileSize: "284 MB", custodyChain: [{ name: "System", action: "Auto-captured", timestamp: new Date(Date.now() - 10 * 60000).toISOString() }, { name: "Sgt. Marcus Webb", action: "Reviewed & sealed", timestamp: new Date(Date.now() - 5 * 60000).toISOString() }], uploadedAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 2, incidentId: 3, incidentTitle: "Suspect Identification", type: "image", filename: "facial_match_cam001_frame_4812.jpg", description: "High-confidence facial recognition match frame", fileHash: "sha256:b4d6e8f0a2c4d6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6", fileSize: "2.1 MB", custodyChain: [{ name: "CVMS AI Engine", action: "Auto-flagged", timestamp: new Date(Date.now() - 7 * 60000).toISOString() }, { name: "Det. Sarah Connor", action: "Verified", timestamp: new Date(Date.now() - 4 * 60000).toISOString() }], uploadedAt: new Date(Date.now() - 7 * 60000).toISOString() },
  { id: 3, incidentId: 2, incidentTitle: "Perimeter Breach", type: "video", filename: "cam007_thermal_breach_zone4.mp4", description: "Thermal camera recording of perimeter breach", fileHash: "sha256:c5e7f1b3d5e7f1b3d5e7f1b3d5e7f1b3d5e7f1b3d5e7f1b3d5e7f1b3d5e7f1b3", fileSize: "156 MB", custodyChain: [{ name: "System", action: "Auto-captured", timestamp: new Date(Date.now() - 22 * 60000).toISOString() }], uploadedAt: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: 4, incidentId: 5, incidentTitle: "Unattended Package", type: "document", filename: "bomb_disposal_report_INC005.pdf", description: "Official bomb disposal clearance report", fileHash: "sha256:d6f8a0b2c4d6f8a0b2c4d6f8a0b2c4d6f8a0b2c4d6f8a0b2c4d6f8a0b2c4d6f8", fileSize: "340 KB", custodyChain: [{ name: "Insp. Fiona Nash", action: "Uploaded", timestamp: new Date(Date.now() - 2 * 3600000).toISOString() }], uploadedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];

export let trafficLights: TrafficLight[] = [
  { id: 1, location: "High St / Main Rd Junction", intersectionId: "INT-001", status: "green", cycleTime: 45, mode: "adaptive", vehicleCount: 23, lat: 51.505, lng: -0.092, lastUpdated: new Date().toISOString() },
  { id: 2, location: "Station Rd / Park Ave", intersectionId: "INT-002", status: "red", cycleTime: 60, mode: "normal", vehicleCount: 8, lat: 51.507, lng: -0.087, lastUpdated: new Date().toISOString() },
  { id: 3, location: "Victoria St / Queen's Way", intersectionId: "INT-003", status: "emergency", cycleTime: 0, mode: "emergency", vehicleCount: 45, lat: 51.503, lng: -0.094, lastUpdated: new Date().toISOString() },
  { id: 4, location: "Bridge Rd / River Lane", intersectionId: "INT-004", status: "yellow", cycleTime: 30, mode: "adaptive", vehicleCount: 12, lat: 51.509, lng: -0.085, lastUpdated: new Date().toISOString() },
  { id: 5, location: "North Ring Rd / Industrial Ave", intersectionId: "INT-005", status: "green", cycleTime: 55, mode: "normal", vehicleCount: 31, lat: 51.511, lng: -0.091, lastUpdated: new Date().toISOString() },
  { id: 6, location: "Central Sq / Market St", intersectionId: "INT-006", status: "red", cycleTime: 40, mode: "adaptive", vehicleCount: 19, lat: 51.504, lng: -0.088, lastUpdated: new Date().toISOString() },
];

export let sensors: EnvironmentalSensor[] = [
  { id: 1, name: "AQS-North", location: "North District", type: "air_quality", value: 42, unit: "AQI", status: "normal", aqi: 42, lastUpdated: new Date().toISOString() },
  { id: 2, name: "AQS-South", location: "South District", type: "air_quality", value: 87, unit: "AQI", status: "warning", aqi: 87, lastUpdated: new Date().toISOString() },
  { id: 3, name: "AQS-Central", location: "City Centre", type: "air_quality", value: 156, unit: "AQI", status: "critical", aqi: 156, lastUpdated: new Date().toISOString() },
  { id: 4, name: "TEMP-HQ", location: "HQ Building", type: "temperature", value: 22.4, unit: "°C", status: "normal", lastUpdated: new Date().toISOString() },
  { id: 5, name: "HUM-HQ", location: "HQ Building", type: "humidity", value: 65, unit: "%", status: "warning", lastUpdated: new Date().toISOString() },
  { id: 6, name: "NOISE-Market", location: "Market Street", type: "noise", value: 78, unit: "dB", status: "warning", lastUpdated: new Date().toISOString() },
  { id: 7, name: "NOISE-Residential", location: "Elm Street", type: "noise", value: 48, unit: "dB", status: "normal", lastUpdated: new Date().toISOString() },
  { id: 8, name: "TEMP-Depot", location: "Evidence Depot", type: "temperature", value: 18.1, unit: "°C", status: "normal", lastUpdated: new Date().toISOString() },
];

// ─── Stats & Analytics ────────────────────────────────────────────────────────

export function getDashboardStats(): DashboardStats {
  return {
    totalCameras: cameras.length,
    onlineCameras: cameras.filter((c) => c.status === "online").length,
    activeIncidents: incidents.filter((i) => i.status === "open" || i.status === "investigating").length,
    todayEvents: events.length,
    activeOfficers: officers.filter((o) => o.status === "active").length,
    criticalAlerts: events.filter((e) => e.severity === "critical" && !e.resolved).length,
  };
}

export function getAnalytics(): AnalyticsData {
  return {
    eventsByType: [
      { type: "Facial Recognition", count: 38 },
      { type: "ANPR", count: 52 },
      { type: "Behaviour", count: 29 },
      { type: "Intrusion", count: 14 },
      { type: "Environmental", count: 8 },
    ],
    eventsBySeverity: [
      { severity: "Critical", count: 12 },
      { severity: "High", count: 27 },
      { severity: "Medium", count: 44 },
      { severity: "Low", count: 58 },
    ],
    eventsOverTime: [
      { hour: "00:00", count: 4 }, { hour: "02:00", count: 2 }, { hour: "04:00", count: 1 },
      { hour: "06:00", count: 8 }, { hour: "08:00", count: 21 }, { hour: "10:00", count: 34 },
      { hour: "12:00", count: 28 }, { hour: "14:00", count: 31 }, { hour: "16:00", count: 38 },
      { hour: "18:00", count: 44 }, { hour: "20:00", count: 19 }, { hour: "22:00", count: 11 },
    ],
    genderDemographics: [
      { gender: "Male", count: 284, percentage: 62 },
      { gender: "Female", count: 162, percentage: 35 },
      { gender: "Unknown", count: 14, percentage: 3 },
    ],
    topLocations: [
      { location: "Main Entrance", events: 48 },
      { location: "South Gate", events: 41 },
      { location: "Parking Lot A", events: 33 },
      { location: "West Wing", events: 22 },
      { location: "Loading Bay", events: 18 },
    ],
    anprData: [
      { plate: "AB12 XYZ", time: new Date(Date.now() - 5 * 60000).toISOString(), location: "South Gate", flagged: true },
      { plate: "GH34 KLM", time: new Date(Date.now() - 42 * 60000).toISOString(), location: "South Gate", flagged: false },
      { plate: "QR56 STU", time: new Date(Date.now() - 68 * 60000).toISOString(), location: "South Gate", flagged: false },
      { plate: "MN78 PQR", time: new Date(Date.now() - 90 * 60000).toISOString(), location: "Parking Lot A", flagged: false },
      { plate: "VW90 BCD", time: new Date(Date.now() - 110 * 60000).toISOString(), location: "South Gate", flagged: true },
      { plate: "EF01 GHI", time: new Date(Date.now() - 135 * 60000).toISOString(), location: "Parking Lot A", flagged: false },
    ],
  };
}

// ─── Mutation helpers ─────────────────────────────────────────────────────────

let nextEventId = events.length + 1;
let nextIncidentId = incidents.length + 1;

export function addEvent(ev: Omit<DetectionEvent, "id">): DetectionEvent {
  const event = { ...ev, id: nextEventId++ };
  events = [event, ...events];
  return event;
}

export function resolveEvent(id: number): boolean {
  const ev = events.find((e) => e.id === id);
  if (!ev) return false;
  ev.resolved = true;
  return true;
}

export function createIncident(data: Omit<Incident, "id" | "createdAt" | "updatedAt">): Incident {
  const now = new Date().toISOString();
  const incident = { ...data, id: nextIncidentId++, createdAt: now, updatedAt: now };
  incidents = [incident, ...incidents];
  return incident;
}

export function updateIncidentStatus(id: number, status: Incident["status"]): boolean {
  const inc = incidents.find((i) => i.id === id);
  if (!inc) return false;
  inc.status = status;
  inc.updatedAt = new Date().toISOString();
  return true;
}

// Simulate live data changes
export function simulateLiveUpdates(): void {
  setInterval(() => {
    // Randomly update traffic light statuses
    const colors = ["green", "yellow", "red"] as const;
    trafficLights.forEach((tl) => {
      if (tl.mode !== "emergency" && Math.random() < 0.3) {
        tl.status = colors[Math.floor(Math.random() * colors.length)];
        tl.vehicleCount = Math.max(0, tl.vehicleCount + Math.floor(Math.random() * 7) - 3);
        tl.lastUpdated = new Date().toISOString();
      }
    });

    // Randomly update sensor values
    sensors.forEach((s) => {
      const delta = (Math.random() - 0.5) * 4;
      s.value = parseFloat((s.value + delta).toFixed(1));
      if (s.type === "air_quality") {
        s.aqi = Math.round(s.value);
        s.status = s.value < 50 ? "normal" : s.value < 100 ? "warning" : "critical";
      } else if (s.type === "noise") {
        s.status = s.value < 60 ? "normal" : s.value < 75 ? "warning" : "critical";
      }
      s.lastUpdated = new Date().toISOString();
    });
  }, 5000);
}

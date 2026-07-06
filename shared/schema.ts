export type CameraStatus = "online" | "offline" | "maintenance";
export type CameraType = "fixed" | "ptz" | "thermal" | "anpr";

export interface Camera {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
  type: CameraType;
  ipAddress: string;
  lat: number;
  lng: number;
  streamUrl?: string;
  createdAt: string;
}

export type EventType =
  | "facial_recognition"
  | "anpr"
  | "behavior"
  | "environmental"
  | "traffic"
  | "intrusion";
export type Severity = "low" | "medium" | "high" | "critical";

export interface DetectionEvent {
  id: number;
  cameraId: number;
  cameraName: string;
  type: EventType;
  severity: Severity;
  description: string;
  metadata: Record<string, unknown>;
  timestamp: string;
  resolved: boolean;
}

export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "critical";

export interface Incident {
  id: number;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: Priority;
  assignedOfficerId?: number;
  assignedOfficerName?: string;
  cameraId?: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type OfficerStatus = "active" | "off-duty" | "on-call";

export interface Officer {
  id: number;
  name: string;
  badge: string;
  rank: string;
  department: string;
  status: OfficerStatus;
  email: string;
  phone: string;
}

export type EvidenceType = "video" | "image" | "document" | "audio";

export interface Evidence {
  id: number;
  incidentId: number;
  incidentTitle: string;
  type: EvidenceType;
  filename: string;
  description: string;
  fileHash: string;
  fileSize: string;
  custodyChain: { name: string; action: string; timestamp: string }[];
  uploadedAt: string;
}

export type TrafficMode = "normal" | "adaptive" | "emergency";
export type SignalColor = "green" | "yellow" | "red" | "emergency";

export interface TrafficLight {
  id: number;
  location: string;
  intersectionId: string;
  status: SignalColor;
  cycleTime: number;
  mode: TrafficMode;
  vehicleCount: number;
  lat: number;
  lng: number;
  lastUpdated: string;
}

export type SensorStatus = "normal" | "warning" | "critical";
export type SensorType = "air_quality" | "temperature" | "humidity" | "noise";

export interface EnvironmentalSensor {
  id: number;
  name: string;
  location: string;
  type: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
  aqi?: number;
  lastUpdated: string;
}

export interface DashboardStats {
  totalCameras: number;
  onlineCameras: number;
  activeIncidents: number;
  todayEvents: number;
  activeOfficers: number;
  criticalAlerts: number;
}

export interface AnalyticsData {
  eventsByType: { type: string; count: number }[];
  eventsBySeverity: { severity: string; count: number }[];
  eventsOverTime: { hour: string; count: number }[];
  genderDemographics: { gender: string; count: number; percentage: number }[];
  topLocations: { location: string; events: number }[];
  anprData: { plate: string; time: string; location: string; flagged: boolean }[];
}

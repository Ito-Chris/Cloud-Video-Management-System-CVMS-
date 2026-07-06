import { Router } from "express";
import {
  cameras,
  events,
  officers,
  incidents,
  evidence,
  trafficLights,
  sensors,
  getDashboardStats,
  getAnalytics,
  resolveEvent,
  createIncident,
  updateIncidentStatus,
} from "./storage.js";

const router = Router();

// Dashboard
router.get("/stats", (_req, res) => res.json(getDashboardStats()));
router.get("/analytics", (_req, res) => res.json(getAnalytics()));

// Cameras
router.get("/cameras", (_req, res) => res.json(cameras));
router.get("/cameras/:id", (req, res) => {
  const cam = cameras.find((c) => c.id === Number(req.params.id));
  if (!cam) return res.status(404).json({ error: "Camera not found" });
  res.json(cam);
});

// Events / Alerts
router.get("/events", (req, res) => {
  const { resolved, severity, type } = req.query;
  let filtered = [...events];
  if (resolved !== undefined) filtered = filtered.filter((e) => e.resolved === (resolved === "true"));
  if (severity) filtered = filtered.filter((e) => e.severity === severity);
  if (type) filtered = filtered.filter((e) => e.type === type);
  res.json(filtered.slice(0, 50));
});
router.patch("/events/:id/resolve", (req, res) => {
  const ok = resolveEvent(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Event not found" });
  res.json({ success: true });
});

// Incidents
router.get("/incidents", (req, res) => {
  const { status, priority } = req.query;
  let filtered = [...incidents];
  if (status) filtered = filtered.filter((i) => i.status === status);
  if (priority) filtered = filtered.filter((i) => i.priority === priority);
  res.json(filtered);
});
router.get("/incidents/:id", (req, res) => {
  const inc = incidents.find((i) => i.id === Number(req.params.id));
  if (!inc) return res.status(404).json({ error: "Incident not found" });
  res.json(inc);
});
router.post("/incidents", (req, res) => {
  const inc = createIncident(req.body);
  res.status(201).json(inc);
});
router.patch("/incidents/:id/status", (req, res) => {
  const ok = updateIncidentStatus(Number(req.params.id), req.body.status);
  if (!ok) return res.status(404).json({ error: "Incident not found" });
  res.json({ success: true });
});

// Officers
router.get("/officers", (_req, res) => res.json(officers));
router.get("/officers/:id", (req, res) => {
  const off = officers.find((o) => o.id === Number(req.params.id));
  if (!off) return res.status(404).json({ error: "Officer not found" });
  res.json(off);
});

// Evidence
router.get("/evidence", (_req, res) => res.json(evidence));
router.get("/evidence/:incidentId", (req, res) => {
  res.json(evidence.filter((e) => e.incidentId === Number(req.params.incidentId)));
});

// Traffic lights
router.get("/traffic-lights", (_req, res) => res.json(trafficLights));
router.patch("/traffic-lights/:id/mode", (req, res) => {
  const tl = trafficLights.find((t) => t.id === Number(req.params.id));
  if (!tl) return res.status(404).json({ error: "Traffic light not found" });
  tl.mode = req.body.mode;
  if (req.body.mode === "emergency") tl.status = "emergency";
  tl.lastUpdated = new Date().toISOString();
  res.json(tl);
});

// Environmental sensors
router.get("/sensors", (_req, res) => res.json(sensors));

export default router;

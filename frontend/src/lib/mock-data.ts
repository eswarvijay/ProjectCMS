// Mock data for frontend demo - replace with actual API calls

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "agent";
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved";
  userId: string;
  userName: string;
  agentId?: string;
  agentName?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Message {
  id: string;
  complaintId: string;
  text: string;
  senderRole: "user" | "agent" | "admin";
  senderName: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  assignedCount: number;
  resolvedCount: number;
}

export interface AnalyticsData {
  totalComplaints: number;
  resolved: number;
  open: number;
  inProgress: number;
  avgResolutionTime: number;
  byCategory: { name: string; count: number }[];
  byPriority: { name: string; count: number }[];
  byStatus: { name: string; count: number }[];
  agentPerformance: { name: string; totalAssigned: number; resolved: number }[];
  weeklyTrend: { day: string; complaints: number; resolved: number }[];
}

export const mockComplaints: Complaint[] = [
  {
    id: "1",
    title: "Network connectivity issues in Building A",
    description: "Intermittent WiFi disconnections affecting the 3rd floor. Multiple employees unable to access cloud services during peak hours.",
    category: "IT Infrastructure",
    priority: "High",
    status: "In Progress",
    userId: "u1",
    userName: "Rahul Sharma",
    agentId: "a1",
    agentName: "Priya Patel",
    createdAt: "2026-02-10T09:30:00Z",
  },
  {
    id: "2",
    title: "Billing discrepancy on invoice #4521",
    description: "Customer charged twice for the same service. Refund needs to be processed urgently.",
    category: "Billing",
    priority: "Critical",
    status: "Open",
    userId: "u2",
    userName: "Anita Desai",
    createdAt: "2026-02-14T14:20:00Z",
  },
  {
    id: "3",
    title: "Software license expiration warning",
    description: "Adobe Creative Suite licenses for the design team expire in 5 days. Renewal approval needed.",
    category: "Software",
    priority: "Medium",
    status: "Resolved",
    userId: "u1",
    userName: "Rahul Sharma",
    agentId: "a2",
    agentName: "Vikram Singh",
    createdAt: "2026-02-08T11:00:00Z",
    resolvedAt: "2026-02-12T16:45:00Z",
  },
  {
    id: "4",
    title: "Air conditioning malfunction - Server Room",
    description: "Temperature in server room rising above safe threshold. HVAC system needs immediate repair.",
    category: "Facilities",
    priority: "Critical",
    status: "In Progress",
    userId: "u3",
    userName: "Meera Nair",
    agentId: "a1",
    agentName: "Priya Patel",
    createdAt: "2026-02-13T08:15:00Z",
  },
  {
    id: "5",
    title: "Employee onboarding access request",
    description: "New joinee needs access to Jira, Confluence, and Slack workspace by Monday.",
    category: "HR",
    priority: "Low",
    status: "Resolved",
    userId: "u4",
    userName: "Karthik Reddy",
    agentId: "a2",
    agentName: "Vikram Singh",
    createdAt: "2026-02-05T10:30:00Z",
    resolvedAt: "2026-02-06T09:00:00Z",
  },
];

export const mockAgents: Agent[] = [
  { id: "a1", name: "Priya Patel", email: "priya@company.com", assignedCount: 12, resolvedCount: 9 },
  { id: "a2", name: "Vikram Singh", email: "vikram@company.com", assignedCount: 8, resolvedCount: 7 },
  { id: "a3", name: "Sneha Gupta", email: "sneha@company.com", assignedCount: 5, resolvedCount: 5 },
];

export const mockMessages: Message[] = [
  { id: "m1", complaintId: "1", text: "I've escalated this to the network team. They'll check the access points.", senderRole: "agent", senderName: "Priya Patel", timestamp: "2026-02-10T10:00:00Z" },
  { id: "m2", complaintId: "1", text: "Thank you! It's affecting our entire floor's productivity.", senderRole: "user", senderName: "Rahul Sharma", timestamp: "2026-02-10T10:05:00Z" },
  { id: "m3", complaintId: "1", text: "Network team is on-site now. Should be resolved within 2 hours.", senderRole: "agent", senderName: "Priya Patel", timestamp: "2026-02-10T11:30:00Z" },
];

export const mockAnalytics: AnalyticsData = {
  totalComplaints: 47,
  resolved: 28,
  open: 11,
  inProgress: 8,
  avgResolutionTime: 4.2,
  byCategory: [
    { name: "IT Infrastructure", count: 15 },
    { name: "Billing", count: 8 },
    { name: "Software", count: 10 },
    { name: "Facilities", count: 7 },
    { name: "HR", count: 7 },
  ],
  byPriority: [
    { name: "Critical", count: 5 },
    { name: "High", count: 14 },
    { name: "Medium", count: 18 },
    { name: "Low", count: 10 },
  ],
  byStatus: [
    { name: "Open", count: 11 },
    { name: "In Progress", count: 8 },
    { name: "Resolved", count: 28 },
  ],
  agentPerformance: [
    { name: "Priya Patel", totalAssigned: 12, resolved: 9 },
    { name: "Vikram Singh", totalAssigned: 8, resolved: 7 },
    { name: "Sneha Gupta", totalAssigned: 5, resolved: 5 },
  ],
  weeklyTrend: [
    { day: "Mon", complaints: 8, resolved: 5 },
    { day: "Tue", complaints: 12, resolved: 7 },
    { day: "Wed", complaints: 6, resolved: 9 },
    { day: "Thu", complaints: 10, resolved: 6 },
    { day: "Fri", complaints: 7, resolved: 8 },
    { day: "Sat", complaints: 3, resolved: 4 },
    { day: "Sun", complaints: 1, resolved: 2 },
  ],
};

// Auth mock
export const mockAuth = {
  login: (email: string, password: string): { token: string; role: string; name: string } | null => {
    if (email === "admin@demo.com") return { token: "mock-token-admin", role: "admin", name: "Admin User" };
    if (email === "agent@demo.com") return { token: "mock-token-agent", role: "agent", name: "Priya Patel" };
    if (email && password) return { token: "mock-token-user", role: "user", name: "Rahul Sharma" };
    return null;
  },
};

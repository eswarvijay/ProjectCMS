import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";

import AppLayout from "@/components/AppLayout";
import KPICard from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";

import {
  getAdminAnalytics,
  getAdminComplaints,
} from "@/lib/complaint-api";
import { getAllAgents, assignAgent } from "@/lib/admin-api";

/* ================= CONFIG ================= */

const PRIORITY_COLORS: Record<string, string> = {
  High: "#3b82f6",
  Medium: "#f59e0b",
  Low: "#a855f7",
  Critical: "#10b981",
};

const tooltipStyle = {
  backgroundColor: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 8,
  fontSize: 12,
};

const axisTickStyle = { fill: "#64748b", fontSize: 11 };

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  const loadAll = async () => {
    const [analyticsData, complaintsData, agentsData] = await Promise.all([
      getAdminAnalytics(),
      getAdminComplaints(),
      getAllAgents(),
    ]);

    setAnalytics({
      totalComplaints: analyticsData.totalComplaints,

      resolved:
        analyticsData.byStatus.find((s: any) => s._id === "Resolved")?.count || 0,

      open:
        analyticsData.byStatus.find((s: any) => s._id === "Open")?.count || 0,

      avgResolutionTime: Number(
        analyticsData.avgResolutionTime.toFixed(1)
      ),

      byCategory: analyticsData.byCategory.map((c: any) => ({
        name: c._id,
        count: c.count,
      })),

      byPriority: analyticsData.byPriority.map((p: any) => ({
        name: p._id,
        value: p.count,
      })),

      agentPerformance: analyticsData.agentPerformance.map((a: any) => ({
        name: a._id,
        assigned: a.totalAssigned,
        resolved: a.resolved,
      })),

      // ✅ REAL WEEKLY DATA FROM MONGODB
      weeklyTrend: analyticsData.weeklyTrend,
    });

    setComplaints(complaintsData);
    setAgents(agentsData);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-10 text-muted-foreground">Loading…</div>
      </AppLayout>
    );
  }

  /* ================= RENDER ================= */

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of complaints & system analytics
          </p>
        </div>

        {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Complaints"
          value={analytics.totalComplaints}
          icon={<FileText className="h-5 w-5 text-info" />}
          gradient="--gradient-kpi-2"
          iconColor="bg-info/12"
          trend="+12% from last week"
        />
        <KPICard
          title="Resolved"
          value={analytics.resolved}
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
          gradient="--gradient-kpi-1"
          iconColor="bg-success/12"
          trend={`${((analytics.resolved / analytics.totalComplaints) * 100).toFixed(0)}% resolution rate`}
        />
        <KPICard
          title="Open"
          value={analytics.open}
          icon={<AlertCircle className="h-5 w-5 text-warning" />}
          gradient="--gradient-kpi-3"
          iconColor="bg-warning/12"
        />
        <KPICard
          title="Avg Resolution"
          value={`${analytics.avgResolutionTime}h`}
          icon={<Clock className="h-5 w-5 text-primary" />}
          gradient="--gradient-kpi-1"
          iconColor="bg-primary/12"
          trend="↓ 0.8h improvement"
        />
      </div>

        {/* WEEKLY + CATEGORY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="card p-5">
            <h3 className="text-xs uppercase mb-4 flex gap-2">
              <TrendingUp size={14} /> Weekly Trend
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#020617" />
                <XAxis dataKey="day" tick={axisTickStyle} />
                <YAxis tick={axisTickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="#3b82f6"
                  fill="#3b82f633"
                  name="Complaints"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  fill="#10b98133"
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="card p-5">
            <h3 className="text-xs uppercase mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#020617" />
                <XAxis dataKey="name" tick={axisTickStyle} />
                <YAxis tick={axisTickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* PRIORITY + AGENT PERFORMANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="card p-5">
            <h3 className="text-xs uppercase mb-4">By Priority</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={analytics.byPriority}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analytics.byPriority.map((p: any, i: number) => (
                    <Cell key={i} fill={PRIORITY_COLORS[p.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="card p-5">
            <h3 className="text-xs uppercase mb-4 flex gap-2">
              <Users size={14} /> Agent Performance
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.agentPerformance} layout="vertical">
                <XAxis type="number" tick={axisTickStyle} />
                <YAxis dataKey="name" type="category" tick={axisTickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="assigned" fill="#3b82f6" />
                <Bar dataKey="resolved" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ALL COMPLAINTS */}
        <motion.div className="card p-5">
          <h3 className="text-xs uppercase mb-4">All Complaints</h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Agent</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} className="border-b border-border/10">
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.userId?.name}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="p-3">
                    {c.assignedAgent ? (
                      c.assignedAgent.name
                    ) : (
                      <select
                        className="bg-background border border-border rounded px-2 py-1"
                        onChange={async (e) => {
                          await assignAgent(c._id, e.target.value);
                          loadAll();
                        }}
                      >
                        <option value="">Assign agent</option>
                        {agents.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </AppLayout>
  );
}

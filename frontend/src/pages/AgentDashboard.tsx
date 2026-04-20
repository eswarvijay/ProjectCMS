import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import ChatBox from "@/components/ChatBox";
import KPICard from "@/components/KPICard";
import AppLayout from "@/components/AppLayout";
import {
  getAgentComplaints,
  updateComplaintStatus,
} from "@/lib/complaint-api";

const AgentDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const data = await getAgentComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to load agent complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateComplaintStatus(id, status);
      loadComplaints();
    } catch {
      alert("Failed to update status");
    }
  };

  /* KPI COUNTS */
  const stats = {
    assigned: complaints.length,
    open: complaints.filter((c) => c.status === "Open").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <AppLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Assigned Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Manage and resolve complaints assigned to you
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Assigned"
          value={stats.assigned}
          icon={<FileText className="h-5 w-5 text-info" />}
          gradient="--gradient-kpi-2"
          iconColor="bg-info/15"
        />

        <KPICard
          title="Open"
          value={stats.open}
          icon={<AlertCircle className="h-5 w-5 text-warning" />}
          gradient="--gradient-kpi-3"
          iconColor="bg-warning/15"
        />

        <KPICard
          title="In Progress"
          value={stats.inProgress}
          icon={<Clock className="h-5 w-5 text-primary" />}
          gradient="--gradient-kpi-1"
          iconColor="bg-primary/15"
        />

        <KPICard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
          gradient="--gradient-kpi-1"
          iconColor="bg-success/15"
        />
      </div>

      {/* COMPLAINT LIST */}
      <div className="space-y-4">
        {!loading && complaints.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No assigned complaints
          </div>
        )}

        {complaints.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm p-5"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h4 className="font-semibold">{c.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {c.description}
                </p>
              </div>

              <div className="flex gap-2">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              Category: {c.category} •{" "}
              {new Date(c.createdAt).toLocaleDateString()}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              {c.status === "Open" && (
                <Button
                  size="sm"
                  onClick={() =>
                    handleStatusChange(c._id, "In Progress")
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-[0_0_15px_hsl(160_84%_39%/0.35)]"
                >
                  Mark In Progress
                </Button>
              )}

              {c.status === "In Progress" && (
                <Button
                  size="sm"
                  onClick={() =>
                    handleStatusChange(c._id, "Resolved")
                  }
                  className="bg-success text-success-foreground hover:bg-success/90 rounded-xl shadow-[0_0_15px_hsl(142_76%_36%/0.45)]"
                >
                  Resolve
                </Button>
              )}
            </div>

            {/* CHAT */}
            <div className="mt-4">
              <ChatBox
                complaintId={c._id}
                senderRole="agent"
                senderName="Agent"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
};

export default AgentDashboard;

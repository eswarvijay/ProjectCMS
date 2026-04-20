import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  X,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import ChatBox from "@/components/ChatBox";
import KPICard from "@/components/KPICard";
import AppLayout from "@/components/AppLayout";
import { getMyComplaints, createComplaint } from "@/lib/complaint-api";

const UserDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      alert("Title and description required");
      return;
    }

    try {
      setSubmitting(true);
      await createComplaint(form);
      setForm({ title: "", description: "" });
      setShowForm(false);
      loadComplaints(); // 🔥 refresh dashboard
    } catch (err) {
      alert("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "Open").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Complaints</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your submitted complaints
          </p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className={
            showForm
              ? "bg-secondary rounded-xl"
              : "bg-primary rounded-xl"
          }
        >
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" /> New Complaint
            </>
          )}
        </Button>
      </div>

      {/* INLINE COMPLAINT FORM (THIS IS WHAT YOU WANTED) */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 rounded-xl border bg-card/50 p-6"
        >
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary rounded-xl"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total"
          value={stats.total}
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

      {/* Complaints List */}
      <div className="space-y-3">
        {!loading && complaints.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No complaints found</p>
          </div>
        )}

        {complaints.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card/50 p-5"
          >
            <div className="flex justify-between">
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
              {c.category} • {new Date(c.createdAt).toLocaleDateString()}
            </div>

            <ChatBox
              complaintId={c._id}
              senderRole="user"
              senderName="User"
            />
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
};

export default UserDashboard;

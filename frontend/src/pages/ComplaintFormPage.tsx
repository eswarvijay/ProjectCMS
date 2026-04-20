import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { createComplaint } from "@/lib/complaint-api"; // ✅ ADD THIS

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ STEP 2 — REAL BACKEND SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createComplaint({
        title: form.title,
        description: form.description,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm p-6"
        >
          <h2 className="text-xl font-bold mb-1 tracking-tight">
            Submit New Complaint
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Provide details about your issue for faster resolution
          </p>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Title
              </Label>
              <Input
                placeholder="Brief summary of the issue"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="bg-secondary/30 border-border/30 rounded-xl h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </Label>
                <Select
                  onValueChange={(v) =>
                    setForm({ ...form, category: v })
                  }
                >
                  <SelectTrigger className="bg-secondary/30 border-border/30 rounded-xl h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Infrastructure">
                      IT Infrastructure
                    </SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Priority
                </Label>
                <Select
                  onValueChange={(v) =>
                    setForm({ ...form, priority: v })
                  }
                >
                  <SelectTrigger className="bg-secondary/30 border-border/30 rounded-xl h-11">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </Label>
              <Textarea
                placeholder="Provide detailed information about your issue..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={6}
                className="bg-secondary/30 border-border/30 rounded-xl"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl shadow-[0_0_20px_hsl(160_84%_39%/0.2)] hover:shadow-[0_0_30px_hsl(160_84%_39%/0.3)] transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Complaint
                </span>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ComplaintForm;

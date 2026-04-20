import api from "@/lib/axios";

/* ================= USER ================= */

export const createComplaint = (data: {
  title: string;
  description: string;
}) => {
  return api.post("/complaints/create", data);
};

export const getMyComplaints = async () => {
  const res = await api.get("/complaints");
  return res.data;
};

/* ================= AGENT ================= */

// get complaints assigned to agent
export const getAgentComplaints = async () => {
  const res = await api.get("/complaints/agent/my");
  return res.data;
};

// update complaint status
export const updateComplaintStatus = async (
  id: string,
  status: string
) => {
  const res = await api.put(
    `/complaints/agent/update-status/${id}`,
    { status }
  );
  return res.data;
};

/* ================= ADMIN ================= */

// analytics
export const getAdminAnalytics = async () => {
  const res = await api.get("/analytics/admin");
  return res.data;
};

// all complaints (admin table)
export const getAdminComplaints = async () => {
  const res = await api.get("/complaints/admin/all");
  return res.data;
};

import api from "@/lib/axios";

/* ================= ADMIN ================= */

// ✅ get all agents
export const getAllAgents = async () => {
  const res = await api.get("/users/agents");
  return res.data;
};

// ✅ assign agent to complaint
export const assignAgent = async (
  complaintId: string,
  agentId: string
) => {
  const res = await api.put(
    `/complaints/admin/assign-agent/${complaintId}`,
    { agentId }
  );
  return res.data;
};

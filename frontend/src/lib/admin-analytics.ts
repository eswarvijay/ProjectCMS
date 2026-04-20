export const getAdminAnalytics = async () => {
  const complaints = await getAllComplaintsAdmin();

  return {
    totalComplaints: complaints.length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    open: complaints.filter(c => c.status === "Open").length,
    avgResolutionTime: 6.2,
    weeklyTrend: [...],
    byCategory: [...],
    byPriority: [...],
    agentPerformance: [...],
  };
};

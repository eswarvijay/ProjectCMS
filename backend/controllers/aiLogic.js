function classifyComplaint(text) {
  text = text.toLowerCase();
  if (text.includes("internet") || text.includes("server"))
    return "Technical";
  if (text.includes("payment") || text.includes("bill"))
    return "Billing";
  return "General";
}

function predictPriority(text) {
  if (text.includes("urgent") || text.includes("not working"))
    return "High";
  return "Medium";
}

module.exports = { classifyComplaint, predictPriority };

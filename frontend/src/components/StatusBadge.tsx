import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Open" | "In Progress" | "Resolved";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants: Record<string, string> = {
    Open: "bg-warning/10 text-warning border-warning/25 shadow-[0_0_8px_hsl(38_92%_50%/0.1)]",
    "In Progress": "bg-info/10 text-info border-info/25 shadow-[0_0_8px_hsl(217_91%_60%/0.1)]",
    Resolved: "bg-success/10 text-success border-success/25 shadow-[0_0_8px_hsl(160_84%_39%/0.1)]",
  };

  return (
    <Badge variant="outline" className={cn("font-medium text-[11px] px-2.5 py-0.5", variants[status], className)}>
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full inline-block",
        status === "Open" && "bg-warning animate-pulse-soft",
        status === "In Progress" && "bg-info animate-pulse-soft",
        status === "Resolved" && "bg-success"
      )} />
      {status}
    </Badge>
  );
};

interface PriorityBadgeProps {
  priority: "Low" | "Medium" | "High" | "Critical";
  className?: string;
}

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const variants: Record<string, string> = {
    Low: "bg-muted/50 text-muted-foreground border-border/50",
    Medium: "bg-info/10 text-info border-info/25",
    High: "bg-warning/10 text-warning border-warning/25",
    Critical: "bg-destructive/10 text-destructive border-destructive/25 shadow-[0_0_8px_hsl(0_72%_51%/0.1)]",
  };

  return (
    <Badge variant="outline" className={cn("font-medium text-[11px] px-2.5 py-0.5", variants[priority], className)}>
      {priority === "Critical" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-destructive inline-block animate-pulse-soft" />}
      {priority}
    </Badge>
  );
};

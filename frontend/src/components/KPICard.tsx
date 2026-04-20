import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient?: string;
  iconColor: string;
  trend?: string;
}

const gradientMap: Record<string, string> = {
  "--gradient-kpi-1": "bg-gradient-to-br from-primary/10 to-primary/[0.02]",
  "--gradient-kpi-2": "bg-gradient-to-br from-info/10 to-info/[0.02]",
  "--gradient-kpi-3": "bg-gradient-to-br from-warning/10 to-warning/[0.02]",
  "--gradient-kpi-4": "bg-gradient-to-br from-destructive/10 to-destructive/[0.02]",
};

const accentMap: Record<string, string> = {
  "--gradient-kpi-1": "group-hover:shadow-[0_0_20px_hsl(160_84%_39%/0.15)]",
  "--gradient-kpi-2": "group-hover:shadow-[0_0_20px_hsl(217_91%_60%/0.15)]",
  "--gradient-kpi-3": "group-hover:shadow-[0_0_20px_hsl(38_92%_50%/0.15)]",
  "--gradient-kpi-4": "group-hover:shadow-[0_0_20px_hsl(0_72%_51%/0.15)]",
};

const KPICard = ({ title, value, icon, gradient, iconColor, trend }: KPICardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group rounded-xl border border-border/40 p-5 relative overflow-hidden transition-all duration-300",
        gradient && gradientMap[gradient],
        gradient && accentMap[gradient],
        "hover:border-border/60 hover:-translate-y-0.5"
      )}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-foreground tracking-tight">{value}</h3>
          {trend && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">{trend}</p>
          )}
        </div>
        <div className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          iconColor
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;

import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  LogOut,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const navByRole: Record<string, NavItem[]> = {
  user: [
    { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard" },
    { label: "New Complaint", icon: <FileText className="h-5 w-5" />, path: "/complaint" },
  ],
  admin: [
    { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/admin" },
    { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, path: "/admin/analytics" },
    { label: "Agents", icon: <Users className="h-5 w-5" />, path: "/admin/agents" },
  ],
  agent: [
    { label: "My Tasks", icon: <LayoutDashboard className="h-5 w-5" />, path: "/agent" },
    { label: "Messages", icon: <MessageSquare className="h-5 w-5" />, path: "/agent/messages" },
  ],
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { role, name, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = navByRole[role || "user"] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col border-r border-border/30 bg-[hsl(222,47%,5.5%)] relative">
        {/* Subtle sidebar glow */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-primary/10 via-transparent to-primary/5" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border/20">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 flex items-center justify-center shadow-[0_0_20px_hsl(160_84%_39%/0.15)]">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground tracking-wide">CMS</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">Complaint Mgmt</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">Navigation</p>
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_hsl(160_84%_39%/0.05)]"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary shadow-[0_0_8px_hsl(160_84%_39%/0.5)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {item.icon}
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary/60" />}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-border/20">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              {name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              <p className="text-[10px] text-muted-foreground capitalize tracking-wide">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/8 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/30 bg-[hsl(222,47%,5.5%)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-sm">CMS</span>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 px-4 py-2 border-b border-border/30 overflow-x-auto bg-background/50">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  isActive ? "bg-primary/10 text-primary shadow-[0_0_10px_hsl(160_84%_39%/0.1)]" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto"
          >
            {children}
          </motion.div>

        </main>
      </div>
    </div>
  );
};

export default AppLayout;

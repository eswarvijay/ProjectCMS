import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  Mail,
  Lock,
  Zap,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import authBg from "@/assets/auth-bg.jpg";
import { login as loginApi } from "@/lib/auth-api"; // 🔥 backend login

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // existing auth context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ ONLY THIS FUNCTION IS MODIFIED
  const handleLogin = async () => {
    try {
      setLoading(true);

      // 🔹 Call BACKEND login API
      const res = await loginApi({
        email,
        password,
      });

      /*
        Expected backend response format:
        {
          token: "JWT_TOKEN",
          user: {
            role: "admin" | "agent" | "user",
            name: "User Name"
          }
        }
      */

      // 🔹 Save token
      localStorage.setItem("token", res.data.token);

      // 🔹 Update auth context
      login(res.data.token, res.data.user.role, res.data.user.name);

      // 🔹 Role-based navigation (same logic you already had)
      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "agent") navigate("/agent");
      else navigate("/dashboard");

    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Zap className="h-4 w-4" />, label: "AI-Powered Classification" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Real-time Analytics" },
    { icon: <MessageSquare className="h-4 w-4" />, label: "Instant Communication" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center p-16">
        <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <span className="text-2xl font-bold">CMS</span>
          </div>

          <h1 className="text-5xl font-extrabold mb-4">
            AI-Powered <span className="gradient-text">Complaint Management</span>
          </h1>

          <div className="mt-10 space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {f.icon}
                </div>
                <span>{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[420px]"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            New user?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authBg from "@/assets/auth-bg.jpg";
import { register as registerApi } from "@/lib/auth-api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // ✅ ONLY THIS FUNCTION IS CHANGED (mock removed, backend added)
  const handleRegister = async () => {
    try {
      setLoading(true);

      // 🔹 Call backend register API
      await registerApi({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // 🔹 After successful registration → go to login page
      navigate("/");

    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center p-16">
        <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-[0_0_30px_hsl(160_84%_39%/0.2)]">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-wide">CMS</span>
          </div>
          <h1 className="text-5xl font-extrabold text-foreground mb-4 leading-[1.1] tracking-tight">
            Join the<br />
            <span className="gradient-text">Smart Resolution</span><br />
            Platform
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Get started in seconds. Track, resolve, and analyze complaints with AI-powered intelligence.
          </p>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">CMS</span>
          </div>

          <h2 className="text-3xl font-bold mb-2 tracking-tight">Create your account</h2>
          <p className="text-muted-foreground mb-8">Get started with complaint management</p>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="pl-10 h-12 bg-secondary/30 border-border/30 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10 h-12 bg-secondary/30 border-border/30 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-10 h-12 bg-secondary/30 border-border/30 rounded-xl"
                />
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;

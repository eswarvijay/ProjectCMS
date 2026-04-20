import { createContext, useContext, useState, ReactNode } from "react";

interface AuthState {
  token: string | null;
  role: "user" | "admin" | "agent" | null;
  name: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role") as AuthState["role"],
    name: localStorage.getItem("name"),
  }));

  const login = (token: string, role: string, name: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    setAuth({ token, role: role as AuthState["role"], name });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setAuth({ token: null, role: null, name: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isAuthenticated: !!auth.token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

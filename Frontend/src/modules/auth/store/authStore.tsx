import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, AuthState } from "../types/auth.types";

// ── Actions exposed by the auth store ───────────────────────────────
interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Helper: safely parse stored JSON ────────────────────────────────
function loadUser(): User | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

// ── Provider ────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token && !!user;

  // Persist to localStorage whenever token/user change
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const setAuth = useCallback((u: User, t: string) => {
    setUser(u);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const setLoading = useCallback((l: boolean) => setIsLoading(l), []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, setAuth, logout, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook to consume auth context ────────────────────────────────────
export function useAuthStore(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthStore must be used inside <AuthProvider>");
  return ctx;
}

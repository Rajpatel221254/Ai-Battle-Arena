import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import type { LoginCredentials, RegisterCredentials } from "../types/auth.types";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

/**
 * Custom hook encapsulating all authentication logic.
 * Connects the service layer → store layer and handles UX concerns.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, logout, setLoading } =
    useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const res = await authService.login(credentials);
        if (res.success && res.data) {
          setAuth(res.data.user, res.data.token);
          toast.success("Welcome back! 🎉");
          navigate("/dashboard");
        }
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        const msg =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading, navigate]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setLoading(true);
      try {
        const res = await authService.register(credentials);
        if (res.success && res.data) {
          setAuth(res.data.user, res.data.token);
          toast.success("Account created successfully! 🚀");
          navigate("/dashboard");
        }
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        const msg =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading, navigate]
  );

  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  }, [logout, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
  };
}

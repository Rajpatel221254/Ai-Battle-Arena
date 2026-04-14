import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../modules/auth/store/authStore";
import { BattleProvider } from "../modules/battle/store/battleStore";
import Navbar from "../shared/components/Navbar";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BattleProvider>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1a2332",
                color: "#e2e8f0",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
              },
              success: {
                iconTheme: {
                  primary: "#06ffd0",
                  secondary: "#0a0e1a",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#0a0e1a",
                },
              },
            }}
          />

          {/* Layout */}
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
        </BattleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

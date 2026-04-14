import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../modules/auth/hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/battle", label: "Battle" },
    { to: "/history", label: "History" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-arena-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-arena-900 font-extrabold text-sm transition-transform group-hover:scale-110">
                AI
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple opacity-40 blur-md group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">
              <span className="gradient-text">Battle</span>{" "}
              <span className="text-arena-300">Arena</span>
            </span>
          </Link>

          {/* Nav Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-arena-700/80 text-neon-cyan shadow-[inset_0_1px_0_rgba(6,255,208,0.1)]"
                      : "text-arena-300 hover:text-arena-100 hover:bg-arena-700/40"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-arena-700/40">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-arena-200 font-medium">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-arena-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-arena-300 hover:text-arena-100 rounded-lg hover:bg-arena-700/40 transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-neon-cyan to-neon-purple text-arena-900 rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <div className="md:hidden flex items-center">
                <MobileMenu links={navLinks} isActive={isActive} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Mobile dropdown ─────────────────────────────────────────────────
function MobileMenu({
  links,
  isActive,
}: {
  links: { to: string; label: string }[];
  isActive: (path: string) => boolean;
}) {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-arena-700/40 transition-colors">
        <svg
          className="w-5 h-5 text-arena-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </summary>
      <div className="absolute right-0 mt-2 w-48 rounded-xl glass-light shadow-2xl shadow-black/40 py-2 animate-fade-in-up">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive(link.to)
                ? "text-neon-cyan bg-arena-700/40"
                : "text-arena-300 hover:text-arena-100 hover:bg-arena-700/30"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

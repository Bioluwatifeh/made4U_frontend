import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/chat",
    label: "AI Consultation",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    to: "/timeline",
    label: "Timeline",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: "/reports",
    label: "Reports",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "Profile",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function Layout({ children }) {
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  const session = JSON.parse(localStorage.getItem("healthpal_session") || "null");
  const email = session?.user?.email || "Unknown User";

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const userId = localStorage.getItem("healthpal_user_id");
      if (!userId) return;
      const response = await api.get(`/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email[0]?.toUpperCase() || "?";

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-slate-900 flex flex-col">
        {/* Brand */}
        <div className="px-6 pt-7 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">HealthPal</span>
          </div>
        </div>

        {/* User info */}
        <div className="mx-3 mb-4 bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {profile?.full_name || "User"}
            </p>
            <p className="text-slate-400 text-xs truncate">{email}</p>
          </div>
        </div>

        <div className="mx-3 border-t border-slate-700/60 mb-3" />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-500"}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 mt-4">
          <div className="border-t border-slate-700/60 mb-4" />
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}
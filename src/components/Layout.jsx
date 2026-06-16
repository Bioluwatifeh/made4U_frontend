import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../api/api";

export default function Layout({
  children
}) {

  const [profile, setProfile] =
    useState(null);

  const session = JSON.parse(
    localStorage.getItem(
      "healthpal_session"
    )
  );

  const email =
    session?.user?.email ||
    "Unknown User";

  useEffect(() => {

    loadProfile();

  }, []);

  async function loadProfile() {

    try {

      const userId =
        localStorage.getItem(
          "healthpal_user_id"
        );

      if (!userId) return;

      const response =
        await api.get(
          `/profile/${userId}`
        );

      setProfile(
        response.data
      );

    } catch (error) {

      console.error(error);

    }
  }

  function logout() {

    localStorage.clear();

    window.location.href = "/";
  }

  return (

    <div className="flex min-h-screen bg-slate-100">

      <div className="w-64 bg-slate-900 text-white p-6">

        <h1 className="text-2xl font-bold">
          HealthPal
        </h1>

        <div className="mt-3">

          <p className="font-medium">

            {
              profile?.full_name
              || "User"
            }

          </p>

          <p className="text-sm text-slate-400">

            {email}

          </p>

        </div>

        <div className="border-b border-slate-700 my-5"></div>

        <nav className="space-y-3">

          <Link
            to="/dashboard"
            className="block hover:text-cyan-400"
          >
            Dashboard
          </Link>

          <Link
            to="/chat"
            className="block hover:text-cyan-400"
          >
            AI Consultation
          </Link>

          <Link
            to="/timeline"
            className="block hover:text-cyan-400"
          >
            Timeline
          </Link>

          <Link
            to="/reports"
            className="block hover:text-cyan-400"
          >
            Reports
          </Link>

          <Link
            to="/profile"
            className="block hover:text-cyan-400"
          >
            Profile
          </Link>

        </nav>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      <div className="flex-1 p-8">
        {children}
      </div>

    </div>

  );
}
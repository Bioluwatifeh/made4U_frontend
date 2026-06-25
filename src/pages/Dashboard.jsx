import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import RiskBadge from "../components/RiskBadge";

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const userId = localStorage.getItem("healthpal_user_id");
      const response = await api.get(`/dashboard/${userId}`);
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse text-slate-400 py-16 text-center">Loading dashboard...</div>
      </Layout>
    );
  }

  const profile = dashboard?.profile || {};
  const conditions = profile.medical_conditions?.length || 0;
  const medications = profile.current_medications?.length || 0;

  const profileFields = [
    { label: "Name", value: profile.full_name },
    { label: "Age", value: profile.age },
    { label: "Gender", value: profile.gender },
    { label: "Blood Group", value: profile.blood_group },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-slate-500 mt-1">Here's your health overview.</p>
        </div>
        <a
          href="/chat"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          New Consultation
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard
          label="Consultations"
          value={dashboard.consultation_count ?? "—"}
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />
        <StatCard
          label="Conditions"
          value={conditions}
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Medications"
          value={medications}
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        />
        <StatCard
          label="Profile"
          value={`${dashboard.profile_completion ?? 0}%`}
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>

      {/* Latest risk */}
      {dashboard.latest_risk && (
        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Latest Risk Level</p>
            <RiskBadge risk={dashboard.latest_risk} />
          </div>
        </div>
      )}

      {/* Lower panels */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {/* Patient profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800">Patient Profile</h2>
            <a href="/profile" className="text-xs text-blue-600 hover:underline font-medium">Edit</a>
          </div>
          <div className="space-y-3">
            {profileFields.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-medium text-slate-800">{value || <span className="text-slate-300">Not set</span>}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent symptoms */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800">Recent Symptoms</h2>
            <a href="/timeline" className="text-xs text-blue-600 hover:underline font-medium">View all</a>
          </div>

          {!dashboard.recent_symptoms?.length ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">No symptoms logged yet.</p>
              <a href="/chat" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                Start a consultation →
              </a>
            </div>
          ) : (
            <div className="space-y-1">
              {dashboard.recent_symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <p className="text-sm text-slate-700 font-medium">{symptom.symptom}</p>
                  <RiskBadge risk={symptom.risk_level} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
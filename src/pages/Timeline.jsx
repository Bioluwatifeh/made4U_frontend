import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import RiskBadge from "../components/RiskBadge";
import api from "../api/api";

export default function Timeline() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    try {
      const userId = localStorage.getItem("healthpal_user_id");
      const response = await api.get(`/symptoms/${userId}`);
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-800">Symptom Timeline</h1>
      <p className="text-slate-500 mt-1">A chronological history of your logged symptoms and risk assessments.</p>

      <div className="mt-8">
        {loading ? (
          <div className="text-slate-400 animate-pulse py-12 text-center">Loading your timeline...</div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-700">No symptoms logged yet</h3>
            <p className="text-sm text-slate-400 mt-1">Head to the chat to describe your symptoms and start your timeline.</p>
            <a
              href="/chat"
              className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
            >
              Start a consultation
            </a>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

            <div className="space-y-4">
              {logs.map((item) => (
                <div key={item.id} className="relative flex gap-5 pl-14">
                  {/* Dot */}
                  <div className="absolute left-[14px] top-5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow" />

                  <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <h3 className="font-semibold text-slate-800">{item.symptom}</h3>
                      <RiskBadge risk={item.risk_level} />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(item.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
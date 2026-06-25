import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/Layout";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const userId = localStorage.getItem("healthpal_user_id");
      const response = await api.get(`/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfile() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const userId = localStorage.getItem("healthpal_user_id");
      await api.put(`/profile/${userId}`, profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <Layout>
        <div className="animate-pulse text-slate-400 py-12 text-center">Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Keep your health information up to date for better AI recommendations.</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {saved && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile saved successfully.
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g. Amara Okafor"
                value={profile.full_name || ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
              <input
                type="number"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g. 32"
                value={profile.age || ""}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                value={profile.gender || ""}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Blood Group</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                value={profile.blood_group || ""}
                onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
              >
                <option value="">Select blood group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Medical Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Allergies</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g. Penicillin, Peanuts (comma-separated)"
                value={profile.allergies?.join(", ") || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    allergies: e.target.value.split(",").map((i) => i.trim()).filter(Boolean),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Medical Conditions</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g. Hypertension, Diabetes (comma-separated)"
                value={profile.medical_conditions?.join(", ") || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    medical_conditions: e.target.value.split(",").map((i) => i.trim()).filter(Boolean),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Current Medications</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g. Metformin, Lisinopril (comma-separated)"
                value={profile.current_medications?.join(", ") || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    current_medications: e.target.value.split(",").map((i) => i.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition text-sm"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </Layout>
  );
}
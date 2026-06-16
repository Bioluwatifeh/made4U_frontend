import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import api from "../api/api";
import RiskBadge from "../components/RiskBadge";

export default function Dashboard() {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    try {

      const userId =
        localStorage.getItem(
          "healthpal_user_id"
        );

      const response =
        await api.get(
          `/dashboard/${userId}`
        );

      setDashboard(
        response.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {

    return (
      <Layout>
        <h2>
          Loading Dashboard...
        </h2>
      </Layout>
    );
  }

  const profile =
    dashboard?.profile || {};

  const conditions =
    profile.medical_conditions?.length || 0;

  const medications =
    profile.current_medications?.length || 0;

  return (

    <Layout>

      <div>

        <h1 className="text-4xl font-bold">
          Welcome Back
        </h1>

        <p className="text-slate-500 mt-2">
          Health Overview
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-slate-500">
            Consultations
          </h3>

          <p className="text-3xl font-bold mt-3">
            {dashboard.consultation_count}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-slate-500">
            Latest Risk
          </h3>

          <div className="mt-4">

            <RiskBadge
              risk={
                dashboard.latest_risk
              }
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-slate-500">
            Conditions
          </h3>

          <p className="text-3xl font-bold mt-3">
            {conditions}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-slate-500">
            Medications
          </h3>

          <p className="text-3xl font-bold mt-3">
            {medications}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-slate-500">
            Profile Completion
          </h3>

          <p className="text-3xl font-bold mt-3">
            {dashboard.profile_completion}%
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold">
            Patient Profile
          </h2>

          <div className="mt-5 space-y-3">

            <p>
              <strong>Name:</strong>{" "}
              {profile.full_name || "Not Set"}
            </p>

            <p>
              <strong>Age:</strong>{" "}
              {profile.age || "Not Set"}
            </p>

            <p>
              <strong>Gender:</strong>{" "}
              {profile.gender || "Not Set"}
            </p>

            <p>
              <strong>Blood Group:</strong>{" "}
              {profile.blood_group || "Not Set"}
            </p>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold">
            Recent Symptoms
          </h2>

          <div className="mt-5">

            {
              dashboard.recent_symptoms?.length === 0
              ? (
                <p>
                  No symptoms logged yet.
                </p>
              )
              : (
                dashboard.recent_symptoms.map(
                  (
                    symptom,
                    index
                  ) => (

                    <div
                      key={index}
                      className="border-b py-3"
                    >

                      <p className="font-medium">
                        {symptom.symptom}
                      </p>

                      <div className="mt-2">

                        <RiskBadge
                          risk={
                            symptom.risk_level
                          }
                        />

                      </div>

                    </div>

                  )
                )
              )
            }

          </div>

        </div>

      </div>

    </Layout>

  );
}
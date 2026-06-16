import { useEffect, useState } from "react";

import api from "../api/api";
import Layout from "../components/Layout";

export default function Profile() {

  const [profile, setProfile] =
    useState(null);

  useEffect(() => {

    loadProfile();

  }, []);

  async function loadProfile() {

    try {

      const userId =
        localStorage.getItem(
          "healthpal_user_id"
        );

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

  async function saveProfile() {

    try {

      const userId =
        localStorage.getItem(
          "healthpal_user_id"
        );

      await api.put(
        `/profile/${userId}`,
        profile
      );

      alert(
        "Profile Updated Successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed To Update Profile"
      );

    }
  }

  if (!profile) {

    return (
      <Layout>
        Loading...
      </Layout>
    );

  }

  return (

    <Layout>

      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <div className="space-y-4">

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Full Name"
            value={profile.full_name || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                full_name:
                  e.target.value
              })
            }
          />

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Age"
            value={profile.age || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                age:
                  Number(
                    e.target.value
                  )
              })
            }
          />

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Gender"
            value={profile.gender || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                gender:
                  e.target.value
              })
            }
          />

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Blood Group"
            value={
              profile.blood_group || ""
            }
            onChange={(e) =>
              setProfile({
                ...profile,
                blood_group:
                  e.target.value
              })
            }
          />

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Allergies"
            value={
              profile.allergies?.join(", ")
            }
            onChange={(e) =>
              setProfile({
                ...profile,
                allergies:
                  e.target.value
                    .split(",")
                    .map(
                      item =>
                        item.trim()
                    )
                    .filter(Boolean)
              })
            }
          />

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Medical Conditions"
            value={
              profile.medical_conditions?.join(", ")
            }
            onChange={(e) =>
              setProfile({
                ...profile,
                medical_conditions:
                  e.target.value
                    .split(",")
                    .map(
                      item =>
                        item.trim()
                    )
                    .filter(Boolean)
              })
            }
          />

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Current Medications"
            value={
              profile.current_medications?.join(", ")
            }
            onChange={(e) =>
              setProfile({
                ...profile,
                current_medications:
                  e.target.value
                    .split(",")
                    .map(
                      item =>
                        item.trim()
                    )
                    .filter(Boolean)
              })
            }
          />

          <button
            onClick={saveProfile}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Save Profile
          </button>

        </div>

      </div>

    </Layout>

  );
}
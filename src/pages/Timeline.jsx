import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function Timeline() {

  const [logs, setLogs] =
    useState([]);

  useEffect(() => {

    loadTimeline();

  }, []);

  async function loadTimeline() {

    try {

      const userId =
        localStorage.getItem(
          "healthpal_user_id"
        );

      const response =
        await api.get(
          `/symptoms/${userId}`
        );

      setLogs(
        response.data
      );

    } catch (error) {

      console.error(error);

    }
  }

  return (

    <Layout>

      <h1>
        Symptom Timeline
      </h1>

      <br />

      {
        logs.length === 0
        ? (
          <p>
            No symptom history found.
          </p>
        )
        : (
          logs.map(
            (item) => (

              <div
                key={item.id}
                style={{
                  border:
                    "1px solid #ddd",
                  padding: "15px",
                  marginBottom:
                    "15px"
                }}
              >

                <h3>
                  {item.symptom}
                </h3>

                <p>
                  Risk:
                  {" "}
                  {item.risk_level}
                </p>

                <p>
                  Date:
                  {" "}
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </p>

              </div>
            )
          )
        )
      }

    </Layout>
  );
}
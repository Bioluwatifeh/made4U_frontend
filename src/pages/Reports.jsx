import Layout from "../components/Layout";

export default function Reports() {

  const userId =
    localStorage.getItem(
      "healthpal_user_id"
    );

  const reportUrl =
    `http://127.0.0.1:8000/reports/${userId}`;

  return (

    <Layout>

      <h1>
        Health Reports
      </h1>

      <br />

      <a
        href={reportUrl}
        target="_blank"
        rel="noreferrer"
      >
        <button>
          Download Health Report
        </button>
      </a>

    </Layout>

  );
}
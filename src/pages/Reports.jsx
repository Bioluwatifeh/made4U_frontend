import Layout from "../components/Layout";

export default function Reports() {
  const userId = localStorage.getItem("healthpal_user_id");
  const reportUrl = `http://127.0.0.1:8000/reports/${userId}`;

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-800">Health Reports</h1>
        <p className="text-slate-500 mt-1">Download a summary of your health consultations and symptom history.</p>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8 flex items-start gap-5">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-800">Full Health Report</h2>
            <p className="text-sm text-slate-500 mt-1">
              Includes all symptom logs, risk assessments, and AI consultation history as a PDF.
            </p>
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Report
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Reports are generated in real time and reflect your latest data.
        </p>
      </div>
    </Layout>
  );
}
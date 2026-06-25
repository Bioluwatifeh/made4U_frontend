export default function RiskBadge({ risk }) {
  const config = {
    LOW: {
      style: "bg-green-50 text-green-700 border border-green-200",
      dot: "bg-green-500",
      label: "Low Risk",
    },
    MEDIUM: {
      style: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      dot: "bg-yellow-500",
      label: "Medium Risk",
    },
    HIGH: {
      style: "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-500",
      label: "High Risk",
    },
  };

  const { style, dot, label } = config[risk] ?? {
    style: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
    label: risk ?? "Unknown",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  );
}
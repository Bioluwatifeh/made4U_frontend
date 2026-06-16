export default function RiskBadge({
  risk
}) {

  let color =
    "bg-green-500";

  if (
    risk === "MEDIUM"
  ) {

    color =
      "bg-yellow-500";
  }

  if (
    risk === "HIGH"
  ) {

    color =
      "bg-red-500";
  }

  return (

    <span
      className={`${color} text-white px-3 py-2 rounded-lg`}
    >
      {risk}
    </span>

  );
}
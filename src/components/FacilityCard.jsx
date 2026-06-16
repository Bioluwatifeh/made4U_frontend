export default function FacilityCard({
  facility
}) {

  return (

    <div className="border rounded-lg p-4 bg-white shadow-sm">

      <h3 className="font-semibold">
        {facility.name}
      </h3>

      <p className="text-sm text-slate-600 mt-1">
        {facility.address}
      </p>

    </div>

  );
}
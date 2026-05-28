type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h2>
        </div>

        <div className="text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
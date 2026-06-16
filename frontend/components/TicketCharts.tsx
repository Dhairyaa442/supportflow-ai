"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  security: number;
  billing: number;
  technical: number;
  openTickets: number;
  closedTickets: number;
};

export default function TicketCharts({
  security,
  billing,
  technical,
  openTickets,
  closedTickets,
}: Props) {
  const categoryData = [
    { name: "Security", value: security },
    { name: "Billing", value: billing },
    { name: "Technical", value: technical },
  ];

  const statusData = [
    { name: "Open", value: openTickets },
    { name: "Closed", value: closedTickets },
  ];

  const categoryColors = [
    "#06b6d4",
    "#8b5cf6",
    "#f97316",
  ];

  const statusColors = [
    "#10b981",
    "#ef4444",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

      {/* Category Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Category Distribution
        </h2>

        <div className="w-full h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                label={({ name, percent }: any) =>
                  `${name} ${Math.round(percent * 100)}%`
                }
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={categoryColors[index]}
                  />
                ))}
              </Pie>

              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="34"
                fontWeight="bold"
              >
                {security + billing + technical}
              </text>

              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize="14"
              >
                Tickets
              </text>

              <Tooltip />
              <Legend />

            </PieChart>

            <div className="w-full h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  ...
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-center gap-8 text-sm">
              <div className="text-cyan-400">
                Security: {security}
              </div>

              <div className="text-violet-400">
                Billing: {billing}
              </div>

              <div className="text-orange-400">
                Technical: {technical}
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Open vs Closed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Open vs Closed Tickets
        </h2>

        <div className="w-full h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                label={({ name, percent }: any) =>
                  `${name} ${Math.round(percent * 100)}%`
                }
              >
                {statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={statusColors[index]}
                  />
                ))}
              </Pie>

              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="34"
                fontWeight="bold"
              >
                {openTickets + closedTickets}
              </text>

              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize="14"
              >
                Total
              </text>

              <Tooltip />
              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
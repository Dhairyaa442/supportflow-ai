import { useState } from "react";
import axios from "axios";

type Ticket = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
};

type Props = {
  tickets: Ticket[];
  onRecommendation: (
    description: string
  ) => void;
};

export default function TicketTable({
  tickets,
  onRecommendation,
}: Props) {
  const [selectedTicket, setSelectedTicket] =
    useState<number | null>(null);

  const [resolution, setResolution] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const getPriorityBadge = (
    priority: string
  ) => {
    if (priority === "HIGH") {
      return (
        <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
          HIGH
        </span>
      );
    }

    if (priority === "MEDIUM") {
      return (
        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium">
          MEDIUM
        </span>
      );
    }

    return (
      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
        LOW
      </span>
    );
  };

  const getStatusBadge = (
    status: string
  ) => {
    if (status === "OPEN") {
      return (
        <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
          OPEN
        </span>
      );
    }

    return (
      <span className="bg-slate-500/20 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
        CLOSED
      </span>
    );
  };

  const getCategoryBadge = (
    category: string
  ) => {
    if (category === "Security") {
      return (
        <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">
          Security
        </span>
      );
    }

    if (category === "Billing") {
      return (
        <span className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-xs font-medium">
          Billing
        </span>
      );
    }

    if (category === "Technical") {
      return (
        <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-medium">
          Technical
        </span>
      );
    }

    return (
      <span className="bg-slate-500/20 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
        {category}
      </span>
    );
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Recent Tickets
          </h2>

          <span className="text-sm text-slate-400">
            {tickets.length} Tickets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-400 uppercase text-xs tracking-wider">
                  ID
                </th>

                <th className="text-left p-4 text-slate-400 uppercase text-xs tracking-wider">
                  Title
                </th>

                <th className="text-left p-4 text-slate-400 uppercase text-xs tracking-wider">
                  Category
                </th>

                <th className="text-left p-4 text-slate-400 uppercase text-xs tracking-wider">
                  Priority
                </th>

                <th className="text-left p-4 text-slate-400 uppercase text-xs tracking-wider">
                  Status
                </th>

                <th className="text-left p-4 text-slate-400 uppercase text-xs tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-slate-800 hover:bg-slate-800 transition"
                >
                  <td className="p-4 text-white font-medium">
                    #{ticket.id}
                  </td>

                  <td className="p-4 text-slate-200">
                    {ticket.title}
                  </td>

                  <td className="p-4">
                    {getCategoryBadge(
                      ticket.category
                    )}
                  </td>

                  <td className="p-4">
                    {getPriorityBadge(
                      ticket.priority
                    )}
                  </td>

                  <td className="p-4">
                    {getStatusBadge(
                      ticket.status
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          onRecommendation(
                            ticket.description
                          )
                        }
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                      >
                        AI Suggestion
                      </button>

                      {ticket.status === "CLOSED" ? (
                      <button
                        disabled
                        className="bg-slate-700 text-slate-400 px-3 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setSelectedTicket(ticket.id)
                        }
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                      >
                        Resolve
                      </button>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[500px]">
            <h2 className="text-xl font-semibold text-white mb-4">
              Resolve Ticket #{selectedTicket}
            </h2>

            <textarea
              value={resolution}
              onChange={(e) =>
                setResolution(
                  e.target.value
                )
              }
              placeholder="Enter resolution notes..."
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedTicket(
                    null
                  );
                  setResolution("");
                }}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    setLoading(true);

                    await axios.post(
                      `http://localhost:8000/tickets/${selectedTicket}/resolve`,
                      {
                        resolution,
                      }
                    );

                    window.location.href = "/";
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                {loading
                  ? "Saving..."
                  : "Save Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Shield,
  CreditCard,
  Wrench,
  Ticket,
} from "lucide-react";

import StatCard from "../components/StatCard";
import TicketTable from "../components/TicketTable";
import RecommendationModal from "../components/RecommendationModal";

type Analytics = {
  total_tickets: number;
  security: number;
  billing: number;
  technical: number;
  high_priority: number;
  open_tickets: number;
  closed_tickets: number;
  resolution_rate: number;
};
type TicketType = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
};

export default function Home() {
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [tickets, setTickets] =
    useState<TicketType[]>([]);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [recommendation, setRecommendation] =
    useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/analytics")
      .then((res) => setAnalytics(res.data))
      .catch(console.error);

    axios
      .get("http://localhost:8000/tickets")
      .then((res) => setTickets(res.data))
      .catch(console.error);
  }, []);

  const handleRecommendation = async (
    description: string
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/tickets/recommendation",
        null,
        {
          params: {
            description,
          },
        }
      );

      setRecommendation(
        response.data.recommended_resolution
      );

      setModalOpen(true);

    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <h1 className="text-xl font-semibold text-white">
          Loading dashboard...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          SupportFlowAI
        </h1>

        <p className="text-slate-400 mt-2">
          AI-Powered Support Operations Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={analytics.total_tickets}
          icon={<Ticket size={32} />}
        />

        <StatCard
          title="Security"
          value={analytics.security}
          icon={<Shield size={32} />}
        />

        <StatCard
          title="Billing"
          value={analytics.billing}
          icon={<CreditCard size={32} />}
        />

        <StatCard
          title="Technical"
          value={analytics.technical}
          icon={<Wrench size={32} />}
        />
      </div>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Ticket Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 text-sm">
              Open Tickets
            </p>

            <p className="text-3xl font-bold mt-2">
              {analytics.open_tickets}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Closed Tickets
            </p>

            <p className="text-3xl font-bold text-red-400 mt-2">
              {analytics.closed_tickets}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Resolution Rate
            </p>

            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {analytics.resolution_rate}%
            </p>
          </div>
        </div>
      </div>

      <TicketTable
        tickets={tickets}
        onRecommendation={handleRecommendation}
      />

      <RecommendationModal
        open={modalOpen}
        recommendation={recommendation}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}


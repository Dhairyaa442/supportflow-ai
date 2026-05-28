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

type Analytics = {
  total_tickets: number;
  security: number;
  billing: number;
  technical: number;
  high_priority: number;
  open_tickets: number;
};

type TicketType = {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
};

export default function Home() {
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [tickets, setTickets] =
    useState<TicketType[]>([]);

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

  if (!analytics) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <h1 className="text-xl font-semibold">
          Loading dashboard...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">
          SupportFlowAI
        </h1>

        <p className="text-gray-500 mt-2">
          AI-Powered Support Ticket Intelligence Platform
        </p>
      </div>

      {/* KPI Cards */}
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

      {/* Analytics Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Ticket Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm">
              Open Tickets
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {analytics.open_tickets}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              High Priority Tickets
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {analytics.high_priority}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Resolution Rate
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              0%
            </p>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <TicketTable tickets={tickets} />
    </main>
  );
}


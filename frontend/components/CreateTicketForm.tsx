"use client";

import { useState } from "react";
import axios from "axios";

type Props = {
  onTicketCreated: () => void;
};

export default function CreateTicketForm({
  onTicketCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    if (!title || !description) return;

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8000/tickets",
        {
          title,
          description,
        }
      );

      setTitle("");
      setDescription("");

      onTicketCreated();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Create Ticket
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Ticket Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
        />

        <textarea
          rows={4}
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-medium"
        >
          {loading
            ? "Creating..."
            : "Create Ticket"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  if (loading) return <p className="p-6">Loading messages…</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      {messages.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">No messages found yet.</p>
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-200 rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-3 text-left">Name</th>
              <th className="border border-gray-200 p-3 text-left">Email</th>
              <th className="border border-gray-200 p-3 text-left">Message</th>
              <th className="border border-gray-200 p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3">{msg.name}</td>
                <td className="border border-gray-200 p-3">{msg.email}</td>
                <td className="border border-gray-200 p-3">{msg.message}</td>
                <td className="border border-gray-200 p-3">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

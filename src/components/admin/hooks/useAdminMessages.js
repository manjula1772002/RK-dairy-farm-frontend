"use client";

import { useEffect, useState } from "react";

export function useAdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        // const res = await fetch("/api/messages");
        //  const res = await fetch("http://localhost:5000/messages");
         const proxyUrl = process.env.PROXY_URL || "http://localhost:5000";

      const res = await fetch(`${proxyUrl}/messages`);
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

  return { messages, loading, error };
}

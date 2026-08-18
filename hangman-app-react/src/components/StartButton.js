"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./StartButton.module.css";

export default function StartButton({ onCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleCreate() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/game/new/", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error((errJson && errJson.error) || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (onCreated) {
        try { onCreated(data); } catch (e) { /* ignore */ }
      }
      if (data && data.game_id) {
        try { router.push(`/game/${data.game_id}`); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className={styles.rootButton}
        onClick={handleCreate}
        disabled={loading}
        aria-disabled={loading}
      >
        {loading ? "Starting..." : "Start New Game"}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import styles from "./GuessInput.module.css";

export default function GuessInput({ gameId, onUpdate, disabled = false }) {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submitGuess() {
    if (disabled) return;
    setError(null);
    const l = (letter || "").trim();
    if (l.length !== 1 || !/^[A-Za-z]$/.test(l)) {
      setError("Please enter a single letter (A-Z).");
      return;
    }

    setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/game/${gameId}/guess/?letter=${encodeURIComponent(
        l
      )}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((json && (json.error || json.message)) || `HTTP ${res.status}`);
      }

      if (onUpdate) onUpdate(json);
      setLetter("");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitGuess();
    }
  }

  return (
    <div className={styles.container}>
      <label>
        <input
          type="text"
          maxLength={1}
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          onKeyDown={onKeyDown}
          className={styles.input}
          disabled={disabled || loading}
        />
      </label>
      <button onClick={submitGuess} disabled={disabled || loading} className={styles.button}>
        {loading ? "Sending..." : "Guess"}
      </button>
      {disabled && <div className={styles.note}>No more guesses allowed.</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

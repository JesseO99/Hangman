"use client";

import React, { useState, useEffect } from "react";
import Key from "./Key";
import styles from "./Keyboard.module.css";

const QWERTY_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

export default function Keyboard({ gameId, initialDisabledLetters = "", disabled = false, onUpdate, currentGuessedWord = "" }) {
  const [statuses, setStatuses] = useState(() => {
    const map = {};
    (initialDisabledLetters || "").split("").forEach((c) => {
      if (!c) return;
      map[c.toUpperCase()] = "disabled";
    });
    return map;
  });

  useEffect(() => {
    // when initialDisabledLetters changes, reinitialize
    const map = {};
    (initialDisabledLetters || "").split("").forEach((c) => {
      if (!c) return;
      map[c.toUpperCase()] = "disabled";
    });
    setStatuses((s) => ({ ...map, ...s }));
  }, [initialDisabledLetters]);

  async function press(letter) {
    if (!gameId) return;
    const upLetter = letter.toUpperCase();
    // prevent re-press
    if (statuses[upLetter]) return;
    // optimistically set disabled while request in flight
    setStatuses((prev) => ({ ...prev, [upLetter]: "disabled" }));
    const prevGuessed = String(currentGuessedWord || "");

    try {
      const url = `http://127.0.0.1:8000/game/${gameId}/guess/?letter=${encodeURIComponent(letter)}`;
      const res = await fetch(url, { method: "POST", headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        // determine correctness by comparing returned guessed_word with previous
        const newGuessed = String((json && (json.guessed_word || json.word)) || "");
        const letterLower = letter.toLowerCase();
        const changed = newGuessed.toLowerCase() !== prevGuessed.toLowerCase();
        const contains = newGuessed.toLowerCase().includes(letterLower);
        if (changed && contains) {
          setStatuses((prev) => ({ ...prev, [upLetter]: "success" }));
        } else {
          setStatuses((prev) => ({ ...prev, [upLetter]: "fail" }));
        }
      } else {
        setStatuses((prev) => ({ ...prev, [upLetter]: "fail" }));
      }
      if (onUpdate) onUpdate(json);
    } catch (e) {
      setStatuses((prev) => ({ ...prev, [upLetter]: "fail" }));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.rows}>
        {QWERTY_ROWS.map((row, ri) => (
          <div key={ri} className={styles.row}>
            {row.map((l) => (
              <Key
                key={l}
                letter={l}
                status={statuses[l] || "idle"}
                disabled={disabled}
                onPress={press}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

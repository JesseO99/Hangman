"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import GuessInput from "./GuessInput";
import Keyboard from "./Keyboard";
import GuessedWord from "./GuessedWord";
import WinModal from "./WinModal";
import LostModal from "./LostModal";
import StartButton from "./StartButton";
import styles from "./Game.module.css";

export default function Game({ initialGameId = null }) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [game, setGame] = useState(null);
  const [showWin, setShowWin] = useState(false);
  const [showLost, setShowLost] = useState(false);

  async function fetchGameState(id) {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/game/${id}/`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error((errJson && errJson.error) || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setGame(data);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (game) {
      const state = String(game.current_state || "").toLowerCase();
      if (state === "w" || state === "won") {
        setShowWin(true);
      } else {
        setShowWin(false);
      }
      if (state === "l" || state === "lost") {
        setShowLost(true);
      } else {
        setShowLost(false);
      }
    }
  }, [game]);

  useEffect(() => {
    if (initialGameId) {
      fetchGameState(initialGameId);
    }
  }, [initialGameId]);

  const content = (
    <div className={styles.section}>
      {error && <div className={styles.error}>Error: {error}</div>}

      {game && (
        <div className={styles.section}>
          {/* display boxes for the guessed word */}
          {(() => {
            const display = (game.guessed_word && game.guessed_word.length > 0 ? game.guessed_word : game.word) || "";
            return <GuessedWord display={display} />;
          })()}
          <div className={styles.note}>Guesses Left: {game.guesses_left ?? game.max_incorrect_guesses}</div>
          <Keyboard
            gameId={game.game_id || initialGameId}
            initialDisabledLetters={game.guessed_letters}
            currentGuessedWord={game.guessed_word}
            disabled={!!(game.current_state && (String(game.current_state).toLowerCase() === "w" || String(game.current_state).toLowerCase() === "l"))}
            onUpdate={(data) => setGame((prev) => ({ ...(prev || {}), ...data }))}
          />
        </div>
      )}

      {showWin && (
        <WinModal
          message="Congratulations. You have won the game"
          onClose={() => setShowWin(false)}
        />
      )}
      {showLost && (
        <LostModal
          message="Sorry, you lost the game"
          onClose={() => setShowLost(false)}
        />
      )}
    </div>
  );

  const pathname = usePathname();
  const isRoot = pathname === "/" || pathname === "" || pathname == null;

  return (
    <div className={styles.root}>
      {content}
      {!isRoot && (
        <div className={styles.controls}>
          <StartButton onCreated={(data) => setGame(data)} />
        </div>
      )}
    </div>
  );
}

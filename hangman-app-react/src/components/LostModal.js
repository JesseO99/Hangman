"use client";

import React from "react";
import styles from "./LostModal.module.css";

export default function LostModal({ message = "Sorry, you lost the game", onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>Game Over</h2>
        <p>{message}</p>
        <div className={styles.actions}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

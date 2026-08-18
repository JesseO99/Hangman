"use client";

import React from "react";
import styles from "./WinModal.module.css";

export default function WinModal({ message = "Congratulations. You have won the game", onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>Congratulations</h2>
        <p>{message}</p>
        <div className={styles.actions}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

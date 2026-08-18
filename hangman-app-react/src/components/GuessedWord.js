"use client";

import React from "react";
import styles from "./GuessedWord.module.css";

export default function GuessedWord({ display = "" }) {
  const chars = (display || "").split("");

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {chars.map((ch, i) => (
          <div key={i} className={styles.charBox}>
            {ch}
          </div>
        ))}
      </div>
    </div>
  );
}

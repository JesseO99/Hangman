"use client";

import React, { useState } from "react";
import styles from "./Key.module.css";

export default function Key({ letter, status = "idle", onPress, disabled = false }) {
  const [hover, setHover] = useState(false);

  const baseColor = (() => {
    if (status === "success") return "#4caf50"; // green
    if (status === "fail") return "#f44336"; // red
    if (status === "disabled") return "#ddd"; // gray
    return "#fff"; // default
  })();

  // Use a fixed text color for keys; background varies by status.
  const textColor = '#000';

  const hoverModifier = hover && status === "idle" ? "rgba(0,0,0,0.06)" : "transparent";

  return (
    <button
      aria-label={`key-${letter}`}
      className={`${styles.key} ${disabled || status === "disabled" ? styles.disabled : ""}`}
      onClick={() => !disabled && status !== "disabled" && onPress && onPress(letter)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled || status === "disabled"}
      style={{ background: baseColor, color: textColor, boxShadow: hover ? "0 2px 6px rgba(0,0,0,0.08)" : "none" }}
    >
      {letter}
      {hover && hoverModifier !== "transparent" && (
        <span className={styles.overlay} style={{ background: hoverModifier }} />
      )}
    </button>
  );
}

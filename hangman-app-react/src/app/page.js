"use client";

import React from "react";
import styles from "./page.module.css";
import StartButton from "../components/StartButton";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.startWrapper}>
        <StartButton />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useParams } from "next/navigation";
import Game from "../../../components/Game";

export default function GamePage() {
  const params = useParams();
  const id = params?.id;

  return <Game initialGameId={id} />;
}

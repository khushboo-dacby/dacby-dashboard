"use client";

import React, { use } from "react";
import LedgerDetail from "./LedgerDetail";

export default function LedgerPage({ params }) {
  const unwrappedParams = use(params);
  return <LedgerDetail id={unwrappedParams.id} />;
}

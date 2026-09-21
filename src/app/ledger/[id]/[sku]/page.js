"use client";

import React, { use } from "react";
import LedgerEntries from "./LedgerEntries";

export default function LedgerEntriesPage({ params }) {
  const unwrappedParams = use(params);
  return <LedgerEntries id={unwrappedParams.id} sku={unwrappedParams.sku} />;
}

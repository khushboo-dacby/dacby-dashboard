"use client";

import { createContext, useContext } from "react";

// Derived from the existing DACBY operations screens: deep navy workspaces,
// indigo actions, teal operational highlights, and quiet blue-grey surfaces.
export const analyticsPalette = {
  brand: {
    navy: "#102449",
    navySoft: "#1C3768",
    navyPanel: "#2A2D6F",
    indigo: "#3D55D9",
    blue: "#2A67EC",
    violet: "#704CF3",
    teal: "#13B89B",
  },
  surface: {
    canvas: "#F6F8FC",
    card: "#FFFFFF",
    subtle: "#F2F5FA",
    selected: "#EEF3FF",
    information: "#EDF5FF",
    border: "#DCE5F1",
    borderStrong: "#C7D5E8",
  },
  text: {
    primary: "#151D35",
    secondary: "#53647F",
    muted: "#8190A9",
    inverse: "#FFFFFF",
    onDarkMuted: "#C5D2E8",
  },
  status: {
    success: "#16B879",
    successSoft: "#ECFBF3",
    successBorder: "#B7F1CD",
    warning: "#C87513",
    warningSoft: "#FFF8E9",
    warningBorder: "#F4D877",
    danger: "#D34D5D",
    dangerSoft: "#FFF0F2",
    dangerBorder: "#F5C2CA",
    info: "#2A67EC",
    infoSoft: "#EDF3FF",
    infoBorder: "#C9DCFF",
  },
  chart: {
    primary: "#2A67EC",
    secondary: "#13B89B",
    tertiary: "#704CF3",
    quaternary: "#55A7F7",
    positive: "#16B879",
    warning: "#E8AD37",
    negative: "#E06475",
    grid: "#DCE5F1",
    axis: "#8190A9",
    sequence: ["#2A67EC", "#13B89B", "#704CF3", "#55A7F7", "#E8AD37", "#E06475"],
  },
  gradients: {
    hero: "linear-gradient(100deg, #102449 0%, #1C3768 52%, #1E5D74 100%)",
    primary: "linear-gradient(135deg, #2A67EC 0%, #704CF3 100%)",
    teal: "linear-gradient(135deg, #13B89B 0%, #2A67EC 100%)",
  },
};

const AnalyticsPaletteContext = createContext(analyticsPalette);

export function AnalyticsPaletteProvider({ children }) {
  return (
    <AnalyticsPaletteContext.Provider value={analyticsPalette}>
      {children}
    </AnalyticsPaletteContext.Provider>
  );
}

export function useAnalyticsPalette() {
  return useContext(AnalyticsPaletteContext);
}

export default AnalyticsPaletteContext;

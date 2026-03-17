import React from "react";
import { LanguageProvider } from "./app/LanguageContext";
import Dashboard from "./app/_layout";

export default function App() {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
}
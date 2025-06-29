// Developed by John Joyel

import React from "react";
import LiveView from "../components/LiveView";

export default function LiveViewPage() {
  return <LiveView onClose={() => window.history.back()} />;
}


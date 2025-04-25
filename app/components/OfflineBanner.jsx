"use client";
import React, { useState, useEffect } from "react";
import { useNetworkStatus } from "../lib/networkStatus";
import { isServerAvailable } from "../lib/serverCheck";

export default function OfflineBanner() 
{
  const [hasMounted, setHasMounted] = useState(false);
  const isOnline = useNetworkStatus();
  const [serverUp, setServerUp] = useState(true);

  useEffect(() => 
  {
    setHasMounted(true);
    if (isOnline) isServerAvailable().then(setServerUp);
  }, [isOnline]);

  // Prevent rendering before client-side hydration is complete.
  if (!hasMounted) return null;

  if (isOnline && serverUp) return null;

  return (
    <div style={{ background: "#ffcc00", padding: "0.5rem", textAlign: "center" }}>
      {!isOnline && <p>You are offline.</p>}
      {isOnline && !serverUp && <p>Server is unreachable.</p>}
    </div>
  );
}

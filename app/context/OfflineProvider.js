"use client";
import React, { createContext, useEffect, useState } from "react";
import { useNetworkStatus } from "../lib/networkStatus";
import { isServerAvailable } from "../lib/serverCheck";
import { syncPendingOperations } from "../lib/syncOperations";

export const OfflineContext = createContext();

export default function OfflineProvider({ children }) 
{
  const isOnline = useNetworkStatus();
  const [serverUp, setServerUp] = useState(true);

  useEffect(() => 
  {
    if (isOnline) 
    {
      isServerAvailable().then(setServerUp);
    }
  }, [isOnline]);

  useEffect(() => 
  {
    if (isOnline && serverUp) syncPendingOperations();
  }, [isOnline, serverUp]);

  return (
    <OfflineContext.Provider value={{ isOnline, serverUp }}>
      {children}
    </OfflineContext.Provider>
  );
}

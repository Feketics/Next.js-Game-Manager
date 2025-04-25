"use client";
import dynamic from "next/dynamic";

// Dynamically import OfflineBanner with SSR disabled.
const OfflineBanner = dynamic(() => import("./OfflineBanner"), { ssr: false });

export default function ClientOfflineBanner() 
{
  return <OfflineBanner />;
}
// app/layout.js
import { Lemonada } from 'next/font/google';
import OfflineProvider from "./context/OfflineProvider";
import ClientOfflineBanner from "./components/ClientOfflineBanner";

// Import the Lemonada font with desired options (you can adjust weights/subsets)
const lemonada = Lemonada({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Game Manager',
  description: 'Manage your game collection.',
}

export default function RootLayout({ children }) 
{
  return (
    <html lang="en" className={lemonada.className}>
      <body>
        <OfflineProvider>
          {/* This ClientOfflineBanner is now imported via a client-only wrapper */}
          <ClientOfflineBanner />
          {children}
        </OfflineProvider>
      </body>
    </html>
  );
}
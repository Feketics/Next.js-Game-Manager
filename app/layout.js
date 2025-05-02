// app/layout.js
import { Lemonada } from 'next/font/google';
import Nav from './components/Nav';
import OfflineProvider from "./context/OfflineProvider";
import ClientOfflineBanner from "./components/ClientOfflineBanner";

const lemonada = Lemonada({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Game Manager',
  description: 'Manage your game collection.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lemonada.className}>
      <body>
        <OfflineProvider>
          <Nav />

          {/* Offline banner */}
          <ClientOfflineBanner />

          {/* Main content */}
          {children}
        </OfflineProvider>
      </body>
    </html>
  );
}

// app/layout.js
import { Lemonada } from 'next/font/google';
import Link from 'next/link';
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
          {/* Navigation Links */}
          <nav style={{ padding: '1rem', backgroundColor: '#ececec', display: 'flex', gap: '5rem' }}>
            <Link href="/">Home</Link>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
            <Link href="/account">Account</Link>
          </nav>

          {/* Offline banner */}
          <ClientOfflineBanner />

          {/* Main content */}
          {children}
        </OfflineProvider>
      </body>
    </html>
  );
}

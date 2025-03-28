// app/layout.js
import { Lemonada } from 'next/font/google';

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
        {children}
      </body>
    </html>
  )
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [role, setRole] = useState(null);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();

useEffect(() => {
    setChecked(false);
    fetch('/api/users/me', { cache: 'no-store' })
        .then(res => {
            if (!res.ok) {
              setRole(null);
            } else {
              return res.json().then(u => setRole(u.role_id));
            }
        })
        .catch(() => setRole(null))
        .finally(() => setChecked(true));
}, [pathname]);   // ← re-run on every route change
    
if (!checked) return null;
    
return (
    <nav style={{ padding: '1rem', backgroundColor: '#ececec', display: 'flex', gap: '1rem' }}>
        <Link href="/">Home</Link>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
        <Link href="/account">Account</Link>
        {role === 1 && <Link href="/monitored-users">Monitored Users</Link>}
    </nav>
);
}
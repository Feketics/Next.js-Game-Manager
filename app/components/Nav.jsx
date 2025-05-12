'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Nav() {
  const pathname = usePathname();
  // don’t even check auth on these pages
  const publicPaths = ['/login', '/register'];
  const skipAuth = publicPaths.includes(pathname);

  const [role, setRole] = useState(null);
  const [checked, setChecked] = useState(skipAuth);

  useEffect(() => {
    if (skipAuth) return;            // skip fetching on login/register
    setChecked(false);
    fetch('/api/users/me', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) return setRole(null);
        return res.json().then(u => setRole(u.role_id));
      })
      .catch(() => setRole(null))
      .finally(() => setChecked(true));
  }, [pathname, skipAuth]);

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
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MonitoredUsersPage() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/monitored-users')
      .then(res => {
        if (res.status === 403) return router.push('/');
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(() => setErr('Could not load monitored users.'));
  }, []);

  return (
    <div style={{
      backgroundColor: "#60CA9F",
      padding: "4rem",
      minHeight: "100vh",
    }}>
      <div style={{
        backgroundColor: '#D9D9D9',
        padding: "2rem",
        borderRadius: "25px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: "400px",
      }}>
            <h2>⚠️ Monitored Users</h2>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            {users.length === 0 ? (
                <p>No suspicious activity detected.</p>
            ) : (
                <ul>
                {users.map(u => (
                    <li key={u.id}>
                    <strong>{u.username}</strong> — flagged at {new Date(u.detected_at).toLocaleString()}
                    </li>
                ))}
                </ul>
            )}
        </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [u,p,m] = [useState(''), useState(''), useState('')];
  const router = useRouter();

  useEffect(() => {
    fetch('/api/users/me').then(r => {
      if (!r.ok) return router.push('/login');
      return r.json().then(setUser);
    });
  }, []);

  const onUpdate = async () => {
    const res = await fetch('/api/users/me', {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: u[0] || undefined, password:p[0]||undefined })
    });
    if (res.ok) {
      setUser(prev => ({ ...prev, username: u[0] || prev.username }));
      m[1]('Updated!');
    } else m[1]('Update failed');
  };

  const onDelete = async () => {
    await fetch('/api/users/me', { method:'DELETE' });
    router.push('/login');
  };

  const onLogout = async () => {
    await fetch('/api/auth/logout', { method:'POST' });
    router.push('/login');
  };

  if (!user) return null;
  return (
    
    <div style=
    {{
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
          <h2>Account</h2>
          <p>Username: {user.username}</p>
          <label>
            New username:<br/>
            <input value={u[0]} onChange={e=>u[1](e.target.value)} />
          </label>
          <br/>
          <label>
            New password:<br/>
            <input type="password" value={p[0]} onChange={e=>p[1](e.target.value)} />
          </label>
          <br/><br/>
          <button onClick={onUpdate} style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "20px",
                fontFamily: 'Lemonada',
                fontSize: "1.1rem",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}>Update</button> {m[0] && <span>{m[0]}</span>}
          <br/><br/>
          <button onClick={onLogout} style={{
              marginLeft: "1rem",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "20px",
              fontFamily: 'Lemonada',
              fontSize: "1.1rem",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}>Logout</button>
          <button onClick={onDelete} style={{
              marginLeft: "1rem",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "20px",
              fontFamily: 'Lemonada',
              fontSize: "1.1rem",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}>Delete Account</button>
        </div>
    </div>
  );
}

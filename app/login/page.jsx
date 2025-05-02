'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [u,p,e] = [useState(''),useState(''),useState('')];
  const router = useRouter();

  const onSubmit = async (e2) => {
    e2.preventDefault();
    const res = await fetch('/api/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: u[0], password: p[0] })
    });
    if (res.ok) router.push('/');
    else e[1]('Invalid credentials');
  };

  return (
    <div style={{
      backgroundColor: "#60CA9F",
      padding: "1rem",
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
    }}>
      <form onSubmit={onSubmit} style={{
          backgroundColor: '#D9D9D9',
          padding: "2rem",
          borderRadius: "25px",
          minWidth: "300px",
          minHeight: "300px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
        <h2>Login</h2>
        <input value={u[0]} onChange={e=>u[1](e.target.value)} placeholder="Username" style={{fontFamily: 'Lemonada',}} /><br/><br/>
        <input type="password" value={p[0]} onChange={e=>p[1](e.target.value)} placeholder="Password" style={{fontFamily: 'Lemonada',}} /><br/><br/>
        <button type="submit" style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "20px",
                fontFamily: 'Lemonada',
                fontSize: "1.1rem",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}>Login</button>
        {e[0] && <p style={{color:'red'}}>{e[0]}</p>}
      </form>
    </div>
  );
}

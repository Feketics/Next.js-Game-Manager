'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [stage, setStage] = useState('credentials'); // 'credentials' or 'otp'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]         = useState('');
  const [userId, setUserId]   = useState(null);
  const [error, setError]     = useState('');
  const [devOtp, setDevOtp]   = useState(null); // display OTP in dev
  const router = useRouter();

  const submitCredentials = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setError('Invalid credentials'); return;
    }
    const { requires2fa, userId, otp } = await res.json();
    if (requires2fa) {
      setUserId(userId);
      setDevOtp(otp);       // show for dev only
      setStage('otp');
      setUsername('');
      setPassword('');
    } else {
      router.push('/');
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code: otp }),
    });
    if (!res.ok) {
      setError(await res.text()); return;
    }
    router.push('/');
  };

  return (
    <div style={{
      backgroundColor: "#60CA9F",
      padding: "1rem",
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
    }}>
      {stage === 'credentials' ? (
        <form onSubmit={submitCredentials} style={{
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
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" style={{fontFamily: 'Lemonada',}}/><br/><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{fontFamily: 'Lemonada',}}/><br/><br/>
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
          {error && <p style={{ color:'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={submitOtp} style={{
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
          <h2>Enter OTP</h2>
          <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit code" style={{fontFamily: 'Lemonada',}}/><br/><br/>
          <button type="submit" style={{
                  marginLeft: "1rem",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "20px",
                  fontFamily: 'Lemonada',
                  fontSize: "1.1rem",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}>Verify</button>
          {error && <p style={{ color:'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}
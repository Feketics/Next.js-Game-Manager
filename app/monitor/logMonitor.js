import { query } from '../lib/db.js';

const THRESHOLD = 5;          // More than 5 operations...
const INTERVAL_MINUTES = 2;   // ...in 2 minutes is suspicious

async function detectSuspiciousUsers() {
  const res = await query(
    `
    SELECT user_id
    FROM game_logs
    WHERE performed_at >= NOW() - INTERVAL '${INTERVAL_MINUTES} minutes'
    GROUP BY user_id
    HAVING COUNT(*) > $1
    `,
    [THRESHOLD]
  );

  const suspicious = res.rows.map(r => r.user_id);

  if (suspicious.length) {
    await Promise.all(
      suspicious.map(uid =>
        query(
          `INSERT INTO monitored_users (user_id)
           VALUES ($1)
           ON CONFLICT (user_id) DO NOTHING`,
          [uid]
        )
      )
    );
    console.log(`Logged suspicious users: ${suspicious.join(', ')}`);
  }
}

export function startLogMonitor() {
  setInterval(detectSuspiciousUsers, INTERVAL_MINUTES * 60 * 1000);
}

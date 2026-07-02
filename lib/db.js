import { Pool } from 'pg';

// Explicitly log this to your terminal window so you can see if it's reading your password!
console.log("DEBUG: Connecting to DB with user:", process.env.DB_USER, "Has password:", !!process.env.DB_PASSWORD);

const pool = new Pool({
  host: String(process.env.DB_HOST || 'localhost'),
  user: String(process.env.DB_USER || 'postgres'),
  // Force cast to string to satisfy the SASL SCRAM verification requirement
  password: String(process.env.DB_PASSWORD || ''), 
  database: String(process.env.DB_NAME || ''),
  port: Number(process.env.DB_PORT) || 5432,
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('► Database query executed', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Database Query Error:', error);
    throw error;
  }
}
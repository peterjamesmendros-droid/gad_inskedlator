import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('► Database query executed', {
      text,
      duration,
      rows: res.rowCount,
    });
    return res;
  } catch (error) {
    console.error('❌ Database Query Error:', error);
    throw error;
  }
}
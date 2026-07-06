// USE CODE line 3-31 if line 33-57 is not working. Then do the same if line 3-31 is not working.
// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  // Uses your local setup variable
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Mandated for serverless cloud connection layers like Neon
  },
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Clean analytics monitoring string
    console.log('► Database query executed', {
      text,
      duration: `${duration}ms`,
      rows: res.rowCount,
    });
    
    return res;
  } catch (error) {
    console.error('❌ Database Query Error:', error);
    throw error;
  }
}

/* import { Pool } from 'pg';

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
} */

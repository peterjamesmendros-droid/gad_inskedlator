import { Pool } from 'pg';

// Create a reusable connection pool using your secret .env.local string
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('► Database Query Executed:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Database Query Error:', error);
        throw error;
    }
}
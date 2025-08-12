// Database connection using Neon serverless driver
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the SQL client
export const sql = neon(process.env.DATABASE_URL);

// Note: Helper functions will be implemented once we have the correct Neon API usage
// For now, use sql directly with template literals: sql`SELECT * FROM users WHERE id = ${userId}` 
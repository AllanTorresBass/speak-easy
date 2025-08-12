// Database connection using Neon serverless driver
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the SQL client
export const sql = neon(process.env.DATABASE_URL);

// Helper function to execute queries with error handling
export async function executeQuery<T>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result = await sql(query, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function for single row queries
export async function executeQuerySingle<T>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  try {
    const result = await sql(query, params);
    return result.length > 0 ? (result[0] as T) : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function for insert/update/delete operations
export async function executeMutation(
  query: string,
  params: any[] = []
): Promise<{ rowCount: number }> {
  try {
    const result = await sql(query, params);
    return { rowCount: result.length || 0 };
  } catch (error) {
    console.error('Database mutation error:', error);
    throw new Error(`Database mutation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
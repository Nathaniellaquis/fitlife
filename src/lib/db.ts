import { sql } from '@vercel/postgres';

export async function query<T>(
  queryText: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    // Convert ? placeholders to $1, $2, etc. for Postgres
    let paramIndex = 0;
    const pgQuery = queryText.replace(/\?/g, () => `$${++paramIndex}`);
    
    const result = await sql.query(pgQuery, params || []);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryOne<T>(
  queryText: string,
  params?: unknown[]
): Promise<T | null> {
  const results = await query<T>(queryText, params);
  return results[0] ?? null;
}

export async function run(
  queryText: string,
  params?: unknown[]
): Promise<{ rowCount: number; lastInsertRowid?: number }> {
  try {
    // Convert ? placeholders to $1, $2, etc. for Postgres
    let paramIndex = 0;
    const pgQuery = queryText.replace(/\?/g, () => `$${++paramIndex}`);
    
    // For INSERT statements, add RETURNING to get the inserted ID
    let finalQuery = pgQuery;
    if (pgQuery.trim().toUpperCase().startsWith('INSERT')) {
      // Check if RETURNING already exists
      if (!pgQuery.toUpperCase().includes('RETURNING')) {
        finalQuery = pgQuery.replace(/;?\s*$/, ' RETURNING *');
      }
    }
    
    const result = await sql.query(finalQuery, params || []);
    
    // Try to extract the ID from common column names
    const insertedRow = result.rows[0];
    let lastInsertRowid: number | undefined;
    
    if (insertedRow) {
      // Check for common ID column names
      lastInsertRowid = insertedRow.ws_id || insertedRow.u_id || insertedRow.g_id || 
                        insertedRow.et_id || insertedRow.ach_id || insertedRow.pr_id ||
                        insertedRow.t_id || insertedRow.a_id || insertedRow.id;
    }
    
    return { 
      rowCount: result.rowCount ?? 0,
      lastInsertRowid 
    };
  } catch (error) {
    console.error('Database run error:', error);
    throw error;
  }
}

export default { query, queryOne, run };

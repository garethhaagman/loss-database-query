import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function createDatabase() {
  const db = await open({
    filename: 'legalcases.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS legalcases (
      id TEXT PRIMARY KEY,
      scraperSource TEXT,
      externalId TEXT,
      dateOfIncident TEXT,
      dateOfClaim TEXT,
      lawsuitReference TEXT,
      title TEXT,
      description TEXT,
      aiType TEXT,
      plaintiff TEXT,
      defendant TEXT,
      causeOfAction TEXT,
      jurisdiction TEXT,
      remedySought TEXT,
      compensationSought TEXT,
      settlementDate TEXT,
      settlementAmount TEXT,
      keyword TEXT,
      aiDeployer TEXT,
      documentLink TEXT
    )
  `);

  return db;
}

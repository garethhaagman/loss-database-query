import { Injectable, Logger } from '@nestjs/common';
import { Database } from 'sqlite';
import { createDatabase } from './setup-sqlite';
import { legalCasesData } from './data'; // Import the JSON data

@Injectable()
export class DatabaseQueryService {
  private db: Database;
  private readonly logger = new Logger(DatabaseQueryService.name);

  constructor() {
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      this.db = await createDatabase();
      this.logger.log('Database initialized successfully');
      await this.ingestData();
      await this.logTableSchema(); // Log the table schema after ingestion
    } catch (error) {
      this.logger.error('Failed to initialize database', error);
    }
  }

  async executeQuery(sqlQuery: string): Promise<any> {
    this.logger.log(`Executing SQL query: ${sqlQuery}`);
    try {
      const result = await this.db.all(sqlQuery);
      this.logger.log(`Query executed successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to execute SQL query: ${error.message}`);
      throw new Error('Failed to execute SQL query: ' + error.message);
    }
  }

  async insert(document: any) {
    this.logger.log(`Inserting document with id: ${document.id}`);
    const {
      id,
      scraperSource,
      externalId,
      dateOfIncident,
      dateOfClaim,
      lawsuitReference,
      title,
      description,
      aiType,
      plaintiff,
      defendant,
      causeOfAction,
      jurisdiction,
      remedySought,
      compensationSought,
      settlementDate,
      settlementAmount,
      keyword,
      aiDeployer,
      documentLink,
    } = document;
    
    await this.db.run(`
      INSERT OR REPLACE INTO legalcases (
        id, scraperSource, externalId, dateOfIncident, dateOfClaim, lawsuitReference, title, description,
        aiType, plaintiff, defendant, causeOfAction, jurisdiction, remedySought, compensationSought,
        settlementDate, settlementAmount, keyword, aiDeployer, documentLink
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, scraperSource, externalId, dateOfIncident, dateOfClaim, lawsuitReference, title, description,
      aiType, plaintiff, defendant, causeOfAction, jurisdiction, remedySought, compensationSought,
      settlementDate, settlementAmount, keyword, aiDeployer, JSON.stringify(documentLink)
    ]);
    this.logger.log(`Document with id ${document.id} inserted successfully`);
  }

  async insertMultiple(documents: any[]) {
    this.logger.log(`Inserting multiple documents. Count: ${documents.length}`);
    for (const document of documents) {
      await this.insert(document);
    }
    this.logger.log('Multiple documents inserted successfully');
  }

  async ingestData() {
    this.logger.log('Ingesting data from constant file');
    try {
      await this.insertMultiple(legalCasesData);
      this.logger.log('Data ingested successfully');
    } catch (error) {
      this.logger.error('Failed to ingest data', error);
    }
  }

  async logTableSchema() {
    this.logger.log('Logging table schema for legalcases');
    try {
      const schema = await this.db.all("PRAGMA table_info('legalcases')");
      this.logger.log(`Table schema: ${JSON.stringify(schema)}`);
    } catch (error) {
      this.logger.error('Failed to log table schema', error.message);
    }
  }
}

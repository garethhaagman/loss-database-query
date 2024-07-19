import { Injectable } from '@nestjs/common';
import { ModelInferenceService } from '../model-inference/model-inference.service';
import { DatabaseQueryService } from '../database-query/database-query.service';

@Injectable()
export class TalkToLossDatabaseService {
  constructor(
    private readonly modelInferenceService: ModelInferenceService,
    private readonly databaseQueryService: DatabaseQueryService,
  ) {}

  async processNaturalLanguageQuery(query: string) {
    const currentDatetime = new Date().toISOString();
    const prompt = `
    You are an intelligent assistant that converts natural language queries into SQL queries. The SQL queries will be run against a database that contains information about previous legal cases related to AI mishaps. The database has the following fields:
    - id: The unique identifier for the case
    - scraperSource: The source of the scraper
    - externalId: The external ID of the case
    - dateOfIncident: The date when the incident occurred
    - dateOfClaim: The date when the claim was made
    - lawsuitReference: The reference to the lawsuit
    - title: The title of the case
    - description: The description of the case
    - aiType: The type of AI involved
    - plaintiff: The name of the plaintiff
    - defendant: The name of the defendant involved in the incident
    - causeOfAction: The cause of action in the case
    - jurisdiction: The jurisdiction of the case
    - remedySought: The remedy sought in the case
    - compensationSought: The compensation sought in the case
    - settlementDate: The date when the case was settled
    - settlementAmount: The amount for which the case was settled
    - keyword: Keywords associated with the case
    - aiDeployer: The deployer of the AI
    - documentLink: Links to related documents

    The current date and time is: ${currentDatetime}

    Here are some example records in the database:
    1. title: Waymo Software Flaw Leads to Double Collision with Tow Truck
       dateOfIncident: 2023-12-11
       dateOfClaim: 2023-12-12
       defendant: waymo

    2. title: Amazon Flex Drivers Allegedly Fired via Automated Employee Evaluations
       dateOfIncident: 2015-09-25
       dateOfClaim: 2015-09-26
       defendant: amazon-flex

    3. title: Facebook AI Misclassification Causes Major Outrage
       dateOfIncident: 2017-10-17
       dateOfClaim: 2017-10-18
       defendant: facebook

    Use the following examples to understand how to convert natural language questions into SQL queries:

    Example 1:
    USER
    Name cases that have occurred in the last year.

    SQL
    SELECT * FROM legalcases
    WHERE dateOfIncident >= DATE('now', '-1 year');

    Example 2:
    USER
    Have any cases affected OpenAI?

    SQL
    SELECT * FROM legalcases
    WHERE defendant LIKE '%openai%';

    Example 3:
    USER
    List incidents involving Waymo.

    SQL
    SELECT * FROM legalcases
    WHERE defendant LIKE '%waymo%';

    Example 4:
    USER
    Show all cases filed against Amazon Flex.

    SQL
    SELECT * FROM legalcases
    WHERE defendant LIKE '%amazon-flex%';

    Example 5:
    USER
    What incidents happened before 2016?

    SQL
    SELECT * FROM legalcases
    WHERE dateOfIncident < '2016-01-01';

    Example 6:
    USER
    Give me all claims made in 2017.

    SQL
    SELECT * FROM legalcases
    WHERE strftime('%Y', dateOfClaim) = '2017';

    Example 7:
    USER
    List all cases involving Facebook.

    SQL
    SELECT * FROM legalcases
    WHERE defendant LIKE '%facebook%';

    Example 8:
    USER
    Show incidents that happened after 2020.

    SQL
    SELECT * FROM legalcases
    WHERE dateOfIncident > '2020-01-01';

    When you are asked a natural language question, convert it into an appropriate SQL query considering the context and examples provided.

    USER
    ${query}

    SQL
    `;

    const rawSqlQuery = await this.modelInferenceService.query(prompt);
    const cleanedSqlQuery = this.cleanSqlQuery(rawSqlQuery);
    const transformedSqlQuery = this.transformToSQLite(cleanedSqlQuery);
    const queryResults = await this.databaseQueryService.executeQuery(transformedSqlQuery);
    return {
      naturalLanguageQuery: query,
      sqlQuery: transformedSqlQuery,
      results: queryResults,
    };
  }

  cleanSqlQuery(rawSqlQuery: string): string {
    // Remove backticks and any markdown code block indicators
    return rawSqlQuery.replace(/```sql/g, '').replace(/```/g, '').trim();
  }

  transformToSQLite(sqlQuery: string): string {
    // Transform MySQL specific SQL functions to SQLite compatible functions
    return sqlQuery
      .replace(/DATE_SUB\('([^']*)', INTERVAL ([^ ]*) (YEAR|MONTH|DAY)\)/g, (_, date, interval, unit) => {
        const units = {
          YEAR: 'year',
          MONTH: 'month',
          DAY: 'day',
        };
        return `DATE('${date}', '-${interval} ${units[unit]}')`;
      });
  }
}

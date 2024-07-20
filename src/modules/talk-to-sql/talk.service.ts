import { Injectable, Logger } from '@nestjs/common';
import { ModelInferenceService } from '../model-inference/model-inference.service';
import { DatabaseQueryService } from '../database-query/database-query.service';

@Injectable()
export class TalkToLossDatabaseService {
  private readonly logger = new Logger(TalkToLossDatabaseService.name);

  constructor(
    private readonly modelInferenceService: ModelInferenceService,
    private readonly databaseQueryService: DatabaseQueryService,
  ) {}

  async processNaturalLanguageQuery(query: string) {
    this.logger.debug(`User's query: ${query}`);
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

    // Log the prompt sent to OpenAI
    this.logger.debug(`Prompt sent to OpenAI: ${prompt}`);

    // Get the SQL query from OpenAI
    const rawSqlQuery = await this.modelInferenceService.query(prompt);
    this.logger.debug(`SQL query response from OpenAI API: ${rawSqlQuery}`);

    const cleanedSqlQuery = this.cleanSqlQuery(rawSqlQuery);
    const transformedSqlQuery = this.transformToSQLite(cleanedSqlQuery);

    // Log the transformed SQL query
    this.logger.debug(`Transformed SQL query: ${transformedSqlQuery}`);

    // Execute the SQL query on the database
    const queryResults = await this.databaseQueryService.executeQuery(transformedSqlQuery);
    this.logger.debug(`Result of the SQL query on the database: ${JSON.stringify(queryResults)}`);

    // Summarize the results using OpenAI
    const summaryPrompt = `
    You are an intelligent assistant that summarizes legal data for an AI insurance company. The company uses this information to understand damages, liability, and exposure risks associated with the usage of generative AI. The current query was: "${query}". Here are the results:

    ${JSON.stringify(queryResults)}

    Use the following examples to understand how to summarize the information:

    Example 1:
    USER QUERY: Name cases that have occurred in the last year.
    DATA: [
      {"title": "Waymo Software Flaw Leads to Double Collision with Tow Truck", "dateOfIncident": "2023-12-11", "defendant": "Waymo", "description": "A software flaw in Waymo's autonomous driving system resulted in a double collision with a tow truck, raising concerns about the safety and reliability of autonomous vehicles."},
      {"title": "Amazon Flex Drivers Allegedly Fired via Automated Employee Evaluations", "dateOfIncident": "2015-09-25", "defendant": "Amazon Flex", "description": "Amazon Flex drivers reported being unfairly terminated based on automated performance evaluations, highlighting potential issues with AI-driven HR practices."}
    ]
    SUMMARY: In the last year, there were significant incidents involving generative AI, including a software flaw in Waymo's autonomous driving system leading to a collision, and unfair terminations of Amazon Flex drivers due to automated evaluations. These cases highlight the safety risks and ethical concerns associated with AI deployment.

    Example 2:
    USER QUERY: Have any cases affected OpenAI?
    DATA: [
      {"title": "OpenAI's Training Data for LLMs Allegedly Comprised of Copyrighted Books", "dateOfIncident": "2018-06-11", "defendant": "OpenAI", "description": "OpenAI faced allegations that its training data for language models included copyrighted books without permission, raising legal and ethical questions about data usage in AI training."}
    ]
    SUMMARY: OpenAI has been involved in legal disputes over the use of copyrighted material in training its language models, highlighting significant legal risks and ethical considerations for AI developers.

    Example 3:
    USER QUERY: What incidents happened before 2016?
    DATA: [
      {"title": "Google Instant's Allegedly 'Anti-Semitic' Results Lead To Lawsuit In France", "dateOfIncident": "2012-01-05", "defendant": "Google", "description": "Google faced a lawsuit in France over its autocomplete suggestions, which allegedly linked certain public figures with anti-Semitic terms, raising concerns about the impact of AI on public perception and reputational damage."}
    ]
    SUMMARY: Before 2016, Google faced legal action in France due to controversial autocomplete suggestions that linked public figures to anti-Semitic terms, emphasizing the reputational risks and potential for public backlash in AI implementations.

    Example 4:
    USER QUERY: Show all cases filed against Amazon Flex.
    DATA: [
      {"title": "Amazon Flex Drivers Allegedly Fired via Automated Employee Evaluations", "dateOfIncident": "2015-09-25", "defendant": "Amazon Flex", "description": "Amazon Flex drivers reported being unfairly terminated based on automated performance evaluations, highlighting potential issues with AI-driven HR practices."}
    ]
    SUMMARY: Amazon Flex has faced legal challenges related to its use of AI in employee evaluations, with claims of unfair terminations. This underscores the risks of deploying AI in HR processes without adequate oversight.

    Example 5:
    USER QUERY: What incidents happened after 2020?
    DATA: [
      {"title": "Waymo Software Flaw Leads to Double Collision with Tow Truck", "dateOfIncident": "2023-12-11", "defendant": "Waymo", "description": "A software flaw in Waymo's autonomous driving system resulted in a double collision with a tow truck, raising concerns about the safety and reliability of autonomous vehicles."}
    ]
    SUMMARY: Since 2020, notable incidents include a collision involving Waymo's autonomous vehicle due to a software flaw, which highlights ongoing safety challenges and the importance of robust testing in AI deployment.

    Example 6:
    USER QUERY: List all cases involving Facebook.
    DATA: [
      {"title": "Facebook AI Misclassification Causes Major Outrage", "dateOfIncident": "2017-10-17", "defendant": "Facebook", "description": "Facebook's AI system misclassified an innocent post as harmful content, leading to significant public backlash and raising questions about the accuracy and accountability of AI content moderation systems."}
    ]
    SUMMARY: Facebook has encountered legal issues due to AI misclassification, resulting in public outrage and emphasizing the need for accurate and accountable AI content moderation.

    Example 7:
    USER QUERY: Give me all claims made in 2017.
    DATA: [
      {"title": "Facebook AI Misclassification Causes Major Outrage", "dateOfClaim": "2017-10-18", "defendant": "Facebook", "description": "Facebook's AI system misclassified an innocent post as harmful content, leading to significant public backlash and raising questions about the accuracy and accountability of AI content moderation systems."}
    ]
    SUMMARY: In 2017, Facebook's AI system faced significant backlash due to a misclassification error, highlighting the critical need for accuracy and accountability in AI content moderation systems.

    Example 8:
    USER QUERY: Show incidents that happened after 2020.
    DATA: [
      {"title": "Waymo Software Flaw Leads to Double Collision with Tow Truck", "dateOfIncident": "2023-12-11", "defendant": "Waymo", "description": "A software flaw in Waymo's autonomous driving system resulted in a double collision with a tow truck, raising concerns about the safety and reliability of autonomous vehicles."}
    ]
    SUMMARY: Post-2020 incidents include a notable case where Waymo's autonomous vehicle experienced a software flaw, resulting in a collision. This incident underscores the importance of rigorous testing and validation in AI systems.

    Example 9:
    USER QUERY: Name cases related to language translation errors.
    DATA: [
      {"title": "Facebook translates 'good morning' into 'attack them', leading to arrest", "dateOfIncident": "2017-10-17", "defendant": "Facebook", "description": "Facebook's automatic language translation software incorrectly translated an Arabic post saying \"Good morning\" into Hebrew saying \"hurt them,\" leading to the arrest of a Palestinian man. This raised concerns about the reliability and consequences of AI-driven language translation."}
    ]
    SUMMARY: Language translation errors have led to significant incidents, such as Facebook's translation error causing wrongful arrest. This highlights the critical need for accuracy in AI language translation systems.

    Example 10:
    USER QUERY: List incidents involving autonomous vehicles.
    DATA: [
      {"title": "Waymo Software Flaw Leads to Double Collision with Tow Truck", "dateOfIncident": "2023-12-11", "defendant": "Waymo", "description": "A software flaw in Waymo's autonomous driving system resulted in a double collision with a tow truck, raising concerns about the safety and reliability of autonomous vehicles."}
    ]
    SUMMARY: Autonomous vehicle incidents include Waymo's collision due to a software flaw, emphasizing the ongoing safety and reliability challenges in the deployment of autonomous driving technologies.

    Based on the above examples, summarize the provided information in a clear, concise, and informative manner, highlighting key points relevant to damages, liability, and risk exposure related to generative AI.
`;

    const summary = await this.modelInferenceService.query(summaryPrompt);
    this.logger.debug(`Summarized response from OpenAI API: ${summary}`);

    return {
      naturalLanguageQuery: query,
      sqlQuery: transformedSqlQuery,
      results: queryResults,
      summary: summary,
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

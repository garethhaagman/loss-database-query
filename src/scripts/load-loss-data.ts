import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseQueryService } from 'src/modules/database-query/database-query.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const databaseQueryService = app.get(DatabaseQueryService);

  const dataPath = path.join(__dirname, 'data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  await databaseQueryService.insertMultiple(data);

  console.log('Data inserted successfully');
  await app.close();
}

bootstrap();

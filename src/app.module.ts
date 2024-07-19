import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ModelInferenceService } from './modules/model-inference/model-inference.service';
import { DatabaseQueryService } from './modules/database-query/database-query.service';
import { TalkToSqlController } from './modules/talk-to-sql/talk.controller';
import { TalkToLossDatabaseService } from './modules/talk-to-sql/talk.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TalkToSqlController],
  providers: [
    ModelInferenceService,
    DatabaseQueryService,
    TalkToLossDatabaseService,
  ],
})
export class AppModule {}
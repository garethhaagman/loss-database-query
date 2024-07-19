import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NaturalLanguageQueryDto } from './dto/natural-language-query.dto';
import { TalkToLossDatabaseService } from './talk.service';

@ApiTags('sql')
@Controller('talk')
export class TalkToSqlController {
  constructor(
    private readonly talkToLossDatabaseService: TalkToLossDatabaseService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Convert natural language to SQL and execute query',
  })
  @ApiBody({ type: NaturalLanguageQueryDto })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async processNaturalLanguageQuery(@Body() body: NaturalLanguageQueryDto) {
    return this.talkToLossDatabaseService.processNaturalLanguageQuery(
      body.query,
    );
  }
}

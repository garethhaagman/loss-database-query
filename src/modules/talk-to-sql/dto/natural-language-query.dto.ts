import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class NaturalLanguageQueryDto {
  @ApiProperty({
    description: 'The natural language input that needs to be converted to SQL',
    example: 'Give me a list of events that occured in the last year ',
  })
  query: string;
}

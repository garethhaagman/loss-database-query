import { Injectable, Logger } from '@nestjs/common'; // Add Logger
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ModelInferenceService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly logger = new Logger(ModelInferenceService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.model = 'gpt-4o-mini-2024-07-18';
  }

  async query(prompt: string): Promise<string> {
    const messages = this.createMessages(prompt);

    const data = {
      model: this.model,
      messages: messages,
      max_tokens: 150,
      temperature: 0.5,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    this.logger.debug(`Sending request to OpenAI API with payload: ${JSON.stringify(data)}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, data, { headers }),
      );

      const generatedText = response.data.choices[0].message.content.trim();
      this.logger.debug(`Received response from OpenAI API: ${generatedText}`);
      return generatedText;
    } catch (error) {
      this.logger.error('Error making request to OpenAI API', error.message);
      if (error.response) {
        this.logger.error('Response data:', error.response.data);
      }
      throw new Error('Failed to generate SQL query from OpenAI API');
    }
  }

  private createMessages(prompt: string): any[] {
    return [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];
  }
}

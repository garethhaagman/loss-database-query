import { Test, TestingModule } from '@nestjs/testing';
import { ModelInferenceService } from './model-inference.service';

describe('ModelInferenceService', () => {
  let service: ModelInferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelInferenceService],
    }).compile();

    service = module.get<ModelInferenceService>(ModelInferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

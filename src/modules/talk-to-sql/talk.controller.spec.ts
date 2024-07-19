import { Test, TestingModule } from '@nestjs/testing';
import { TalkToSqlController } from './talk.controller';

describe('TalkToSqlController', () => {
  let controller: TalkToSqlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalkToSqlController],
    }).compile();

    controller = module.get<TalkToSqlController>(TalkToSqlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

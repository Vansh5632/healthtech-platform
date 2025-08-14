import { Test, TestingModule } from '@nestjs/testing';
import { EhrController } from './ehr.controller';

describe('EhrController', () => {
  let controller: EhrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EhrController],
    }).compile();

    controller = module.get<EhrController>(EhrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

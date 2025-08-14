import { Test, TestingModule } from '@nestjs/testing';
import { EhrService } from './ehr.service';

describe('EhrService', () => {
  let service: EhrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EhrService],
    }).compile();

    service = module.get<EhrService>(EhrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

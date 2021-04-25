import { Test, TestingModule } from '@nestjs/testing';
import { RestCallService } from './rest-call.service';

describe('RestCallService', () => {
  let service: RestCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestCallService],
    }).compile();

    service = module.get<RestCallService>(RestCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

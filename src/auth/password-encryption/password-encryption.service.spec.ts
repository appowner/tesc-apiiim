import { Test, TestingModule } from '@nestjs/testing';
import { PasswordEncryptionService } from './password-encryption.service';

describe('PasswordEncryptionService', () => {
  let service: PasswordEncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordEncryptionService],
    }).compile();

    service = module.get<PasswordEncryptionService>(PasswordEncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

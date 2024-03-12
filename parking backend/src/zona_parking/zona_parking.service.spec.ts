import { Test, TestingModule } from '@nestjs/testing';
import { ZonaParkingService } from './zona_parking.service';

describe('ZonaParkingService', () => {
  let service: ZonaParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZonaParkingService],
    }).compile();

    service = module.get<ZonaParkingService>(ZonaParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

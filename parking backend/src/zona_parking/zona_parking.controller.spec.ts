import { Test, TestingModule } from '@nestjs/testing';
import { ZonaParkingController } from './zona_parking.controller';
import { ZonaParkingService } from './zona_parking.service';

describe('ZonaParkingController', () => {
  let controller: ZonaParkingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZonaParkingController],
      providers: [ZonaParkingService],
    }).compile();

    controller = module.get<ZonaParkingController>(ZonaParkingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

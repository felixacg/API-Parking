import { Module } from '@nestjs/common';
import { ZonaParkingService } from './zona_parking.service';
import { ZonaParkingController } from './zona_parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonaParking } from './entities/zona_parking.entity';
import { Parking } from '../parking/entities/parking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZonaParking, Parking])],
  controllers: [ZonaParkingController],
  providers: [ZonaParkingService],
  exports: [ZonaParkingService]
})
export class ZonaParkingModule {}

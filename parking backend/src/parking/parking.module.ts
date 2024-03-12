import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { PersonasModule } from '../personas/personas.module';
import { Persona } from '../personas/entities/persona.entity';
import { ZonaParking } from '../zona_parking/entities/zona_parking.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Parking, Persona, ZonaParking, Reserva]), PersonasModule, LogsModule],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService]
})
export class ParkingModule {}

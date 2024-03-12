import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { ZonaParking } from '../zona_parking/entities/zona_parking.entity';
import { Parking } from '../parking/entities/parking.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { ZonaParkingModule } from '../zona_parking/zona_parking.module';
import { ParkingModule } from '../parking/parking.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Cliente, ZonaParking, Parking, Vehiculo]), ZonaParkingModule, ParkingModule, LogsModule],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasModule } from './personas/personas.module';
import { AuthModule } from './auth/auth.module';
import { ParkingModule } from './parking/parking.module';
import { ZonaParkingModule } from './zona_parking/zona_parking.module';
import { ReservaModule } from './reserva/reserva.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { ClienteModule } from './cliente/cliente.module';
import { UsersModule } from './users/users.module';
import { LogsModule } from './logs/logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'parking',
     // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    PersonasModule,
    AuthModule,
    ParkingModule,
    ZonaParkingModule,
    ReservaModule,
    VehiculoModule,
    ClienteModule,
    UsersModule,
    LogsModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

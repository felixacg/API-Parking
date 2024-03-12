import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { Cliente } from './entities/cliente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { Reserva } from '../reserva/entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, User, Vehiculo, Reserva]),
    UsersModule],
  controllers: [ClienteController],
  providers: [ClienteService],
  exports: [ClienteService]
})
export class ClienteModule { }

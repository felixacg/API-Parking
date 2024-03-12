import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { PersonasController } from './personas.controller';
import { Persona } from './entities/persona.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Parking } from '../parking/entities/parking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona, User, Parking]),
    UsersModule],
  controllers: [PersonasController],
  providers: [PersonasService],
  exports: [PersonasService]
})
export class PersonasModule { }

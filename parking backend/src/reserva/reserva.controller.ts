import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ActiveUser } from '../common/decorators/active - user.decorator';
import { UserActiveInterface } from '../auth/interface/user - active.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/role.enums';

@Auth(Role.Cliente)
@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto, @ActiveUser() cliente: UserActiveInterface) {
    return this.reservaService.create(createReservaDto, cliente);
  }

  @Get()
  findAll(@ActiveUser() cliente: UserActiveInterface) {
    return this.reservaService.findAll(cliente);
  }


  @Delete(':id_reserva')
  remove(@Param('id_reserva') id: number, @ActiveUser() cliente: UserActiveInterface) {
    return this.reservaService.cancelacion(id, cliente);
  }
}

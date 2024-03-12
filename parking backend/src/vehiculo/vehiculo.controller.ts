import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/role.enums';
import { ActiveUser } from '../common/decorators/active - user.decorator';
import { UserActiveInterface } from '../auth/interface/user - active.interface';

@Auth(Role.Cliente)
@Controller('vehiculo')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) { }

  @Post()
  create(@Body() createVehiculoDto: CreateVehiculoDto, @ActiveUser() cliente: UserActiveInterface) {
    return this.vehiculoService.createVehiculo(createVehiculoDto, cliente);
  }

  @Get()
  findAll(@ActiveUser() cliente: UserActiveInterface) {
    return this.vehiculoService.findAll(cliente);
  }

  @Get(':id_vehiculo')
  findOne(@Param('id_vehiculo') id: number, @ActiveUser() cliente: UserActiveInterface) {
    return this.vehiculoService.findOne(id, cliente);
  }

  @Put(':id_vehiculo')
  update(@Param('id_vehiculo') id: number, @Body() updateVehiculoDto: UpdateVehiculoDto, @ActiveUser() cliente: UserActiveInterface) {
    return this.vehiculoService.update(id, updateVehiculoDto, cliente);
  }

  @Delete(':id_vehiculo')
  remove(@Param('id_vehiculo') id: number, @ActiveUser() cliente: UserActiveInterface) {
    return this.vehiculoService.remove(id, cliente);
  }
}

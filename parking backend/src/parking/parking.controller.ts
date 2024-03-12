import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/role.enums';
import { ActiveUser } from '../common/decorators/active - user.decorator';
import { UserActiveInterface } from '../auth/interface/user - active.interface';

@Auth(Role.Admin)
@Controller('parqueo')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) { }
  @Post()
  create(@Body() createParkingDto: CreateParkingDto, @ActiveUser() persona: UserActiveInterface) {
    return this.parkingService.create(createParkingDto, persona);
  }

  @Get()
  findAll(@ActiveUser() persona: UserActiveInterface) {
    return this.parkingService.findAll(persona);
  }

  @Get(':id_parking')
  findOne(@Param('id_parking') id: number, @ActiveUser() persona: UserActiveInterface) {
    return this.parkingService.findOne(id, persona);
  }

  @Put(':id_parking')
  update(@Param('id_parking') id: number, @Body() updateParkingDto: UpdateParkingDto, @ActiveUser() persona: UserActiveInterface) {
    return this.parkingService.update(id, updateParkingDto, persona);
  }

  @Delete(':id_parking')
  remove(@Param('id_parking') id: number, @ActiveUser() persona: UserActiveInterface){
    return this.parkingService.remove(id, persona);
  }

  @Auth(Role.Empleado)
  @Get('disponibilidad/:id_parking')
  findOcupacion(@Param('id_parking')id: number, @ActiveUser() persona: UserActiveInterface) {
    return this.parkingService.findOcupacion(id,persona);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ZonaParkingService } from './zona_parking.service';
import { CreateZonaParkingDto } from './dto/create-zona_parking.dto';
import { UpdateZonaParkingDto } from './dto/update-zona_parking.dto';
import { ActiveUser } from '../common/decorators/active - user.decorator';
import { UserActiveInterface } from '../auth/interface/user - active.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/role.enums';

@Auth(Role.Admin)
@Controller('zona-parking')
export class ZonaParkingController {
  constructor(private readonly zonaParkingService: ZonaParkingService) {}

  @Post()
  create(@Body() createZonaParkingDto: CreateZonaParkingDto, @ActiveUser() persona: UserActiveInterface) {
    return this.zonaParkingService.create(createZonaParkingDto, persona);
  }

  @Get()
  findAll(@ActiveUser() persona: UserActiveInterface) {
    return this.zonaParkingService.findAll(persona);
  }

  @Get(':id_zona_parking')
  findOne(@Param('id_zona_parking') id: number, @ActiveUser() persona: UserActiveInterface) {
    return this.zonaParkingService.findOne(id, persona);
  }

  @Put(':id_zona_parking')
  update(@Param('id_zona_parking') id: number, @Body() updateZonaParkingDto: UpdateZonaParkingDto, @ActiveUser() persona: UserActiveInterface) {
    return this.zonaParkingService.update(id, updateZonaParkingDto, persona);
  }

  @Delete(':id_zona_parking')
  remove(@Param('id_zona_parking') id: number, @ActiveUser() persona: UserActiveInterface) {
    return this.zonaParkingService.remove(id, persona);
  }
}

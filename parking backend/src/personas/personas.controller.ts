import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enums';

@Auth(Role.Admin)
@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) { }

  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personasService.createPersonas(createPersonaDto);
  }

  @Get()
  findAll() {
    return this.personasService.getPersonas();
  }

  @Get(':id_persona')
  findOne(@Param('id_persona') id: number) {
    return this.personasService.getPersona(id);
  }

  @Put(':id_persona')
  update(@Param('id_persona') id: number, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personasService.updatePersonas(id, updatePersonaDto);
  }
  @Delete(':id_persona')
  deleteTrabajadores(@Param('id_persona') id: number) {
    return this.personasService.deleteTrabajadores(id);
  }
}

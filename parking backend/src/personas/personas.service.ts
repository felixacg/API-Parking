import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcrypt'
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Parking } from '../parking/entities/parking.entity';

@Injectable()
export class PersonasService {
  constructor(@InjectRepository(Persona)
  private personaRepository: Repository<Persona>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UsersService,
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,) { }

  async createPersonas(Persona: CreatePersonaDto) {

    const EmailFound = await this.findOneByEmail(Persona.email)
    if (EmailFound) {
      return new HttpException('El email con el cual se creará su cuenta, ya existe, por lo que debe cambiarlo o revisar bien los datos que está ingresando', HttpStatus.FOUND)
    }
    const regex = /^[0-9]*$/;
    const regexp = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]*$/;
    const telNum = regex.test(Persona.telefono);
    const nomLet = regexp.test(Persona.nombre);
    const apeLet = regexp.test(Persona.apellidos);

    if (nomLet == false) {
      return new HttpException(
        `El campo nombre solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (apeLet == false) {
      return new HttpException(
        `El campo apellidos solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (telNum == false) {
      return new HttpException(
        `El campo teléfono solo contiene números`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (Persona.telefono.length < 8 || Persona.telefono.length > 8) {
      return new HttpException(
        `El campo teléfono debe tener solo 8 dígitos`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (Persona.password != Persona.confirm_password) {
      return new HttpException(
        `El password que ingresó no coincide con el password de confirmación`,
        HttpStatus.BAD_REQUEST,
      )
    }
    if (Persona.rol != 'admin' && Persona.rol != 'empleado') {
      return new HttpException(
        `En el campo Rol debe poner 'admin' para hacer referencia al rol de 'administrador' o 'empleado' para hacer referencia al rol de 'empleado'`,
        HttpStatus.BAD_REQUEST,
      )
    }
    const ParkingFound = await this.parkingRepository.find({
      where: {id_parking: Persona.parkin}
    })
    if(!ParkingFound[0]){
      return new HttpException('El parqueo al que desea asignar el empleado que intenta agregar, no existe', HttpStatus.NOT_FOUND)
    }
    if(Persona.rol == 'empleado'){
      const newPersona = this.personaRepository.create({
        nombre: Persona.nombre,
        apellidos: Persona.apellidos,
        telefono: Persona.telefono,
        email: Persona.email,
        password: Persona.password,
        rol: Persona.rol,
        empleado_de: ParkingFound[0]
      });
      console.log(ParkingFound[0])
      newPersona.password = await bcryptjs.hash(newPersona.password, 10)
      const result = await this.personaRepository.save(newPersona)
      await this.userService.createUsuario({
        email: newPersona.email,
        password: newPersona.password,
        rol: newPersona.rol,
        id_persona: newPersona.id_persona,
        id_cliente: undefined
      })
      return result;
    }
    const newPersona = this.personaRepository.create({
      nombre: Persona.nombre,
      apellidos: Persona.apellidos,
      telefono: Persona.telefono,
      email: Persona.email,
      password: Persona.password,
      rol: Persona.rol,
    });
    newPersona.empleado_de = undefined;
    newPersona.password = await bcryptjs.hash(newPersona.password, 10)
    const result = await this.personaRepository.save(newPersona)
    await this.userService.createUsuario({
      email: newPersona.email,
      password: newPersona.password,
      rol: newPersona.rol,
      id_persona: newPersona.id_persona,
      id_cliente: undefined
    })
    return result;
  }
  findOneByEmail(email: string) {
    return this.personaRepository.findOneBy({ email })
  }

  async getPersonas() {
    return await this.personaRepository.find({
      relations: {empleado_de: true, admin_de: true},
      select: {
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
        telefono: true,
      },
    });
  }

  async getPersona(id_persona: number) {
    const PersonaFound = await this.personaRepository.findOne({
      select: {
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
        telefono: true,
      },
      where: { id_persona }
    });
    if (!PersonaFound) {
      return new HttpException(`La persona no existe`, HttpStatus.NOT_FOUND);
    }
    return PersonaFound;
  }

  async updatePersonas(id_persona: number, Persona: UpdatePersonaDto) {

    const TrbajadorFound = await this.personaRepository.findOneBy({ id_persona })
    if (!TrbajadorFound) {
      return new HttpException('El trabajador que desea modificar no existe', HttpStatus.NOT_FOUND)
    }
    const EmailUserFound = await this.userRepository.find({
      where: { email: Persona.email }
    })
    if ((Persona.email != TrbajadorFound.email) && (EmailUserFound[0] != undefined)) {
      return new HttpException('El nuevo email que desea agregar ya ha sido escogido para crear una cuenta de usuario, cambie el nuevo email', HttpStatus.FOUND)
    }
    const regex = /^[0-9]*$/;
    const regexp = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]*$/;
    const telNum = regex.test(Persona.telefono);
    const nomLet = regexp.test(Persona.nombre);

    if (nomLet == false) {
      return new HttpException(
        `El campo nombre solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (telNum == false) {
      return new HttpException(
        `El campo teléfono solo contiene números`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (Persona.telefono.length < 8 || Persona.telefono.length > 8) {
      return new HttpException(
        `El campo teléfono debe tener solo 8 dígitos`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const ParkingFound = await this.parkingRepository.find({
      where: {id_parking: Persona.parkin}
    })
    if(!ParkingFound[0]){
      return new HttpException('El parqueo al que desea asignar el trabajador que intenta agregar, no existe', HttpStatus.NOT_FOUND)
    }
    const newPersona = await this.personaRepository.create({
      nombre: Persona.nombre,
      apellidos: Persona.apellidos,
      telefono: Persona.telefono,
      email: Persona.email,
      password: Persona.password,
      rol: Persona.rol,
    });
    await this.personaRepository.update(id_persona, newPersona);
    if (TrbajadorFound.email != Persona.email) {
      this.userService.updateUsuario(id_persona, Persona)
      return await this.personaRepository.findOneBy({ id_persona })
    }
    return await this.personaRepository.findOneBy({ id_persona })
  }

  async deleteTrabajadores(id_persona: number) {
    const PersonaFound = await this.personaRepository.findOne({
      select: {
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
        telefono: true,
      },
      where: { id_persona }
    });
    if (!PersonaFound) {
      return new HttpException('La persona no existe', HttpStatus.NOT_FOUND);
    }
    await this.personaRepository.softDelete(id_persona);

    return PersonaFound;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import * as bcryptjs from 'bcrypt'
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';


@Injectable()
export class ClienteService {
  constructor(@InjectRepository(Cliente)
  private clienteRepository: Repository<Cliente>,
  @InjectRepository(User)
  private userRepository: Repository<User>,
    private userService: UsersService,) { }

  async createCliente(Cliente: CreateClienteDto) {
    const EmailFound = await this.findOneByEmail(Cliente.email)
    if (EmailFound) {
      return new HttpException('El email con el cual se creará su cuenta, ya existe, por lo que debe cambiarlo o revisar bien los datos que está ingresando', HttpStatus.FOUND)
    }
    const regex = /^[0-9]*$/;
    const regexp = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]*$/;
    const telNum = regex.test(Cliente.telefono);
    const nomLet = regexp.test(Cliente.nombre);
    const apeLet = regexp.test(Cliente.apellidos);
    const rolLet = regexp.test(Cliente.rol);

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
    if (Cliente.telefono.length < 8 || Cliente.telefono.length > 8) {
      return new HttpException(
        `El campo teléfono debe tener solo 8 dígitos`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (Cliente.password != Cliente.confirm_password) {
      return new HttpException(
        `El password que ingresó no coincide con el password de confirmación`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const newCLiente = await this.clienteRepository.create(Cliente);
    newCLiente.password = await bcryptjs.hash(newCLiente.password, 10)
   const result = await this.clienteRepository.save(newCLiente)
    await this.userService.createUsuario({
      email: newCLiente.email,
      password: newCLiente.password,
      rol: newCLiente.rol,
      id_persona: undefined,
      id_cliente: newCLiente.id_cliente
    })
    return result;
  }

  findOneByEmail(email: string) {
    return this.clienteRepository.findOneBy({ email })
  }
  /*
    findAll() {
      return `This action returns all cliente`;
    }
  
    findOne(id: number) {
      return `This action returns a #${id} cliente`;
    }
  
    update(id: number, updateClienteDto: UpdateClienteDto) {
      return `This action updates a #${id} cliente`;
    }
  
    remove(id: number) {
      return `This action removes a #${id} cliente`;
    }*/
}

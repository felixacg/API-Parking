import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from '../personas/entities/persona.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>) { }

  async createUsuario({ email, password, rol, id_persona, id_cliente }: CreateUserDto) {
    await this.userRepository.save({ email, password, rol, id_persona, id_cliente })
    const EmailPersona = await this.personaRepository.find({
      where: { email: email }
    })
    const EmailUsuario = await this.userRepository.find({
      where: { email: email }
    })
    const EmailCliente = await this.clienteRepository.find({
      where: { email: email }
    })
     return await this.userRepository.update(EmailUsuario[0].id_user,{persona:EmailPersona[0], cliente:EmailCliente[0]});
  }
  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email })
  }
  async updateUsuario(id_persona: number, {email}: UpdateUserDto){
    const PersonaFound = await this.personaRepository.find({
      where: {id_persona: id_persona}
    })
    const UserFound = await this.userRepository.find({
      where: {persona:PersonaFound[0]}
    })
   return await this.userRepository.update(UserFound[0].id_user, {email})
  }

  /*
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }*/
}

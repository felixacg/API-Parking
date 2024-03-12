import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import * as bcryptjs from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from './interface/user - active.interface';
import { ClienteService } from '../cliente/cliente.service';
import { UsersService } from '../users/users.service';
import { RefreshtokenDto } from './dto/refreshtoken.dto';


@Injectable()
export class AuthService {
  constructor(
    private clienteService: ClienteService,
    private userService: UsersService,
    private jwtService: JwtService
  ) {

  }

  async register(registerClient: RegisterDto) {
    registerClient.rol = 'cliente'
    return await this.clienteService.createCliente(registerClient);
  }

  async login({ email, password }: LoginDto) {
    const ClientFound = await this.userService.findOneByEmail(email)
    if (!ClientFound) {
      return new HttpException('Correo o contraseña incorrecta', HttpStatus.UNAUTHORIZED)
    }
    const PasswordInvalido = await bcryptjs.compare(password, ClientFound.password)
    if (!PasswordInvalido) {
      return new HttpException('Correo o contraseña incorrecta', HttpStatus.UNAUTHORIZED)
    }
    const payload = { email: ClientFound.email, rol: ClientFound.rol, id_user: ClientFound.id_user };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      email,
    };
  }

  async refreshToken(refreshToken: RefreshtokenDto) {
    const user = await this.jwtService.decode(refreshToken.token)
    console.log(!user.exp)
    if(!user){
      return new HttpException('Acceso denegado', HttpStatus.UNAUTHORIZED)
    }
    const payload = { email: user.email, rol: user.rol, id_user: user.id_user };
    const token = await this.jwtService.signAsync(payload);
    return {token}
  }

  async persona(user: UserActiveInterface) {
    return await this.userService.findOneByEmail(user.email)

  }
  /*create(createAuthDto: CreateAuthDto) {
     return 'This action adds a new auth';
   }
 
   findAll() {
     return `This action returns all auth`;
   }
 
   findOne(id: number) {
     return `This action returns a #${id} auth`;
   }
 
   update(id: number, updateAuthDto: UpdateAuthDto) {
     return `This action updates a #${id} auth`;
   }
 
   remove(id: number) {
     return `This action removes a #${id} auth`;
   }*/
}

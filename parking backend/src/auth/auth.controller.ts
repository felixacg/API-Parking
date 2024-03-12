import { Controller, Get, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { Role } from '../common/enums/role.enums';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active - user.decorator';
import { UserActiveInterface } from './interface/user - active.interface';
import { RefreshtokenDto } from './dto/refreshtoken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('register')
  register(
    @Body() registerDto: RegisterDto
  ) {
    return this.authService.register(registerDto);
  }
 
  @Post('login')
  login(
    @Body() loginDto: LoginDto
  ) {
    return this.authService.login(loginDto);
  }

 @Post('refresh')
  refreshToken(
    @Body() refreshtoken :RefreshtokenDto
  ) {
    return this.authService.refreshToken(refreshtoken);
  }

  /*@Get('persona')
  @Auth(Role.Cliente)
  persona(@ActiveUser() persona: UserActiveInterface) {
    return this.authService.persona(persona)
  }*/

}

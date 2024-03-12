import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Cliente } from "../../cliente/entities/cliente.entity";
import { Persona } from "../../personas/entities/persona.entity";

export class CreateUserDto {

    //id_user: number;
    
    @Transform(({ value }) => value.trim())
    @IsEmail()
    @IsNotEmpty({ message: 'El campo Email no puede estar vacio' })
    email: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Password no puede estar vacio' })
    @MinLength(6)
    password: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Rol no puede estar vacio' })
    rol: string;

    id_persona: number;
    id_cliente: number;

}

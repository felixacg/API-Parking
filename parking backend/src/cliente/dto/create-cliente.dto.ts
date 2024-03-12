import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateClienteDto {

    id_persona: number;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Nombre no puede estar vacio' })
    nombre: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Apellidos no puede estar vacio' })
    apellidos: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Telefono no puede estar vacio' })
    telefono: string;

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
    @IsNotEmpty({ message: 'El campo Confirm Password no puede estar vacio' })
    confirm_password: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Rol no puede estar vacio' })
    rol: string;

    id_user: number;

}

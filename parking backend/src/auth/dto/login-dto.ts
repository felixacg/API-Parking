import { Transform } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class LoginDto {

    @Transform(({ value }) => value.trim())
    @IsEmail()
    @IsNotEmpty({ message: 'El campo Email no puede estar vacio' })
    email: string

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Password no puede estar vacio' })
    @MinLength(6)
    password: string


}
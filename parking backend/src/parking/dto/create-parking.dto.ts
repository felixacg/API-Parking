import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateParkingDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Nombre no puede estar vacio' })
    nombre: string;
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Provincia no puede estar vacio' })  
    provincia: string;
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Municipio no puede estar vacio' })  
    municipio: string;
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Direccion no puede estar vacio' })  
    direccion: string;
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Capacidad no puede estar vacio' })  
    capacidad: string;
    
    emailAdmin: string;
}

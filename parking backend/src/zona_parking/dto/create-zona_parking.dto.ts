import { Transform } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateZonaParkingDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Nombre no puede estar vacio' }) 
    nombre: string;
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Parking no puede estar vacio' }) 
    parking: number;

}

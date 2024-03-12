import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateVehiculoDto {

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Marca no puede estar vacio' })
    marca: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Modelo no puede estar vacio' })
    modelo: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Matrícula no puede estar vacio' })
    matricula: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty({ message: 'El campo Tipo no puede estar vacio' })
    tipo: string;

    id_cliente: number;
}

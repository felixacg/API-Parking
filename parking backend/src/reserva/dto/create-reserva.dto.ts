import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateReservaDto {

    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Fecha de Entrada no puede estar vacio' })
    fecha_entrada: Date;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Fecha de Salida no puede estar vacio' })
    fecha_salida: Date;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Hora de Entrada no puede estar vacio' })
    hora_entrada: Date;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Hora de Salida no puede estar vacio' })
    hora_salida: Date;
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Parking no puede estar vacio' })
    parking: number;
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Zona Parking no puede estar vacio' })
    zona_parking: number;
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'El campo Vehiculo no puede estar vacio' })
    vehiculo: number;
}

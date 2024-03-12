import { PartialType } from '@nestjs/mapped-types';
import { CreateZonaParkingDto } from './create-zona_parking.dto';

export class UpdateZonaParkingDto extends PartialType(CreateZonaParkingDto) {}

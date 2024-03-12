import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZonaParkingDto } from './dto/create-zona_parking.dto';
import { UpdateZonaParkingDto } from './dto/update-zona_parking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ZonaParking } from './entities/zona_parking.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/auth/interface/user - active.interface';
import { Parking } from 'src/parking/entities/parking.entity';
import { Role } from 'src/common/enums/role.enums';

@Injectable()
export class ZonaParkingService {
  constructor(
    @InjectRepository(ZonaParking)
    private zonaparkingRepository: Repository<ZonaParking>,
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>
  ) { }

  async create(ZonaParking: CreateZonaParkingDto, persona: UserActiveInterface) {
    const ZonaParkingFound = await this.zonaparkingRepository.find({
      where: {
        nombre: ZonaParking.nombre,
        Idparking: ZonaParking.parking
      }
    })

    if (ZonaParkingFound[0]) {
      return new HttpException('La zona de parking que desea agregar ya existe en el parking seleccionado', HttpStatus.FOUND)
    }
    const ParkingFound = await this.parkingRepository.findOne({
      where: { id_parking: ZonaParking.parking }
    })
    if (!ParkingFound) {
      return new HttpException('El parking al que desea agregarle la nueva zona, no existe', HttpStatus.NOT_FOUND)
    }
    if (ParkingFound.emailAdmin !== persona.email && Role.Admin !== persona.role) {
      return new HttpException('No esta autorizado', HttpStatus.UNAUTHORIZED)
    }
    const newZonaParking = await this.zonaparkingRepository.create({
      nombre: ZonaParking.nombre,
      Idparking: ZonaParking.parking
    })
    return await this.zonaparkingRepository.save(newZonaParking);
  }

  async findAll(persona: UserActiveInterface) {
    const ZonaParkingFound = await this.zonaparkingRepository.find({
      relations: { parking: true },
      where: { parking: { emailAdmin: persona.email } }
    })
    if (!ZonaParkingFound[0]) {
      return new HttpException('No hay para mostrar ninguna zona de parking porque no ha creado ninguno aun', HttpStatus.UNAUTHORIZED)
    }
    return ZonaParkingFound;
  }

  async findOne(id_zona_parking: number, persona: UserActiveInterface) {
    const ZonaParkingFound = await this.zonaparkingRepository.findOne({
      relations: { parking: true },
      where: { id_zona_parking }
    })
    if (!ZonaParkingFound) {
      return new HttpException('La zona de parking no existe', HttpStatus.NOT_FOUND)
    }
    if (ZonaParkingFound.parking.emailAdmin !== persona.email && Role.Admin !== persona.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)

    }
    return ZonaParkingFound;
  }

  async update(id_zona_parking: number, ZonaParking: UpdateZonaParkingDto, persona: UserActiveInterface) {
    const ZonaParkingFound = await this.zonaparkingRepository.findOneBy({ id_zona_parking })
    const ZonaParkinFound = await this.zonaparkingRepository.find({
      relations: { parking: true },
      where: {
        nombre: ZonaParking.nombre,
        Idparking: ZonaParking.parking
      }
    })
    if (!ZonaParkingFound) {
      return new HttpException('La zona de parking que desea modificar no existe', HttpStatus.NOT_FOUND)
    }
    if (ZonaParkinFound[0]) {
      return new HttpException('Los datos de la nueva zona de parking que esta ingresando, ya existen', HttpStatus.FOUND)
    }
    const ParkingFound = await this.parkingRepository.findOne({
      where: { id_parking: ZonaParking.parking }
    })
    if (!ParkingFound) {
      return new HttpException('El parking al que desea modificarle la nueva zona de parking, no existe', HttpStatus.NOT_FOUND)
    }
    if (ParkingFound.emailAdmin !== persona.email && Role.Admin !== persona.role) {
      return new HttpException('No esta autorizado', HttpStatus.UNAUTHORIZED)
    }
    const newZonaParking = await this.zonaparkingRepository.create({
      nombre: ZonaParking.nombre,
    })
    await this.zonaparkingRepository.update(id_zona_parking, newZonaParking)
    return newZonaParking;
  }

  async remove(id_zona_parking: number, persona: UserActiveInterface) {
    const ZonaParkingFound = await this.zonaparkingRepository.find({
      relations: { parking: true},
      where: { id_zona_parking }
    })
    if (!ZonaParkingFound[0]) {
      return new HttpException('La zona de parking que desea eliminar, no existe', HttpStatus.NOT_FOUND)
    }
    if (ZonaParkingFound[0].parking.emailAdmin !== persona.email && Role.Admin !== persona.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }
    return await this.zonaparkingRepository.remove(ZonaParkingFound);
  }
}

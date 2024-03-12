import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../auth/interface/user - active.interface';
import { Role } from '../common/enums/role.enums';
import { ZonaParking } from '../zona_parking/entities/zona_parking.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { LogsService } from '../logs/logs.service';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReservaEvent } from '../reserva/events/reserva-events';

@Injectable()
export class ParkingService {
  constructor(@InjectRepository(Parking)
  private parkingRepository: Repository<Parking>,
    @InjectRepository(ZonaParking)
    private zonaparkingRepository: Repository<ZonaParking>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    private logService: LogsService,
    private eventemitter: EventEmitter2) { }

  async create(Parking: CreateParkingDto, persona: UserActiveInterface) {
    const ParkingFound = await this.parkingRepository.find({
      where: {
        nombre: Parking.nombre,
        provincia: Parking.provincia,
        municipio: Parking.municipio,
        direccion: Parking.direccion,
        capacidad: Parking.capacidad
      }
    })
    if (ParkingFound[0]) {
      return new HttpException('El parking que intenta agregar ya existe', HttpStatus.FOUND)
    }
    const regex = /^[0-9]*$/;
    const regexp = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]*$/;
    const nomLet = regexp.test(Parking.nombre);
    const provLet = regexp.test(Parking.provincia);
    const munLet = regexp.test(Parking.municipio);
    const capNum = regex.test(Parking.capacidad);

    if (nomLet == false) {
      return new HttpException(
        `El campo nombre solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (provLet == false) {
      return new HttpException(
        `El campo provincia solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (munLet == false) {
      return new HttpException(
        `El campo municipio solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (capNum == false) {
      return new HttpException(
        `El campo capacidad solo contiene números`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newParking = await this.parkingRepository.create(Parking)
    newParking.emailAdmin = persona.email
    return await this.parkingRepository.save(newParking)
  }

  async findAll(persona: UserActiveInterface) {
    const ParkingFound = await this.parkingRepository.find({
      relations: { admin: true },
      where: { emailAdmin: persona.email }
    });
    if (!ParkingFound[0]) {
      return new HttpException('No hay para mostrar ningun parking porque no ha creado ninguno aun', HttpStatus.UNAUTHORIZED)
    }
    return ParkingFound;
  }

  async findOne(id_parking: number, persona: UserActiveInterface) {
    const ParkingFound = await this.parkingRepository.findOneBy({ id_parking })
    if (!ParkingFound) {
      return new HttpException('El parking no existe', HttpStatus.NOT_FOUND)
    }
    if (ParkingFound.emailAdmin !== persona.email && Role.Admin !== persona.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }

    return ParkingFound;
  }

  async update(id_parking: number, Parking: UpdateParkingDto, persona: UserActiveInterface) {
    const ParkFound = await this.parkingRepository.findOneBy({ id_parking })

    const ParkingFound = await this.parkingRepository.find({
      where: {
        nombre: Parking.nombre,
        provincia: Parking.provincia,
        municipio: Parking.municipio,
        direccion: Parking.direccion,
        capacidad: Parking.capacidad
      }
    })
    if (!ParkFound) {
      return new HttpException('El parking que intenta modificar no existe', HttpStatus.FOUND)
    }
    if (ParkingFound[0]) {
      return new HttpException('Los datos del nuevo parking que esta ingresando ya existen', HttpStatus.FOUND)
    }

    const regex = /^[0-9]*$/;
    const regexp = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]*$/;
    const nomLet = regexp.test(Parking.nombre);
    const provLet = regexp.test(Parking.provincia);
    const capNum = regex.test(Parking.capacidad);

    if (nomLet == false) {
      return new HttpException(
        `El campo nombre solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (provLet == false) {
      return new HttpException(
        `El campo provincia solo contiene letras`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (capNum == false) {
      return new HttpException(
        `El campo capacidad solo contiene números`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (ParkFound.emailAdmin !== persona.email && Role.Admin !== persona.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }
    const newParking = await this.parkingRepository.create({
      nombre: Parking.nombre,
      provincia: Parking.provincia,
      municipio: Parking.municipio,
      direccion: Parking.direccion,
      capacidad: Parking.capacidad,
      emailAdmin: persona.email
    })
    await this.parkingRepository.update(id_parking, newParking)
    return newParking;
  }

  async remove(id_parking: number, persona: UserActiveInterface) {
    const ParkingFound = await this.parkingRepository.findOneBy({ id_parking })
    if (!ParkingFound) {
      return new HttpException('El parking no existe', HttpStatus.NOT_FOUND)
    }
    if (ParkingFound.emailAdmin !== persona.email && Role.Admin !== persona.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }
    return await this.parkingRepository.remove(ParkingFound);
  }

  async findOcupacion(id_parking: number, persona: UserActiveInterface) {
    const ParkingFound = await this.parkingRepository.find({
      relations: { empleado: true, zona_parking: true },
      select: { 'empleado': { 'email': true }, 'nombre': true, 'provincia': true, 'municipio': true, 'direccion': true, 'capacidad': true, 'zona_parking': { 'nombre': true, 'estado': true } },
      where: {
        id_parking,
      }
    })
    if (!ParkingFound[0]) {
      return new HttpException('El parking que desea inspeccionar no existe', HttpStatus.NOT_FOUND)
    }
    if (Role.Empleado !== persona.role && ParkingFound[0].empleado[0].email !== persona.email) {
      return new HttpException('No esta autorizado', HttpStatus.UNAUTHORIZED)
    }

    for (let i = 0; i < ParkingFound[0].zona_parking.length; i++) {
      const a = await this.parkingRepository.find({
        relations: { zona_parking: true },
        select: { 'nombre': true, 'provincia': true, 'municipio': true, 'direccion': true, 'capacidad': true, 'zona_parking': { 'nombre': true, 'estado': true } },
        where: {
          id_parking,
          zona_parking: { estado: 'Ocupado' }

        }
      })
      if (a[i] == undefined) {
        return new HttpException('El parking no tiene ninguna zona de parking ocupada', HttpStatus.NOT_FOUND)
      }
      return a[i]
    }
  }

  @Cron('* * * * * *')
  public async FinDeReserva() {
    //  console.log('Analizando fin de reserva')
    const fech = new Date();
    const fechhoy = fech.getFullYear() + '-' + ' ' + (fech.getMonth() + 1) + '-' + ' ' + fech.getDate();
    const horaahora = fech.getHours() + ':' + fech.getMinutes() + ':' + fech.getSeconds()

    const [horaa, horam, horas] = horaahora.split(':')

    const ReservaFound = await this.reservaRepository.find({
      relations: ['zona_parking'],
      where: {
        fecha_salida: new Date(fechhoy),
        fin_reserva: false
      }
    })
    for (let i = 0; i < ReservaFound.length; i++) {
      const [hora, min, sec] = ReservaFound[i].hora_salida.toString().split(':')
      if (Number(hora) == Number(horaa)) {
        if (Number(min) == Number(horam)) {
          console.log('Ya termino la reserva')
          await this.zonaparkingRepository.update(ReservaFound[i].zona_parking.id_zona_parking, { estado: 'Disponible' })
          await this.reservaRepository.update(ReservaFound[i].id_reserva, { fin_reserva: true })
          const nombre = 'Ha finalizado la reservacion de un vehiculo'
          this.eventemitter.emit('Reserva Finalizada', new ReservaEvent(nombre, ReservaFound[i].id_reserva))
        }
      }
    }
  }

  @Cron('* * * * * *')
  public async actualizacionParking() {
    // console.log('Analizando inicio de reserva')
    const fech = new Date();
    const fechhoy = fech.getFullYear() + '-' + ' ' + (fech.getMonth() + 1) + '-' + ' ' + fech.getDate();
    const horaahora = fech.getHours() + ':' + fech.getMinutes() + ':' + fech.getSeconds()
    const [horaa, horam, horas] = horaahora.split(':')

    const ReservaFound = await this.reservaRepository.find({
      relations: ['zona_parking'],
      where: {
        fecha_entrada: new Date(fechhoy),
        fin_reserva: false
      }
    })
    for (let i = 0; i < ReservaFound.length; i++) {
      const [hora, min, sec] = ReservaFound[i].hora_entrada.toString().split(':')

      if (Number(hora) == Number(horaa)) {
        if (Number(min) == Number(horam) && Number(sec) == Number(horas)) {
          console.log('Zona de Parking Ocupada')
          await this.zonaparkingRepository.update(ReservaFound[i].zona_parking.id_zona_parking, { estado: 'Ocupado' })
          const nombre = 'Ha entrado un vehiculo a su zona de parking reservada'
          this.eventemitter.emit('Reserva Inicializada', new ReservaEvent(nombre, ReservaFound[i].id_reserva))

        }
      }
    }
  }
}

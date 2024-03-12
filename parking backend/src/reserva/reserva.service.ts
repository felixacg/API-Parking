import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Between, Repository } from 'typeorm';
import { UserActiveInterface } from '../auth/interface/user - active.interface';
import { Parking } from '../parking/entities/parking.entity';
import { ZonaParking } from '../zona_parking/entities/zona_parking.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { Role } from '../common/enums/role.enums';
import { Cliente } from '../cliente/entities/cliente.entity';
import { ParkingService } from '../parking/parking.service';
import { LogsService } from '../logs/logs.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReservaEvent } from './events/reserva-events';

@Injectable()
export class ReservaService {
  constructor(@InjectRepository(Reserva)
  private reservaRepository: Repository<Reserva>,
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,
    @InjectRepository(ZonaParking)
    private zonaparkingRepository: Repository<ZonaParking>,
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private eventemitter: EventEmitter2
  ) { }

  async create(Reserva: CreateReservaDto, cliente: UserActiveInterface) {
    const fech = new Date();

    const fechhoy = (fech.getMonth() + 1) + '-' + '' + fech.getDate() + '-' + '' + fech.getFullYear();

    const horaahora = fech.getHours() + ':' + fech.getMinutes() + ':' + fech.getSeconds()

    const [hora, min, sec] = Reserva.hora_entrada.toString().split(':')

    const [horaa, horam, horas] = horaahora.split(':')


    if (Reserva.fecha_entrada > Reserva.fecha_salida) {
      return new HttpException('La fecha de salida no puede ser antes de la fecha de entrada', HttpStatus.BAD_REQUEST)
    }

    if (Reserva.fecha_entrada == Reserva.fecha_salida && Reserva.hora_entrada > Reserva.hora_salida) {
      return new HttpException('La hora de salida no puede ser antes de la hora de entrada', HttpStatus.BAD_REQUEST)
    }

    if (Reserva.fecha_entrada == Reserva.fecha_salida && Reserva.hora_entrada == Reserva.hora_salida) {
      return new HttpException('La hora de entrada no puede ser igual a la hora de salida en el mismo dia', HttpStatus.BAD_REQUEST)
    }

    if (new Date(Reserva.fecha_entrada) < new Date(fechhoy)) {
      return new HttpException('La fecha de entrada para reservar una zona de parking debe ser a partir de hoy', HttpStatus.BAD_REQUEST)
    }

    if (new Date(Reserva.fecha_entrada).toString() == new Date(fechhoy).toString() && Number(hora) < Number(horaa)) {
      return new HttpException('La hora de entrada en la que desea reservar ya paso', HttpStatus.BAD_REQUEST)
    }

    if (new Date(Reserva.fecha_entrada).toString() == new Date(fechhoy).toString() && Number(hora) == Number(horaa) && Number(min) < Number(horam)) {
      return new HttpException('La hora de entrada en la que desea reservar ya paso', HttpStatus.BAD_REQUEST)
    }


    const VehiculoFound = await this.vehiculoRepository.find({
      where: { id_vehiculo: Reserva.vehiculo }
    })

    if (!VehiculoFound[0]) {
      return new HttpException('El vehiculo que desea parquear no existe', HttpStatus.NOT_FOUND)
    }

    if (Role.Cliente !== cliente.role && VehiculoFound[0].clienteEmail !== cliente.email) {
      return new HttpException('No esta autorizado', HttpStatus.UNAUTHORIZED)
    }


    const ParkingFound = await this.parkingRepository.find({
      where: { id_parking: Reserva.parking }
    })

    if (!ParkingFound[0]) {
      return new HttpException('El parking en el que desea reservar no existe', HttpStatus.NOT_FOUND)
    }


    const ZonaParkingFound = await this.zonaparkingRepository.find({
      relations: { parking: true, reserva: true },
      where: {
        id_zona_parking: Reserva.zona_parking,
        parking: { id_parking: Reserva.parking }
      }
    })
    if (!ZonaParkingFound[0]) {
      return new HttpException('La zona de parking en la que desea reservar no existe en el parking seleccionado', HttpStatus.NOT_FOUND)
    }


    const ClienteFound = await this.clienteRepository.find({
      where: { email: cliente.email }
    })


    const ReservaFound = await this.reservaRepository.find({
      relations: { cliente: true, parking: true, zona_parking: true, vehiculo: true },
    })

    for (let i = 0; i < ReservaFound.length; i++) {
      const conv1 = new Date(Reserva.fecha_entrada)
      const fechentres = (conv1.getFullYear()) + '-' + (conv1.getMonth() + 1) + '-' + (conv1.getDate())

      const conv2 = new Date(Reserva.fecha_salida)
      const fechsalres = (conv2.getFullYear()) + '-' + (conv2.getMonth() + 1) + '-' + (conv2.getDate())

      const [anorese, mesrese, diarese] = fechentres.split('-')
      const [anoress, mesress, diaress] = fechsalres.split('-')


      if (ReservaFound[i].fin_reserva == false) {
        if (Number(new Date(ReservaFound[i].fecha_entrada).getFullYear()) == Number(anorese) &&
          Number(new Date(ReservaFound[i].fecha_entrada).getMonth() + 1) == Number(mesrese)) {

          if (Number(new Date(ReservaFound[i].fecha_salida).getDate() + 1) == Number(new Date(ReservaFound[i].fecha_entrada).getDate() + 1)) {
            console.log('1')
            if (
              ReservaFound[i].hora_entrada <= Reserva.hora_entrada && Reserva.hora_entrada <= ReservaFound[i].hora_salida
              ||
              ReservaFound[i].hora_entrada <= Reserva.hora_salida && Reserva.hora_salida <= ReservaFound[i].hora_salida
              ||
              ReservaFound[i].hora_entrada >= Reserva.hora_entrada && Reserva.hora_salida >= ReservaFound[i].hora_salida
              ||
              ((Reserva.hora_salida >= ReservaFound[i].fecha_salida || Reserva.hora_salida <= ReservaFound[i].fecha_salida)
                &&
                Number(new Date(ReservaFound[i].fecha_salida).getDate() + 1) < Number(diaress)
                &&
                Reserva.hora_entrada <= ReservaFound[i].hora_entrada)
            ) {
              console.log('a')
              if (ReservaFound[i].zona_parking.id_zona_parking == Reserva.zona_parking) {

                console.log('3')

                if (ReservaFound[i].cliente.email == cliente.email) {
                  return new HttpException('Ya usted reservo esa zona de parking', HttpStatus.BAD_REQUEST)

                }
                if (ReservaFound[i].cliente.email != cliente.email) {
                  return new HttpException('Ya esta reservada la zona de parking', HttpStatus.BAD_REQUEST)

                }
              }
              else if (ReservaFound[i].zona_parking.id_zona_parking != Reserva.zona_parking &&
                ReservaFound[i].vehiculo.id_vehiculo == Reserva.vehiculo && ReservaFound[i].fin_reserva == false) {
                return new HttpException('El vehiculo con el que desea reservar, ya tiene una reservacion',
                  HttpStatus.BAD_REQUEST)
              }
            }
          }
          if (Number(new Date(ReservaFound[i].fecha_salida).getDate() + 1) > Number(new Date(ReservaFound[i].fecha_entrada).getDate() + 1)) {
            console.log('2')

            if ((ReservaFound[i].hora_entrada <= Reserva.hora_entrada
              && Number(new Date(ReservaFound[i].fecha_entrada).getDate() + 1) == Number(diarese))
              ||
              (ReservaFound[i].hora_entrada >= Reserva.hora_entrada && ReservaFound[i].hora_entrada <= Reserva.hora_salida
                && Number(new Date(ReservaFound[i].fecha_entrada).getDate() + 1) == Number(diarese))) {

              console.log('b')

              if (ReservaFound[i].zona_parking.id_zona_parking == Reserva.zona_parking) {

                console.log('3')

                if (ReservaFound[i].cliente.email == cliente.email) {
                  return new HttpException('Ya usted reservo esa zona de parking', HttpStatus.BAD_REQUEST)

                }
                if (ReservaFound[i].cliente.email != cliente.email) {
                  return new HttpException('Ya esta reservada la zona de parking', HttpStatus.BAD_REQUEST)

                }
              }
              else if (ReservaFound[i].zona_parking.id_zona_parking != Reserva.zona_parking &&
                ReservaFound[i].vehiculo.id_vehiculo == Reserva.vehiculo && ReservaFound[i].fin_reserva == false) {
                return new HttpException('El vehiculo con el que desea reservar, ya tiene una reservacion',
                  HttpStatus.BAD_REQUEST)
              }
            }
            if (Number(new Date(ReservaFound[i].fecha_salida).getDate() + 1) == Number(diaress)) {
              console.log('c')
              if (ReservaFound[i].hora_salida >= Reserva.hora_salida || ReservaFound[i].hora_salida >= Reserva.hora_entrada) {
                console.log('d')
                if (ReservaFound[i].zona_parking.id_zona_parking == Reserva.zona_parking) {

                  console.log('3')

                  if (ReservaFound[i].cliente.email == cliente.email) {
                    return new HttpException('Ya usted reservo esa zona de parking', HttpStatus.BAD_REQUEST)

                  }
                  if (ReservaFound[i].cliente.email != cliente.email) {
                    return new HttpException('Ya esta reservada la zona de parking', HttpStatus.BAD_REQUEST)

                  }
                }
                else if (ReservaFound[i].zona_parking.id_zona_parking != Reserva.zona_parking &&
                  ReservaFound[i].vehiculo.id_vehiculo == Reserva.vehiculo && ReservaFound[i].fin_reserva == false) {
                  return new HttpException('El vehiculo con el que desea reservar, ya tiene una reservacion',
                    HttpStatus.BAD_REQUEST)
                }
              }
            }

          }

        }
      }
    }

    const newReserva = await this.reservaRepository.create({
      fecha_entrada: Reserva.fecha_entrada,
      fecha_salida: Reserva.fecha_salida,
      hora_entrada: Reserva.hora_entrada,
      hora_salida: Reserva.hora_salida,
      parking: ParkingFound[0],
      zona_parking: ZonaParkingFound[0],
      vehiculo: VehiculoFound[0],
      cliente: ClienteFound[0],
      fin_reserva: false
    })
    const saveReserva = await this.reservaRepository.save(newReserva)

    const nombre = 'Se ha creado una reservacion'
    this.eventemitter.emit('Reserva Creada', new ReservaEvent(nombre, newReserva.id_reserva))

    await this.zonaparkingRepository.update(ZonaParkingFound[0].id_zona_parking, {
      estado: 'Reservado'
    });
    return saveReserva
  }

  async findAll(cliente: UserActiveInterface) {
    const ReservaFound = await this.reservaRepository.find({
      relations: ['parking', 'zona_parking', 'vehiculo', 'cliente'],
      select: {
        parking: { nombre: true }, zona_parking: { nombre: true }, vehiculo: { matricula: true }, cliente: { nombre: true, apellidos: true },
        fecha_entrada: true, fecha_salida: true, hora_entrada: true, hora_salida: true
      },
      where: {
        cliente: { email: cliente.email },
        fin_reserva: false
      }
    })
    if (!ReservaFound[0]) {
      return new HttpException('Usted no ha realizado ninguna reservacion', HttpStatus.NOT_FOUND)
    }

    return ReservaFound;
  }

  

  async cancelacion(id_reserva: number, cliente: UserActiveInterface) {
    const ReservaFound = await this.reservaRepository.find({
      relations: { cliente: true, zona_parking: true },
      where: { id_reserva }
    })
    if (!ReservaFound[0]) {
      return new HttpException('La reservacion que desea eliminar, no existe', HttpStatus.NOT_FOUND)
    }
    if (ReservaFound[0].cliente.email !== cliente.email && Role.Cliente !== cliente.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }
    const nombre = 'Se ha cancelado una reservacion'
    this.eventemitter.emit('Reserva Cancelada', new ReservaEvent(nombre, ReservaFound[0].id_reserva))
    await this.reservaRepository.softDelete(ReservaFound[0].id_reserva);
    await this.zonaparkingRepository.update(ReservaFound[0].zona_parking.id_zona_parking, { estado: 'Disponible' })
    return ReservaFound[0]
  }
}

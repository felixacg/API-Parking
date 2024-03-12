import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../auth/interface/user - active.interface';
import { Role } from '../common/enums/role.enums';

@Injectable()
export class VehiculoService {
  constructor(@InjectRepository(Vehiculo)
  private vehiculoRepository: Repository<Vehiculo>) { }

  async createVehiculo(Vehiculo: CreateVehiculoDto, cliente: UserActiveInterface) {
    const VehiculoFound = await this.vehiculoRepository.find({
      where: { matricula: Vehiculo.matricula }
    })
    if (VehiculoFound[0]) {
      return new HttpException('El vehículo que intenta ingresar ya existe o está ingresando mal los datos del mismo', HttpStatus.FOUND)
    }
    const regex = /^[0-9]*$/;
    const regexp = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]*$/;
    const marLet = regexp.test(Vehiculo.marca);
    const tipoLet = regexp.test(Vehiculo.tipo);
    if (marLet == false) {
      return new HttpException('El campo Marca solo contiene letras', HttpStatus.BAD_REQUEST)
    }
    if (tipoLet == false) {
      return new HttpException('El campo Tipo solo contiene letras', HttpStatus.BAD_REQUEST)
    }
    if (Vehiculo.tipo != 'auto' && Vehiculo.tipo != 'moto') {
      return new HttpException(`En el campo Tipo debe poner 'auto' para hacer referencia al tipo de vehiculo tal como 'automoviles' o 'moto' para hacer referencia al tipo de vehiculo tal como 'motos'`,
        HttpStatus.BAD_REQUEST,)
    }
    const newVehiculo = await this.vehiculoRepository.create(Vehiculo)
    return await this.vehiculoRepository.save({ ...newVehiculo, clienteEmail: cliente.email });
  }

  async findAll(cliente: UserActiveInterface) {
    return await this.vehiculoRepository.find({
      where: { clienteEmail: cliente.email }
    });
  }

  async findOne(id_vehiculo: number, cliente: UserActiveInterface) {
    const VehiculoFound = await this.vehiculoRepository.findOneBy({ id_vehiculo })
    if (!VehiculoFound) {
      return new HttpException('El vehiculo no existe', HttpStatus.NOT_FOUND)
    }
    if (VehiculoFound.clienteEmail !== cliente.email && Role.Admin !== cliente.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }
    return VehiculoFound;
  }

  async update(id_vehiculo: number, Vehiculo: UpdateVehiculoDto, cliente: UserActiveInterface) {

    const MatriculaFound = await this.vehiculoRepository.find({
      where: { matricula: Vehiculo.matricula }
    })
    if (MatriculaFound[0]) {
      return new HttpException('La matricula de el vehiculo que desea modificar ya existe', HttpStatus.FOUND)
    }
    const VehiculoFound = await this.vehiculoRepository.findOneBy({ id_vehiculo })
    if (!VehiculoFound) {
      return new HttpException('El vehiculo no existe', HttpStatus.NOT_FOUND)
    }
    if (VehiculoFound.clienteEmail !== cliente.email && Role.Admin !== cliente.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }
    const regexp = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]*$/;
    const marLet = regexp.test(Vehiculo.marca);
    const tipoLet = regexp.test(Vehiculo.tipo);
    if (marLet == false) {
      return new HttpException('El campo Marca solo contiene letras', HttpStatus.BAD_REQUEST)
    }
    if (tipoLet == false) {
      return new HttpException('El campo Tipo solo contiene letras', HttpStatus.BAD_REQUEST)
    }
    if (Vehiculo.tipo != 'auto' && Vehiculo.tipo != 'moto') {
      return new HttpException(`En el campo Tipo debe poner 'auto' para hacer referencia al tipo de vehiculo tal como 'automoviles' o 'moto' para hacer referencia al tipo de vehiculo tal como 'motos'`,
        HttpStatus.BAD_REQUEST,)
    }
    const newVehiculo = await this.vehiculoRepository.create({
      marca: Vehiculo.marca,
      matricula: Vehiculo.matricula,
      modelo: Vehiculo.modelo,
      tipo: Vehiculo.tipo,
      clienteEmail: cliente.email
    })
    await this.vehiculoRepository.update(id_vehiculo, newVehiculo);
    return newVehiculo;
  }

  async remove(id_vehiculo: number, cliente: UserActiveInterface) {
    const VehiculoFound = await this.vehiculoRepository.findOneBy({ id_vehiculo })
    if (!VehiculoFound) {
      return new HttpException('El vehiculo no existe', HttpStatus.NOT_FOUND)
    }
    if (VehiculoFound.clienteEmail !== cliente.email && Role.Admin !== cliente.role) {
      return new HttpException('No está autorizado', HttpStatus.UNAUTHORIZED)
    }
    return await this.vehiculoRepository.remove(VehiculoFound) ;
  }
}

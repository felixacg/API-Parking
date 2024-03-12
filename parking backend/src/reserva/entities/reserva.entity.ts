import { Parking } from "../../parking/entities/parking.entity";
import { Cliente } from "../../cliente/entities/cliente.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ZonaParking } from "../../zona_parking/entities/zona_parking.entity";
import { Vehiculo } from "../../vehiculo/entities/vehiculo.entity";
import { Log } from "../../logs/entities/log.entity";

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn()
    id_reserva: number;

    @Column({ type: 'date' })
    fecha_entrada: Date

    @Column({ type: 'date' })
    fecha_salida: Date

    @Column({type: 'time'})
    hora_entrada: Date;

    @Column({ type: 'time' })
    hora_salida: Date;

    @DeleteDateColumn()
    cancelacion: Date

    @Column({default: false})
    fin_reserva: boolean

    @ManyToOne(() => Cliente, (Cliente) => Cliente.id_cliente, { cascade: true })
    @JoinColumn({ name: 'id_cliente' })
    cliente: Cliente;

    @ManyToOne(() => Parking, (Parking) => Parking.id_parking, { cascade: true })
    @JoinColumn({ name: 'id_parking' })
    parking: Parking;

    @ManyToOne(() => ZonaParking, (ZonaParking) => ZonaParking.id_zona_parking, { cascade: true })
    @JoinColumn({ name: 'id_zona_parking' })
    zona_parking: ZonaParking;

    @ManyToOne(() => Vehiculo, (Vehiculo) => Vehiculo.id_vehiculo, { cascade: true })
    @JoinColumn({ name: 'id_vehiculo' })
    vehiculo: Vehiculo;

    @OneToMany(() => Log, (Log) => Log.reserva, {cascade: true})
    logs: Log;
}

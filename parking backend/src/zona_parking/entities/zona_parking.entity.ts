import { Reserva } from "../../reserva/entities/reserva.entity";
import { Parking } from "../../parking/entities/parking.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ZonaParking {
    @PrimaryGeneratedColumn()
    id_zona_parking: number;
    @Column()
    nombre: string;
    @Column({default: 'Disponible'})
    estado: string;
    @ManyToOne(() => Parking, (parking) => parking.zona_parking , { onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'Idparking', referencedColumnName: 'id_parking' })
    parking: Parking;
    @Column()
    Idparking: number;
    @OneToMany(() => Reserva, (Reserva) => Reserva.zona_parking, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    reserva: Reserva;
}
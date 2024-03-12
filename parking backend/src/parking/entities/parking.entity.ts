import { Reserva } from "../../reserva/entities/reserva.entity";
import { Persona } from "../../personas/entities/persona.entity";
import { ZonaParking } from "../../zona_parking/entities/zona_parking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Parking {
    @PrimaryGeneratedColumn()
    id_parking: number;
    @Column()
    nombre: string;
    @Column()
    provincia: string;
    @Column()
    municipio: string;
    @Column()
    direccion: string;
    @Column()
    capacidad: string;

    @OneToMany(() => ZonaParking, (ZonaParking) => ZonaParking.parking, {
        cascade: true
    })
    zona_parking: ZonaParking[];

    @ManyToOne(() => Persona, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'emailAdmin', referencedColumnName: 'email' })
    admin: Persona[];
    @Column()
    emailAdmin: string;

    @OneToMany(() => Persona, (Persona) => Persona.empleado_de, { cascade: true })
    empleado: Persona;

    @OneToMany(() => Reserva, (Reserva) => Reserva.parking, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    reserva: Reserva;
}

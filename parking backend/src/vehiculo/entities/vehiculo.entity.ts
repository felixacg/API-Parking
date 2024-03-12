import { Cliente } from "../../cliente/entities/cliente.entity";
import { Reserva } from "../../reserva/entities/reserva.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehiculo {
    @PrimaryGeneratedColumn()
    id_vehiculo: number;
    @Column()
    marca: string;
    @Column()
    modelo: string;
    @Column({unique: true})
    matricula: string;
    @Column()
    tipo: string;

    @ManyToOne(() => Cliente, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'clienteEmail', referencedColumnName: 'email'})
    cliente: Cliente;
    @Column()
    clienteEmail: string;

    @OneToMany(()=> Reserva, (Reserva) => Reserva.vehiculo, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    reserva: Reserva;
}

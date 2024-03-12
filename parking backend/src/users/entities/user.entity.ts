import { Cliente } from "src/cliente/entities/cliente.entity";
import { Persona } from "src/personas/entities/persona.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column()
    rol: string;

    @OneToOne(() => Persona, (Persona) => Persona.id_persona, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;

    @OneToOne(() => Cliente, (Cliente) => Cliente.id_cliente, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_cliente' })
    cliente: Cliente;
}

import { Reserva } from "../../reserva/entities/reserva.entity";
import { User } from "../../users/entities/user.entity";
import { Vehiculo } from "../../vehiculo/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;
  @Column()
  nombre: string;
  @Column()
  apellidos: string;
  @Column()
  telefono: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: 'cliente' })
  rol: string;
  @DeleteDateColumn({ type: 'date' })
  fecha_baja: Date;


  @OneToOne(() => User, (User) => User.cliente, { cascade: true })
  user: User;

  @OneToMany(() => Reserva, (Reserva) => Reserva.cliente, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  reserva: Reserva;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.cliente, {
    cascade: true,
  })
  cliente: Cliente[];
}

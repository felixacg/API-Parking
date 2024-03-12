import { User } from '../../users/entities/user.entity';
import { Parking } from '../../parking/entities/parking.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number;
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
  @Column()
  rol: string;
  @DeleteDateColumn({ type: 'date' })
  fecha_baja: Date;

  @OneToMany(() => Parking, (Parking) => Parking.admin, {
    cascade: true
  })
  admin_de: Parking;

  @OneToOne(() => User, (User) => User.persona, { cascade: true })
  user: User;

  @ManyToOne(() => Parking, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empleado_de', referencedColumnName: 'id_parking' })
  empleado_de: Parking;
}



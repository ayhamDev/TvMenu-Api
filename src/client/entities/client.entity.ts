import { Device } from "../../device/entities/device.entity";
import { Program } from "../../program/entities/program.entity";
import { Unregistered } from "../../unregistered/entities/unregistered.entity";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Index,
  OneToMany,
} from "typeorm";

@Entity()
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column()
  storeName: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column("text")
  address: string;

  @Column()
  zipCode: string;

  @OneToMany(() => Device, (device) => device.client, {
    nullable: true,
  })
  devices: Device[];

  @OneToMany(() => Unregistered, (Unregistered) => Unregistered.client, {
    nullable: true,
    cascade: true,
  })
  unregisteredDevices: Unregistered[];

  @OneToMany(() => Program, (program) => program.client, {
    nullable: true,
  })
  programs: Program[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Device } from "src/device/entities/device.entity";
import { Program } from "src/program/entities/program.entity";
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
  StoreName: string;

  @Column()
  Country: string;

  @Column()
  State: string;

  @Column()
  City: string;

  @Column("text")
  Address: string;

  @Column()
  ZipCode: string;

  @OneToMany(() => Device, (device) => device.Client, {
    nullable: true,
    cascade: true,
  })
  Devices: Device[];

  @OneToMany(() => Program, (program) => program.Client, {
    nullable: true,
    cascade: true,
  })
  Programs: Program[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

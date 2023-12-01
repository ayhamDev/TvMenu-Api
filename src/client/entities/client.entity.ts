import { Device } from "src/device/entities/device.entity";
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

  @OneToMany(() => Device, (device) => device.Client, {
    nullable: true,
    cascade: true,
  })
  Devices: Device[];

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column()
  Store_Name: string;

  @Column()
  Country: string;

  @Column()
  State: string;

  @Column()
  City: string;

  @Column()
  Address: string;

  @Column()
  Zip_Code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

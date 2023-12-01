import { Client } from "src/client/entities/client.entity";
import { Device } from "src/device/entities/device.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Program {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => Device, { nullable: true })
  @JoinTable({
    name: "programs_devices",
  })
  Devices: Device[];

  @ManyToOne(() => Client, (client) => client.Programs, { nullable: false })
  Client: Client;

  @Column()
  Name: string;

  @Column({ nullable: true })
  Description: string;

  @Column()
  LayerNumber: number;

  @Column()
  Type: number;

  @Column()
  WebUrl: string;

  @Column()
  ImageUrl: string;

  @Column()
  VideoUrl: string;

  @Column()
  Status: string;

  @Column()
  X: number;

  @Column()
  Y: number;

  @Column()
  Width: number;

  @Column()
  Height: number;

  @Column()
  Duration: number;

  @Column()
  NextLoop: number;

  @Column()
  StartAnimation: string;

  @Column()
  EndAnimation: string;

  @Column()
  StartDateTime: string;

  @Column()
  EndDateTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Client } from "src/client/entities/client.entity";
import { Device } from "src/device/entities/device.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column()
  clientId: string;

  @Column()
  Name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column()
  layerNumber: number;

  @Column()
  type: number;

  @Column()
  webUrl: string;

  @Column()
  imageUrl: string;

  @Column()
  videoUrl: string;

  @Column({ default: "Active", nullable: false })
  status: string;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  duration: number;

  @Column()
  nextLoop: number;

  @Column()
  enterAnimation: string;

  @Column()
  leaveAnimation: string;

  @Column()
  startDateTime: string;

  @Column()
  endDateTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Device, { nullable: true })
  @JoinTable({
    name: "programs_devices",
  })
  devices: Device[];

  @ManyToOne(() => Client, (client) => client.programs, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Client;
}

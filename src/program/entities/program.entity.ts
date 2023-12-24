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
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column()
  layerNumber: number;

  @Column()
  type: number;

  @Column({ nullable: true })
  webUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ default: "Active", nullable: false })
  status: string;

  @Column()
  x: string;

  @Column()
  y: string;

  @Column()
  width: string;

  @Column()
  height: string;

  @Column({
    default: 0,
    nullable: true,
  })
  duration: number;

  @Column({
    default: 0,
    nullable: true,
  })
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

  @ManyToOne(() => Client, (client) => client.programs, {
    nullable: false,
  })
  @JoinColumn({ name: "clientId" })
  client: Client;
}

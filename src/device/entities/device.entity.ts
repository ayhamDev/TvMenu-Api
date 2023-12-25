import { Client } from "../../client/entities/client.entity";
import { Program } from "../../program/entities/program.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Device {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column()
  clientId: string;

  @Column({ nullable: true })
  connectionID: string;

  @Column({ nullable: true })
  offlineImage: string;

  @Column({ default: "Active", nullable: false })
  status: string;

  @Column({ nullable: true })
  statusMessage: string;

  @Column({ nullable: true })
  lastOnline: Date;

  @ManyToOne(() => Client, (client) => client.devices, {
    nullable: false,
  })
  @JoinColumn({ name: "clientId" })
  client: Client;

  @ManyToMany(() => Program, (program) => program.devices, { nullable: true })
  programs: Program[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

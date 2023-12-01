import { Client } from "src/client/entities/client.entity";
import { Program } from "src/program/entities/program.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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
  Token: string;

  @Column()
  Name: string;

  @Column("text", { nullable: true })
  Description: string;

  @Column({ nullable: true })
  ConnectionID: string;

  @Column({ nullable: true })
  OfflineImage: string;

  @Column({ default: "Active", nullable: false })
  Status: string;

  @Column({ nullable: true })
  StatusMessage: string;

  @Column({ nullable: true })
  LastOnline: Date;

  @ManyToOne(() => Client, (client) => client.Devices, { nullable: false })
  Client: Client;

  @ManyToMany(() => Program, (program) => program.Devices, { nullable: true })
  Programs: Program[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

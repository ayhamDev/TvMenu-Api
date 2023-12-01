import { Client } from "src/client/entities/client.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

  @Column({ nullable: true })
  Description: string;

  @Column({ nullable: true })
  ConnectionID: string;

  @Column({ nullable: true })
  Offline_Image: string;

  @Column({ default: "Active", nullable: false })
  Status: string;

  @Column({ nullable: true })
  Status_Message: string;

  @Column({ nullable: true })
  Last_Online: Date;

  @ManyToOne(() => Client, (client) => client.Devices, { nullable: false })
  Client: Client;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

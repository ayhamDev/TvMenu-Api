import { Client } from "src/client/entities/client.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

@Entity()
export class Unregistered {
  @PrimaryColumn()
  id: string;

  @Column("text")
  token: string;

  @Column()
  ipAddress: string;

  @VersionColumn()
  requestedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.unregisteredDevices)
  client: Client;
}

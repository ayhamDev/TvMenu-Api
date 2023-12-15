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

  @Column()
  ipAddress: string;

  @VersionColumn({
    default: 1,
    type: "bigint",
  })
  UpdatedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.unregisteredDevices)
  client: Client;
}

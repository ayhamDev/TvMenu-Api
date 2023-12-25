import { Client } from "../../client/entities/client.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  clientId: string;

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

  @ManyToOne(() => Client, (client) => client.unregisteredDevices, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "clientId" })
  client: Client;
}

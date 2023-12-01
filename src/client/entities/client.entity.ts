import { isIn } from "class-validator";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Index,
} from "typeorm";

@Entity()
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

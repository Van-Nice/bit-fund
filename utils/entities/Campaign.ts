// src/entities/Campaign.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("campaigns")
export class Campaign {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 64, unique: true })
  tx_id!: string;

  @Column({ type: "text" })
  project_name!: string;

  @Column({ type: "text" })
  project_description!: string;

  @Column({ type: "bigint" })
  funding_goal!: number;

  @Column({ type: "timestamp with time zone" })
  deadline!: Date;

  @CreateDateColumn({ type: "timestamp with time zone" })
  created_at!: Date;

  @Column({ type: "integer", nullable: true })
  campaign_id?: number;
}

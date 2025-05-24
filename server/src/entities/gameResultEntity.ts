import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";

@Entity("game_results")
export class GameResultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Nameless", length: 64 })
  username: string;

  @Column({ name: "opened_chests" })
  openedChests: number;

  @Column()
  score: number;

  @Column({ type: "enum", enum: DifficultyEnum })
  difficulty: DifficultyEnum;

  @Column({ name: "highest_opened_chest_level", default: 1 })
  highestOpenedChestLevel: number;

  @Column({ name: "socket_id", nullable: true })
  socketId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}

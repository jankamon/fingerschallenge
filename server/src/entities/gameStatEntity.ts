import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("game_stats")
export class GameStatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "players_connected", default: 0 })
  playersConnected: number;

  @Column({ name: "games_played", default: 0 })
  gamesPlayed: number;

  @Column({ name: "chests_opened", default: 0 })
  chestsOpened: number;

  @Column({ name: "chest_patterns_generated", default: 0 })
  chestPatternsGenerated: number;

  @Column({ name: "broken_lockpicks", default: 0 })
  brokenLockpicks: number;

  @Column({ name: "total_lockpick_moves", default: 0 })
  totalLockpickMoves: number;

  @Column({ name: "highest_opened_chest_level", default: 0 })
  highestOpenedChestLevel: number;

  @Column({ name: "highest_score", default: 0 })
  highestScore: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

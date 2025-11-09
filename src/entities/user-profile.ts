import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn("identity")
  user_id = 0n;

  @Column("integer")
  tokens = 0;
}

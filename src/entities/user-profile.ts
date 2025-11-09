import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * This is a person's user profile.
 */
@Entity()
export class UserProfile {
  /**
   * The discord user id for the profile.
   */
  @PrimaryGeneratedColumn("identity")
  user_id = 0n;

  /**
   * The current terminus token count for the user.
   */
  @Column("integer")
  tokens = 0;
}

import { AppDataSource } from "../db";
import { UserProfile } from "../entities/user-profile";

export async function getUser(userId: bigint): Promise<UserProfile | null> {
  const user = await AppDataSource.getRepository(UserProfile).findOne({
    where: { user_id: userId },
  });
  return user;
}

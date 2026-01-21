/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { UserProfile } from "#db";

export function getUser(id: string, guildId: string): Promise<UserProfile | null> {
  return UserProfile.findOneBy({
    id,
    guildId,
  });
}

export function createUser(id: string, guildId: string): UserProfile {
  const user = new UserProfile();
  user.id = id;
  user.guildId = guildId;
  return user;
}

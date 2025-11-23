/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Type of a UUID.
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Entity that represents an achievement that user can get.
 */
@Entity()
export class Achievement extends BaseEntity {
  /**
   * The id of the achievement.
   */
  @PrimaryColumn("uuid")
  id!: UUID;

  /**
   * Name of the achievement.
   */
  @Column("text")
  name!: string;
}

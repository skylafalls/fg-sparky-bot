/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import type { NumberhumanStore } from "../numberdex/store.ts";

export enum EvolutionType {
  None = 0,
  Superscaled = 1,
  Mastered = 2,
  Endfimidian = 3,
  Celestial = 4,
  Eternal = 5,
  Corrotechnic = 6,
  Subeuclidean = 7,
  Zyrolexic = 8,
  Transcendent = 9,
  Corrupt = 10,
  Absolute = 11,
}

/**
 * This entity represents a numberhuman the player has caught.
 */
@Entity({ name: "numberhuman" })
export class NumberhumanData extends BaseEntity {
  /**
   * The UUID for the numberhuman.
   */
  @PrimaryColumn("text")
  id = "";

  /**
   * The specific ability it has, pointed by its id.
   */
  @Column("text")
  ability = "";

  /**
   * The HP multiplier after being caught.
   */
  @Column("float")
  bonusHP = 1;

  /**
   * The attack multiplier after being caught.
   */
  @Column("float")
  bonusAtk = 1;

  /**
   * The current number's level.
   */
  @Column("integer")
  level = 0;

  /**
   * The numberhuman's evolution, which applies a strong buff.
   */
  @Column("integer")
  evolution: EvolutionType = EvolutionType.None;

  /**
   * A pair of the applied evolution buffs.
   */
  @Column("json")
  evolutionPair: [number, number] = [1, 1];

  /**
   * Catch ID, incremented on a new catch.
   */
  @Column("integer")
  catchId = 0;

  /**
   * The total HP of the numberhuman (total HP * bonus HP)
   */
  totalHP(store: NumberhumanStore): number {
    const baseData = store.get(this.id).expect("the numberhuman should exist");
    return baseData.baseHP * this.bonusHP * this.evolutionPair[0];
  }

  /**
   * The total attack of the numberhuman (total ATK * bonus ATK)
   */
  totalAtk(store: NumberhumanStore): number {
    const baseData = store.get(this.id).expect("the numberhuman should exist");
    return baseData.baseATK * this.bonusAtk * this.evolutionPair[1];
  }
}

import gql from "graphql-tag";

import type { GraphQLClient } from "graphql-request";
import type * as Dom from "graphql-request/dist/types.dom";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

/** A bracket description for a given raid zone. Brackets have a minimum value, maximum value, and a bucket that can be used to establish all of the possible brackets. The type field indicates what the brackets represent, e.g., item levels or game patches, etc. */
export type Bracket = {
  readonly __typename?: "Bracket";
  /** An integer representing the minimum value used by bracket number 1, etc. */
  readonly min: Scalars["Float"];
  /** An integer representing the value used by bracket N when there are a total of N brackets, etc. */
  readonly max: Scalars["Float"];
  /** A float representing the value to increment when moving from bracket 1 to bracket N, etc. */
  readonly bucket: Scalars["Float"];
  /** The localized name of the bracket type. */
  readonly type: Scalars["String"];
};

/** A player character. Characters can earn individual rankings and appear in reports. */
export type Character = {
  readonly __typename?: "Character";
  /** The canonical ID of the character. If a character renames or transfers, then the canonical id can be used to identify the most recent version of the character. */
  readonly canonicalID: Scalars["Int"];
  /** The class id of the character. */
  readonly classID: Scalars["Int"];
  /** Encounter rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly encounterRankings?: Maybe<Scalars["JSON"]>;
  /** The faction of the character. */
  readonly faction: GameFaction;
  /** Cached game data such as gear for the character. This data was fetched from the appropriate source (Blizzard APIs for WoW, XIVAPI for FF). This call will only return a cached copy of the data if it exists already. It will not go out to Blizzard or XIVAPI to fetch a new copy. */
  readonly gameData?: Maybe<Scalars["JSON"]>;
  /** The guild rank of the character in their primary guild. This is not the user rank on the site, but the rank according to the game data, e.g., a Warcraft guild rank or an FFXIV Free Company rank. */
  readonly guildRank: Scalars["Int"];
  /** All guilds that the character belongs to. */
  readonly guilds?: Maybe<readonly Maybe<Guild>[]>;
  /** Whether or not the character has all its rankings hidden. */
  readonly hidden: Scalars["Boolean"];
  /** The ID of the character. */
  readonly id: Scalars["Int"];
  /** The level of the character. */
  readonly level: Scalars["Int"];
  /** The name of the character. */
  readonly name: Scalars["String"];
  /** Recent reports for the character. */
  readonly recentReports?: Maybe<ReportPagination>;
  /** The server that the character belongs to. */
  readonly server: Server;
  /** Rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly zoneRankings?: Maybe<Scalars["JSON"]>;
};

/** A player character. Characters can earn individual rankings and appear in reports. */
export type CharacterEncounterRankingsArgs = {
  byBracket?: Maybe<Scalars["Boolean"]>;
  compare?: Maybe<RankingCompareType>;
  difficulty?: Maybe<Scalars["Int"]>;
  encounterID?: Maybe<Scalars["Int"]>;
  includeCombatantInfo?: Maybe<Scalars["Boolean"]>;
  includePrivateLogs?: Maybe<Scalars["Boolean"]>;
  metric?: Maybe<CharacterRankingMetricType>;
  partition?: Maybe<Scalars["Int"]>;
  role?: Maybe<RoleType>;
  size?: Maybe<Scalars["Int"]>;
  specName?: Maybe<Scalars["String"]>;
  timeframe?: Maybe<RankingTimeframeType>;
};

/** A player character. Characters can earn individual rankings and appear in reports. */
export type CharacterGameDataArgs = {
  specID?: Maybe<Scalars["Int"]>;
};

/** A player character. Characters can earn individual rankings and appear in reports. */
export type CharacterRecentReportsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** A player character. Characters can earn individual rankings and appear in reports. */
export type CharacterZoneRankingsArgs = {
  byBracket?: Maybe<Scalars["Boolean"]>;
  compare?: Maybe<RankingCompareType>;
  difficulty?: Maybe<Scalars["Int"]>;
  includePrivateLogs?: Maybe<Scalars["Boolean"]>;
  metric?: Maybe<CharacterRankingMetricType>;
  partition?: Maybe<Scalars["Int"]>;
  role?: Maybe<RoleType>;
  size?: Maybe<Scalars["Int"]>;
  specName?: Maybe<Scalars["String"]>;
  timeframe?: Maybe<RankingTimeframeType>;
  zoneID?: Maybe<Scalars["Int"]>;
};

/** The CharacterData object enables the retrieval of single characters or filtered collections of characters. */
export type CharacterData = {
  readonly __typename?: "CharacterData";
  /** Obtain a specific character either by id or by name/server_slug/server_region. */
  readonly character?: Maybe<Character>;
  /** A collection of characters for a specific guild. */
  readonly characters?: Maybe<CharacterPagination>;
};

/** The CharacterData object enables the retrieval of single characters or filtered collections of characters. */
export type CharacterDataCharacterArgs = {
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  serverSlug?: Maybe<Scalars["String"]>;
  serverRegion?: Maybe<Scalars["String"]>;
};

/** The CharacterData object enables the retrieval of single characters or filtered collections of characters. */
export type CharacterDataCharactersArgs = {
  guildID?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type CharacterPagination = {
  readonly __typename?: "CharacterPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<Character>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** All the possible metrics. */
export enum CharacterRankingMetricType {
  /** Boss damage per second. */
  Bossdps = "bossdps",
  /** Boss rDPS is unique to FFXIV and is damage done to the boss adjusted for raid-contributing buffs and debuffs. */
  Bossrdps = "bossrdps",
  /** Choose an appropriate default depending on the other selected parameters. */
  Default = "default",
  /** Damage per second. */
  Dps = "dps",
  /** Healing per second. */
  Hps = "hps",
  /** Survivability ranking for tanks. Deprecated. Only supported for some older WoW zones. */
  Krsi = "krsi",
  /** Score. Used by WoW Mythic dungeons and by ESO trials. */
  Playerscore = "playerscore",
  /** Speed. Not supported by every zone. */
  Playerspeed = "playerspeed",
  /** rDPS is unique to FFXIV and is damage done adjusted for raid-contributing buffs and debuffs. */
  Rdps = "rdps",
  /** Healing done per second to tanks. */
  Tankhps = "tankhps",
  /** Weighted damage per second. Unique to WoW currently. Used to remove pad damage and reward damage done to high priority targets. */
  Wdps = "wdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in 8-man content. */
  Healercombineddps = "healercombineddps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in 8-man content. */
  Healercombinedbossdps = "healercombinedbossdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in 8-man content. */
  Healercombinedrdps = "healercombinedrdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in 8-man content. */
  Healercombinedbossrdps = "healercombinedbossrdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in 8-man content. */
  Tankcombineddps = "tankcombineddps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in 8-man content. */
  Tankcombinedbossdps = "tankcombinedbossdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in 8-man content. */
  Tankcombinedrdps = "tankcombinedrdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in 8-man content. */
  Tankcombinedbossrdps = "tankcombinedbossrdps",
}

/** A single difficulty for a given raid zone. Difficulties have an integer value representing the actual difficulty, a localized name that describes the difficulty level, and a list of valid sizes for the difficulty level. */
export type Difficulty = {
  readonly __typename?: "Difficulty";
  /** An integer representing a specific difficulty level within a zone. For example, in World of Warcraft, this could be Mythic. In FF, it could be Savage, etc. */
  readonly id: Scalars["Int"];
  /** The localized name for the difficulty level. */
  readonly name: Scalars["String"];
  /** A list of supported sizes for the difficulty level. An empty result means that the difficulty level has a flexible raid size. */
  readonly sizes?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
};

/** A single encounter for the game. */
export type Encounter = {
  readonly __typename?: "Encounter";
  /** The ID of the encounter. */
  readonly id: Scalars["Int"];
  /** The localized name of the encounter. */
  readonly name: Scalars["String"];
  /** Player rankings information for a zone. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly characterRankings?: Maybe<Scalars["JSON"]>;
  /** Fight rankings information for a zone. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly fightRankings?: Maybe<Scalars["JSON"]>;
  /** The zone that this encounter is found in. */
  readonly zone: Zone;
  /** The Blizzard journal ID, used as the identifier in the encounter journal and various Blizzard APIs like progression. */
  readonly journalID: Scalars["Int"];
};

/** A single encounter for the game. */
export type EncounterCharacterRankingsArgs = {
  bracket?: Maybe<Scalars["Int"]>;
  className?: Maybe<Scalars["String"]>;
  difficulty?: Maybe<Scalars["Int"]>;
  filter?: Maybe<Scalars["String"]>;
  includeCombatantInfo?: Maybe<Scalars["Boolean"]>;
  metric?: Maybe<CharacterRankingMetricType>;
  page?: Maybe<Scalars["Int"]>;
  partition?: Maybe<Scalars["Int"]>;
  serverRegion?: Maybe<Scalars["String"]>;
  serverSlug?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Int"]>;
  specName?: Maybe<Scalars["String"]>;
};

/** A single encounter for the game. */
export type EncounterFightRankingsArgs = {
  bracket?: Maybe<Scalars["Int"]>;
  difficulty?: Maybe<Scalars["Int"]>;
  filter?: Maybe<Scalars["String"]>;
  metric?: Maybe<FightRankingMetricType>;
  page?: Maybe<Scalars["Int"]>;
  partition?: Maybe<Scalars["Int"]>;
  serverRegion?: Maybe<Scalars["String"]>;
  serverSlug?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Int"]>;
};

/** The type of events or tables to examine. */
export enum EventDataType {
  /** All Events */
  All = "All",
  /** Buffs. */
  Buffs = "Buffs",
  /** Casts. */
  Casts = "Casts",
  /** Combatant info events (includes gear). */
  CombatantInfo = "CombatantInfo",
  /** Damage done. */
  DamageDone = "DamageDone",
  /** Damage taken. */
  DamageTaken = "DamageTaken",
  /** Deaths. */
  Deaths = "Deaths",
  /** Debuffs. */
  Debuffs = "Debuffs",
  /** Dispels. */
  Dispels = "Dispels",
  /** Healing done. */
  Healing = "Healing",
  /** Interrupts. */
  Interrupts = "Interrupts",
  /** Resources. */
  Resources = "Resources",
  /** Summons */
  Summons = "Summons",
  /** Threat. */
  Threat = "Threat",
}

/** A single expansion for the game. */
export type Expansion = {
  readonly __typename?: "Expansion";
  /** The ID of the expansion. */
  readonly id: Scalars["Int"];
  /** The localized name of the expansion. */
  readonly name: Scalars["String"];
  /** The zones (e.g., raids and dungeons) supported for this expansion. */
  readonly zones?: Maybe<readonly Maybe<Zone>[]>;
};

/** All the possible metrics. */
export enum FightRankingMetricType {
  /** Choose an appropriate default depending on the other selected parameters. */
  Default = "default",
  /** A metric that rewards minimizing deaths and damage taken. */
  Execution = "execution",
  /** Feats of strength in WoW or Challenges in FF. */
  Feats = "feats",
  /** For Mythic+ dungeons in WoW, represents the team's score. Used for ESO trials and dungeons also. */
  Score = "score",
  /** Speed metric, based off the duration of the fight. */
  Speed = "speed",
}

/** A single ability for the game. */
export type GameAbility = {
  readonly __typename?: "GameAbility";
  /** The ID of the ability. */
  readonly id: Scalars["Int"];
  /** A description for the ability if it is available. */
  readonly description?: Maybe<Scalars["String"]>;
  /** The icon for the ability. */
  readonly icon?: Maybe<Scalars["String"]>;
  /** The localized name of the ability. Will be null if no localization information exists for the ability. */
  readonly name?: Maybe<Scalars["String"]>;
};

export type GameAbilityPagination = {
  readonly __typename?: "GameAbilityPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<GameAbility>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** A single achievement for the game. */
export type GameAchievement = {
  readonly __typename?: "GameAchievement";
  /** The ID of the achievement. */
  readonly id: Scalars["Int"];
  /** The icon for the achievement. */
  readonly icon?: Maybe<Scalars["String"]>;
  /** The localized name of the achievement. Will be null if no localization information exists for the achievement. */
  readonly name?: Maybe<Scalars["String"]>;
};

export type GameAchievementPagination = {
  readonly __typename?: "GameAchievementPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<GameAchievement>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** A single affix for Mythic Keystone dungeons. */
export type GameAffix = {
  readonly __typename?: "GameAffix";
  /** The ID of the affix. */
  readonly id: Scalars["Int"];
  /** The icon for the affix. */
  readonly icon?: Maybe<Scalars["String"]>;
  /** The localized name of the affix. Will be null if no localization information exists for the affix. */
  readonly name?: Maybe<Scalars["String"]>;
};

/** A single player class for the game. */
export type GameClass = {
  readonly __typename?: "GameClass";
  /** An integer used to identify the class. */
  readonly id: Scalars["Int"];
  /** The localized name of the class. */
  readonly name: Scalars["String"];
  /** A slug used to identify the class. */
  readonly slug: Scalars["String"];
  /** The specs supported by the class. */
  readonly specs?: Maybe<readonly Maybe<Spec>[]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameData = {
  readonly __typename?: "GameData";
  /** The player and enemy abilities for the game. */
  readonly abilities?: Maybe<GameAbilityPagination>;
  /** Obtain a single ability for the game. */
  readonly ability?: Maybe<GameAbility>;
  /** Obtain a single achievement for the game. */
  readonly achievement?: Maybe<GameAchievement>;
  /** Achievements for the game. */
  readonly achievements?: Maybe<GameAchievementPagination>;
  /** Obtain a single affix for the game. */
  readonly affix?: Maybe<GameAffix>;
  /** The affixes for the game. */
  readonly affixes?: Maybe<readonly Maybe<GameAffix>[]>;
  /** Obtain a single class for the game. */
  readonly class?: Maybe<GameClass>;
  /** Obtain the supported classes for the game. */
  readonly classes?: Maybe<readonly Maybe<GameClass>[]>;
  /** Obtain a single enchant for the game. */
  readonly enchant?: Maybe<GameEnchant>;
  /** Enchants for the game. */
  readonly enchants?: Maybe<GameEnchantPagination>;
  /** Obtain all the factions that guilds and players can belong to. */
  readonly factions?: Maybe<readonly Maybe<GameFaction>[]>;
  /** Obtain a single map for the game. */
  readonly map?: Maybe<GameMap>;
  /** Maps for the game. */
  readonly maps?: Maybe<GameMapPagination>;
  /** Obtain a single NPC for the game. */
  readonly npc?: Maybe<GameNpc>;
  /** NPCs for the game. */
  readonly npcs?: Maybe<GameNpcPagination>;
  /** Obtain a single zone for the game, not to be confused with the worldData zones for ranking bosses and dungeons. */
  readonly zone?: Maybe<GameZone>;
  /** Zones for the game. */
  readonly zones?: Maybe<GameZonePagination>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataAbilitiesArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataAbilityArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataAchievementArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataAchievementsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataAffixArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataClassArgs = {
  id?: Maybe<Scalars["Int"]>;
  faction_id?: Maybe<Scalars["Int"]>;
  zone_id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataClassesArgs = {
  faction_id?: Maybe<Scalars["Int"]>;
  zone_id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataEnchantArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataEnchantsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataMapArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataMapsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataNpcArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataNpcsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataZoneArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataZonesArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** A single enchant for the game. */
export type GameEnchant = {
  readonly __typename?: "GameEnchant";
  /** The ID of the enchant. */
  readonly id: Scalars["Int"];
  /** The localized name of the enchant. Will be null if no localization information exists for the enchant. */
  readonly name?: Maybe<Scalars["String"]>;
};

export type GameEnchantPagination = {
  readonly __typename?: "GameEnchantPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<GameEnchant>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** A faction that a player or guild can belong to. Factions have an integer id used to identify them throughout the API and a localized name describing the faction. */
export type GameFaction = {
  readonly __typename?: "GameFaction";
  /** An integer representing the faction id. */
  readonly id: Scalars["Int"];
  /** The localized name of the faction. */
  readonly name: Scalars["String"];
};

/** A single item for the game. */
export type GameItem = {
  readonly __typename?: "GameItem";
  /** The ID of the item. */
  readonly id: Scalars["Int"];
  /** The icon for the item. */
  readonly icon?: Maybe<Scalars["String"]>;
  /** The localized name of the item. Will be null if no localization information exists for the item. */
  readonly name?: Maybe<Scalars["String"]>;
};

/** A single item set for the game. */
export type GameItemSet = {
  readonly __typename?: "GameItemSet";
  /** The ID of the item set. */
  readonly id: Scalars["Int"];
  /** The localized name of the item set. Will be null if no localization information exists for the item set. */
  readonly name?: Maybe<Scalars["String"]>;
};

/** A single map for the game. */
export type GameMap = {
  readonly __typename?: "GameMap";
  /** The ID of the mao. */
  readonly id: Scalars["Int"];
  /** The localized name of the map. Will be null if no localization information exists for the map. */
  readonly name?: Maybe<Scalars["String"]>;
};

export type GameMapPagination = {
  readonly __typename?: "GameMapPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<GameMap>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** A single NPC for the game. */
export type GameNpc = {
  readonly __typename?: "GameNPC";
  /** The ID of the NPC. */
  readonly id: Scalars["Int"];
  /** The localized name of the NPC. Will be null if no localization information exists for the NPC. */
  readonly name?: Maybe<Scalars["String"]>;
};

export type GameNpcPagination = {
  readonly __typename?: "GameNPCPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<GameNpc>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** A single zone for the game. */
export type GameZone = {
  readonly __typename?: "GameZone";
  /** The ID of the zone. */
  readonly id: Scalars["Int"];
  /** The localized name of the zone. Will be null if no localization information exists for the zone. */
  readonly name?: Maybe<Scalars["String"]>;
};

export type GameZonePagination = {
  readonly __typename?: "GameZonePagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<GameZone>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** The type of graph to examine. */
export enum GraphDataType {
  /** Summary Overview */
  Summary = "Summary",
  /** Buffs. */
  Buffs = "Buffs",
  /** Casts. */
  Casts = "Casts",
  /** Damage done. */
  DamageDone = "DamageDone",
  /** Damage taken. */
  DamageTaken = "DamageTaken",
  /** Deaths. */
  Deaths = "Deaths",
  /** Debuffs. */
  Debuffs = "Debuffs",
  /** Dispels. */
  Dispels = "Dispels",
  /** Healing done. */
  Healing = "Healing",
  /** Interrupts. */
  Interrupts = "Interrupts",
  /** Resources. */
  Resources = "Resources",
  /** Summons */
  Summons = "Summons",
  /** Survivability (death info across multiple pulls). */
  Survivability = "Survivability",
  /** Threat. */
  Threat = "Threat",
}

/** A single guild. Guilds earn their own rankings and contain characters. They may correspond to a guild in-game or be a custom guild created just to hold reports and rankings. */
export type Guild = {
  readonly __typename?: "Guild";
  readonly attendance: GuildAttendancePagination;
  /** Whether or not the guild has competition mode enabled. */
  readonly competitionMode: Scalars["Boolean"];
  /** The description for the guild that is displayed with the guild name on the site. */
  readonly description: Scalars["String"];
  /** The faction of the guild. */
  readonly faction: GameFaction;
  /** The ID of the guild. */
  readonly id: Scalars["Int"];
  /** The name of the guild. */
  readonly name: Scalars["String"];
  /** The server that the guild belongs to. */
  readonly server: Server;
  /** Whether or not the guild has stealth mode enabled. */
  readonly stealthMode: Scalars["Boolean"];
  /** The tags used to label reports. In the site UI, these are called raid teams. */
  readonly tags?: Maybe<readonly Maybe<GuildTag>[]>;
  /** The member roster for a specific guild. The result of this query is a paginated list of characters. This query only works for games where the guild roster is verifiable, e.g., it does not work for Classic Warcraft. */
  readonly members: CharacterPagination;
};

/** A single guild. Guilds earn their own rankings and contain characters. They may correspond to a guild in-game or be a custom guild created just to hold reports and rankings. */
export type GuildAttendanceArgs = {
  guildTagID?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  zoneID?: Maybe<Scalars["Int"]>;
};

/** A single guild. Guilds earn their own rankings and contain characters. They may correspond to a guild in-game or be a custom guild created just to hold reports and rankings. */
export type GuildMembersArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** Attendance for a specific report within a guild. */
export type GuildAttendance = {
  readonly __typename?: "GuildAttendance";
  /** The code of the report for the raid night. */
  readonly code: Scalars["String"];
  /** The players that attended that raid night. */
  readonly players?: Maybe<readonly Maybe<PlayerAttendance>[]>;
  /** The start time of the raid night. */
  readonly startTime?: Maybe<Scalars["Float"]>;
  /** The principal zone of the raid night. */
  readonly zone?: Maybe<Zone>;
};

export type GuildAttendancePagination = {
  readonly __typename?: "GuildAttendancePagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<GuildAttendance>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** The GuildData object enables the retrieval of single guilds or filtered collections of guilds. */
export type GuildData = {
  readonly __typename?: "GuildData";
  /** Obtain a specific guild either by id or by name/serverSlug/serverRegion. */
  readonly guild?: Maybe<Guild>;
  /** The set of all guilds supported by the site. Can be optionally filtered to a specific server id. */
  readonly guilds?: Maybe<GuildPagination>;
};

/** The GuildData object enables the retrieval of single guilds or filtered collections of guilds. */
export type GuildDataGuildArgs = {
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  serverSlug?: Maybe<Scalars["String"]>;
  serverRegion?: Maybe<Scalars["String"]>;
};

/** The GuildData object enables the retrieval of single guilds or filtered collections of guilds. */
export type GuildDataGuildsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  serverID?: Maybe<Scalars["Int"]>;
  serverSlug?: Maybe<Scalars["String"]>;
  serverRegion?: Maybe<Scalars["String"]>;
};

export type GuildPagination = {
  readonly __typename?: "GuildPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<Guild>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** The tag for a specific guild. Tags can be used to categorize reports within a guild. In the site UI, they are referred to as report tags. */
export type GuildTag = {
  readonly __typename?: "GuildTag";
  /** The ID of the tag. */
  readonly id: Scalars["Int"];
  /** The guild that the tag belongs to. */
  readonly guild: Guild;
  /** The name of the guild. */
  readonly name: Scalars["String"];
};

/** Whether or not to fetch information for friendlies or enemies. */
export enum HostilityType {
  /** Fetch information for friendlies. */
  Friendlies = "Friendlies",
  /** Fetch information for enemies. */
  Enemies = "Enemies",
}

/** A filter for kills vs wipes and encounters vs trash. */
export enum KillType {
  /** Include trash and encounters. */
  All = "All",
  /** Only include encounters (kills and wipes). */
  Encounters = "Encounters",
  /** Only include encounters that end in a kill. */
  Kills = "Kills",
  /** Only include trash. */
  Trash = "Trash",
  /** Only include encounters that end in a wipe. */
  Wipes = "Wipes",
}

/** A single partition for a given raid zone. Partitions have an integer value representing the actual partition and a localized name that describes what the partition represents. Partitions contain their own rankings, statistics and all stars. */
export type Partition = {
  readonly __typename?: "Partition";
  /** An integer representing a specific partition within a zone. */
  readonly id: Scalars["Int"];
  /** The localized name for partition. */
  readonly name: Scalars["String"];
  /** The compact localized name for the partition. Typically an abbreviation to conserve space. */
  readonly compactName: Scalars["String"];
  /** Whether or not the partition is the current default when viewing rankings or statistics for the zone. */
  readonly default: Scalars["Boolean"];
};

/** Attendance for a specific player on a specific raid night. */
export type PlayerAttendance = {
  readonly __typename?: "PlayerAttendance";
  /** The name of the player. */
  readonly name?: Maybe<Scalars["String"]>;
  /** The class of the player. */
  readonly type?: Maybe<Scalars["String"]>;
  /** Presence info for the player. A value of 1 means the player was present. A value of 2 indicates present but on the bench. */
  readonly presence?: Maybe<Scalars["Int"]>;
};

/** A way to obtain data for the top guilds involved in an ongoing world first or realm first progress race. */
export type ProgressRaceData = {
  readonly __typename?: "ProgressRaceData";
  /** Progress race information including best percentages, pull counts and streams for top guilds. This API is only active when there is an ongoing race. The format of this JSON may change without notice and is not considered frozen. */
  readonly progressRace?: Maybe<Scalars["JSON"]>;
};

/** A way to obtain data for the top guilds involved in an ongoing world first or realm first progress race. */
export type ProgressRaceDataProgressRaceArgs = {
  serverRegion?: Maybe<Scalars["String"]>;
  serverSlug?: Maybe<Scalars["String"]>;
};

export type Query = {
  readonly __typename?: "Query";
  /** Obtain the character data object that allows the retrieval of individual characters or filtered collections of characters. */
  readonly characterData?: Maybe<CharacterData>;
  /** Obtain the game data object that holds collections of static data such as abilities, achievements, classes, items, NPCs, etc.. */
  readonly gameData?: Maybe<GameData>;
  /** Obtain the guild data object that allows the retrieval of individual guilds or filtered collections of guilds. */
  readonly guildData?: Maybe<GuildData>;
  /** Obtain information about an ongoing world first or realm first race. Inactive when no race is occurring. This data only updates once every 30 seconds, so you do not need to fetch this information more often than that. */
  readonly progressRaceData?: Maybe<ProgressRaceData>;
  /** Obtain the rate limit data object to see how many points have been spent by this key. */
  readonly rateLimitData?: Maybe<RateLimitData>;
  /** Obtain the report data object that allows the retrieval of individual reports or filtered collections of reports by guild or by user. */
  readonly reportData?: Maybe<ReportData>;
  /** Obtain the world data object that holds collections of data such as all expansions, regions, subregions, servers, dungeon/raid zones, and encounters. */
  readonly worldData?: Maybe<WorldData>;
};

/** Whether or not rankings are compared against best scores for the entire tier or against all parses in a two week window. */
export enum RankingCompareType {
  /** Compare against rankings. */
  Rankings = "Rankings",
  /** Compare against all parses in a two week window. */
  Parses = "Parses",
}

/** Whether or not rankings are today or historical. */
export enum RankingTimeframeType {
  /** Compare against today's rankings. */
  Today = "Today",
  /** Compare against historical rankings. */
  Historical = "Historical",
}

/** A way to obtain your current rate limit usage. */
export type RateLimitData = {
  readonly __typename?: "RateLimitData";
  /** The total amount of points this API key can spend per hour. */
  readonly limitPerHour: Scalars["Int"];
  /** The total amount of points spent during this hour. */
  readonly pointsSpentThisHour: Scalars["Float"];
  /** The number of seconds remaining until the points reset. */
  readonly pointsResetIn: Scalars["Int"];
};

/** A single region for the game. */
export type Region = {
  readonly __typename?: "Region";
  /** The ID of the region. */
  readonly id: Scalars["Int"];
  /** The localized compact name of the region, e.g., US for United States. */
  readonly compactName: Scalars["String"];
  /** The localized name of the region. */
  readonly name: Scalars["String"];
  /** The slug for the region, usable when looking up characters and guilds by server. */
  readonly slug: Scalars["String"];
  /** The subregions found within this region. */
  readonly subregions?: Maybe<readonly Maybe<Subregion>[]>;
  /** The servers found within this region. */
  readonly servers?: Maybe<ServerPagination>;
};

/** A single region for the game. */
export type RegionServersArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type Report = {
  readonly __typename?: "Report";
  /** The report code, a unique value used to identify the report. */
  readonly code: Scalars["String"];
  /** The end time of the report. This is a UNIX timestamp representing the timestamp of the last event contained in the report. */
  readonly endTime: Scalars["Float"];
  /** A set of paginated report events, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly events?: Maybe<ReportEventPaginator>;
  /** The number of exported segments in the report. This is how many segments have been processed for rankings. */
  readonly exportedSegments: Scalars["Int"];
  /** A set of fights with details about participating players. */
  readonly fights?: Maybe<readonly Maybe<ReportFight>[]>;
  /** A graph of information for a report, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly graph?: Maybe<Scalars["JSON"]>;
  /** The guild that the report belongs to. If this is null, then the report was uploaded to the user's personal logs. */
  readonly guild?: Maybe<Guild>;
  /** The guild tag that the report belongs to. If this is null, then the report was not tagged. */
  readonly guildTag?: Maybe<GuildTag>;
  /** The user that uploaded the report. */
  readonly owner?: Maybe<User>;
  /** Data from the report's master file. This includes version info, all of the players, NPCs and pets that occur in the report, and all the game abilities used in the report. */
  readonly masterData?: Maybe<ReportMasterData>;
  /** A list of all characters that ranked on kills in the report. */
  readonly rankedCharacters?: Maybe<readonly Maybe<Character>[]>;
  /** Rankings information for a report, filterable to specific fights, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly rankings?: Maybe<Scalars["JSON"]>;
  /** The region of the report. */
  readonly region?: Maybe<Region>;
  /** The revision of the report. This number is increased when reports get re-exported. */
  readonly revision: Scalars["Int"];
  /** The number of uploaded segments in the report. */
  readonly segments: Scalars["Int"];
  /** The start time of the report. This is a UNIX timestamp representing the timestamp of the first event contained in the report. */
  readonly startTime: Scalars["Float"];
  /** A table of information for a report, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  readonly table?: Maybe<Scalars["JSON"]>;
  /** A title for the report. */
  readonly title: Scalars["String"];
  /** The visibility level of the report. The possible values are 'public', 'private', and 'unlisted'. */
  readonly visibility: Scalars["String"];
  /** The principal zone that the report contains fights for. Null if no supported zone exists. */
  readonly zone?: Maybe<Zone>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type ReportEventsArgs = {
  abilityID?: Maybe<Scalars["Float"]>;
  dataType?: Maybe<EventDataType>;
  death?: Maybe<Scalars["Int"]>;
  difficulty?: Maybe<Scalars["Int"]>;
  encounterID?: Maybe<Scalars["Int"]>;
  endTime?: Maybe<Scalars["Float"]>;
  fightIDs?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  filterExpression?: Maybe<Scalars["String"]>;
  hostilityType?: Maybe<HostilityType>;
  includeResources?: Maybe<Scalars["Boolean"]>;
  killType?: Maybe<KillType>;
  limit?: Maybe<Scalars["Int"]>;
  sourceClass?: Maybe<Scalars["String"]>;
  sourceID?: Maybe<Scalars["Int"]>;
  sourceInstanceID?: Maybe<Scalars["Int"]>;
  startTime?: Maybe<Scalars["Float"]>;
  targetClass?: Maybe<Scalars["String"]>;
  targetID?: Maybe<Scalars["Int"]>;
  targetInstanceID?: Maybe<Scalars["Int"]>;
  translate?: Maybe<Scalars["Boolean"]>;
  viewOptions?: Maybe<Scalars["Int"]>;
  wipeCutoff?: Maybe<Scalars["Int"]>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type ReportFightsArgs = {
  difficulty?: Maybe<Scalars["Int"]>;
  encounterID?: Maybe<Scalars["Int"]>;
  fightIDs?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  killType?: Maybe<KillType>;
  translate?: Maybe<Scalars["Boolean"]>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type ReportGraphArgs = {
  abilityID?: Maybe<Scalars["Float"]>;
  dataType?: Maybe<GraphDataType>;
  death?: Maybe<Scalars["Int"]>;
  difficulty?: Maybe<Scalars["Int"]>;
  encounterID?: Maybe<Scalars["Int"]>;
  endTime?: Maybe<Scalars["Float"]>;
  fightIDs?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  filterExpression?: Maybe<Scalars["String"]>;
  hostilityType?: Maybe<HostilityType>;
  killType?: Maybe<KillType>;
  sourceClass?: Maybe<Scalars["String"]>;
  sourceID?: Maybe<Scalars["Int"]>;
  sourceInstanceID?: Maybe<Scalars["Int"]>;
  startTime?: Maybe<Scalars["Float"]>;
  targetClass?: Maybe<Scalars["String"]>;
  targetID?: Maybe<Scalars["Int"]>;
  targetInstanceID?: Maybe<Scalars["Int"]>;
  translate?: Maybe<Scalars["Boolean"]>;
  viewOptions?: Maybe<Scalars["Int"]>;
  viewBy?: Maybe<ViewType>;
  wipeCutoff?: Maybe<Scalars["Int"]>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type ReportMasterDataArgs = {
  translate?: Maybe<Scalars["Boolean"]>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type ReportRankingsArgs = {
  compare?: Maybe<RankingCompareType>;
  difficulty?: Maybe<Scalars["Int"]>;
  encounterID?: Maybe<Scalars["Int"]>;
  fightIDs?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  playerMetric?: Maybe<ReportRankingMetricType>;
  timeframe?: Maybe<RankingTimeframeType>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type ReportTableArgs = {
  abilityID?: Maybe<Scalars["Float"]>;
  dataType?: Maybe<TableDataType>;
  death?: Maybe<Scalars["Int"]>;
  difficulty?: Maybe<Scalars["Int"]>;
  encounterID?: Maybe<Scalars["Int"]>;
  endTime?: Maybe<Scalars["Float"]>;
  fightIDs?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  filterExpression?: Maybe<Scalars["String"]>;
  hostilityType?: Maybe<HostilityType>;
  killType?: Maybe<KillType>;
  sourceClass?: Maybe<Scalars["String"]>;
  sourceID?: Maybe<Scalars["Int"]>;
  sourceInstanceID?: Maybe<Scalars["Int"]>;
  startTime?: Maybe<Scalars["Float"]>;
  targetClass?: Maybe<Scalars["String"]>;
  targetID?: Maybe<Scalars["Int"]>;
  targetInstanceID?: Maybe<Scalars["Int"]>;
  translate?: Maybe<Scalars["Boolean"]>;
  viewOptions?: Maybe<Scalars["Int"]>;
  viewBy?: Maybe<ViewType>;
  wipeCutoff?: Maybe<Scalars["Int"]>;
};

/** The ReportAbility represents a single ability that occurs in the report. */
export type ReportAbility = {
  readonly __typename?: "ReportAbility";
  /** The game ID of the ability. */
  readonly gameID?: Maybe<Scalars["Float"]>;
  /** An icon to use for the ability. */
  readonly icon?: Maybe<Scalars["String"]>;
  /** The name of the actor. */
  readonly name?: Maybe<Scalars["String"]>;
  /** The type of the ability. This represents the type of damage (e.g., the spell school in WoW). */
  readonly type?: Maybe<Scalars["String"]>;
};

/** The ReportActor represents a single player, pet or NPC that occurs in the report. */
export type ReportActor = {
  readonly __typename?: "ReportActor";
  /** The game ID of the actor. */
  readonly gameID?: Maybe<Scalars["Float"]>;
  /** An icon to use for the actor. For pets and NPCs, this will be the icon the site chose to represent that actor. */
  readonly icon?: Maybe<Scalars["String"]>;
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  readonly id?: Maybe<Scalars["Int"]>;
  /** The name of the actor. */
  readonly name?: Maybe<Scalars["String"]>;
  /** The report ID of the actor's owner if the actor is a pet. */
  readonly petOwner?: Maybe<Scalars["Int"]>;
  /** The normalized server name of the actor. */
  readonly server?: Maybe<Scalars["String"]>;
  /** The sub-type of the actor, for players it's their class, and for NPCs, they are further subdivided into normal NPCs and bosses. */
  readonly subType?: Maybe<Scalars["String"]>;
  /** The type of the actor, i.e., if it is a player, pet or NPC. */
  readonly type?: Maybe<Scalars["String"]>;
};

/** The ReportData object enables the retrieval of single reports or filtered collections of reports. */
export type ReportData = {
  readonly __typename?: "ReportData";
  /** Obtain a specific report by its code. */
  readonly report?: Maybe<Report>;
  /** A set of reports for a specific guild, guild tag, or user. */
  readonly reports?: Maybe<ReportPagination>;
};

/** The ReportData object enables the retrieval of single reports or filtered collections of reports. */
export type ReportDataReportArgs = {
  code?: Maybe<Scalars["String"]>;
};

/** The ReportData object enables the retrieval of single reports or filtered collections of reports. */
export type ReportDataReportsArgs = {
  endTime?: Maybe<Scalars["Float"]>;
  guildID?: Maybe<Scalars["Int"]>;
  guildName?: Maybe<Scalars["String"]>;
  guildServerSlug?: Maybe<Scalars["String"]>;
  guildServerRegion?: Maybe<Scalars["String"]>;
  guildTagID?: Maybe<Scalars["Int"]>;
  userID?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  startTime?: Maybe<Scalars["Float"]>;
  zoneID?: Maybe<Scalars["Int"]>;
};

/** The ReportDungeonPull represents a single pull that occurs in a containing dungeon. */
export type ReportDungeonPull = {
  readonly __typename?: "ReportDungeonPull";
  /** The bounding box that encloses the positions of all players/enemies in the fight. */
  readonly boundingBox?: Maybe<ReportMapBoundingBox>;
  /** The encounter ID of the fight. If the ID is 0, the fight is considered a trash fight. */
  readonly encounterID: Scalars["Int"];
  /** The end time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  readonly endTime: Scalars["Float"];
  /** Information about enemies involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  readonly enemyNPCs?: Maybe<readonly Maybe<ReportDungeonPullNpc>[]>;
  /** The report ID of the fight. This ID can be used to fetch only events, tables or graphs for this fight. */
  readonly id: Scalars["Int"];
  /** Whether or not the fight was a boss kill, i.e., successful. If this field is false, it means the fight was an incomplete run, etc.. */
  readonly kill?: Maybe<Scalars["Boolean"]>;
  /** All the maps that were involved in a pull. */
  readonly maps?: Maybe<readonly Maybe<ReportMap>[]>;
  /** The name of the fight. */
  readonly name: Scalars["String"];
  /** The start time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  readonly startTime: Scalars["Float"];
  /** The x position of the first mob damaged in the pull at the time this damage happens. Used to establish a marker position to represent where the pull took place. */
  readonly x: Scalars["Int"];
  /** The y position of the first mob damaged in the pull at the time this damage happens. Used to establish a marker position to represent where the pull took place. */
  readonly y: Scalars["Int"];
};

/** The ReportDungeonPullNPC represents participation info within a single dungeon pull for an NPC. */
export type ReportDungeonPullNpc = {
  readonly __typename?: "ReportDungeonPullNPC";
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  readonly id?: Maybe<Scalars["Int"]>;
  /** The game ID of the actor, e.g., so it can be looked up on external Web sites. */
  readonly gameID?: Maybe<Scalars["Int"]>;
  /** The lowest instance ID seen during the pull. */
  readonly minimumInstanceID?: Maybe<Scalars["Int"]>;
  /** The highest instance ID seen during the pull. */
  readonly maximumInstanceID?: Maybe<Scalars["Int"]>;
  /** The lowest instance group ID seen during the pull. */
  readonly minimumInstanceGroupID?: Maybe<Scalars["Int"]>;
  /** The highest instance group ID seen during the pull. */
  readonly maximumInstanceGroupID?: Maybe<Scalars["Int"]>;
};

/** The ReportEventPaginator represents a paginated list of report events. */
export type ReportEventPaginator = {
  readonly __typename?: "ReportEventPaginator";
  /** The list of events obtained. */
  readonly data?: Maybe<Scalars["JSON"]>;
  /** A timestamp to pass in as the start time when fetching the next page of data. */
  readonly nextPageTimestamp?: Maybe<Scalars["Float"]>;
};

/** The ReportFight represents a single fight that occurs in the report. */
export type ReportFight = {
  readonly __typename?: "ReportFight";
  /** The average item level of the players in the fight. */
  readonly averageItemLevel?: Maybe<Scalars["Float"]>;
  /** The percentage health of the active boss or bosses at the end of a fight. */
  readonly bossPercentage?: Maybe<Scalars["Float"]>;
  /** The bounding box that encloses the positions of all players/enemies in the fight. */
  readonly boundingBox?: Maybe<ReportMapBoundingBox>;
  /** Whether or not a fight represents an entire raid from start to finish, e.g., in Classic WoW a complete run of Blackwing Lair. */
  readonly completeRaid: Scalars["Boolean"];
  /** The difficulty setting for the raid, dungeon, or arena. Null for trash. */
  readonly difficulty?: Maybe<Scalars["Int"]>;
  /** For a dungeon, a list of pulls that occurred in the dungeon. Pulls have details such as the enemies involved in the pull and map info showing where the pull took place. */
  readonly dungeonPulls?: Maybe<readonly Maybe<ReportDungeonPull>[]>;
  /** The encounter ID of the fight. If the ID is 0, the fight is considered a trash fight. */
  readonly encounterID: Scalars["Int"];
  /** The end time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  readonly endTime: Scalars["Float"];
  /** Information about enemy NPCs involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  readonly enemyNPCs?: Maybe<readonly Maybe<ReportFightNpc>[]>;
  /** The IDs of all players involved in a fight. These players can be referenced in the master data actors table to get detailed information about each participant. */
  readonly enemyPlayers?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  /** The actual completion percentage of the fight. This is the field used to indicate how far into a fight a wipe was, since fights can be complicated and have multiple bosses, no bosses, bosses that heal, etc. */
  readonly fightPercentage?: Maybe<Scalars["Float"]>;
  /** Information about friendly NPCs involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  readonly friendlyNPCs?: Maybe<readonly Maybe<ReportFightNpc>[]>;
  /** The IDs of all players involved in a fight. These players can be referenced in the master data actors table to get detailed information about each participant. */
  readonly friendlyPlayers?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  /** The game zone the fight takes place in. This should not be confused with the zones used by the sites for rankings. This is the actual in-game zone info. */
  readonly gameZone?: Maybe<GameZone>;
  /** The report ID of the fight. This ID can be used to fetch only events, tables or graphs for this fight. */
  readonly id: Scalars["Int"];
  /** The affixes for a Mythic+ dungeon. */
  readonly keystoneAffixes?: Maybe<readonly Maybe<Scalars["Int"]>[]>;
  /** The bonus field represents Bronze, Silver or Gold in Challenge Modes, or +1-+3 pushing of Mythic+ keys. It has the values 1, 2, and 3. */
  readonly keystoneBonus?: Maybe<Scalars["Int"]>;
  /** The keystone level for a Mythic+ dungeon. */
  readonly keystoneLevel?: Maybe<Scalars["Int"]>;
  /** The completion time for a Challenge Mode or Mythic+ Dungeon. This is the official time used on Blizzard leaderboards. */
  readonly keystoneTime?: Maybe<Scalars["Int"]>;
  /** Whether or not the fight was a boss kill, i.e., successful. If this field is false, it means the fight was an incomplete run, etc.. */
  readonly kill?: Maybe<Scalars["Boolean"]>;
  /** The layer of a Torghast run. */
  readonly layer?: Maybe<Scalars["Int"]>;
  /** All the maps that were involved in a fight. For single bosses this will usually be a single map, but for dungeons it will typically be multiple maps. */
  readonly maps?: Maybe<readonly Maybe<ReportMap>[]>;
  /** The name of the fight. */
  readonly name: Scalars["String"];
  /** The group size for the raid, dungeon, or arena. Null for trash. */
  readonly size?: Maybe<Scalars["Int"]>;
  /** The start time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  readonly startTime: Scalars["Float"];
  /** If a wipe was explicitly called using the Companion app, then this field will contain the time. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  readonly wipeCalledTime?: Maybe<Scalars["Float"]>;
};

/** The ReportFightNPC represents participation info within a single fight for an NPC. */
export type ReportFightNpc = {
  readonly __typename?: "ReportFightNPC";
  /** The game ID of the actor. This ID is used in events to identify sources and targets. */
  readonly gameID?: Maybe<Scalars["Int"]>;
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  readonly id?: Maybe<Scalars["Int"]>;
  /** How many instances of the NPC were seen during the fight. */
  readonly instanceCount?: Maybe<Scalars["Int"]>;
  /** How many packs of the NPC were seen during the fight. */
  readonly groupCount?: Maybe<Scalars["Int"]>;
};

/** The ReportMap represents a single map that a fight can occur on. */
export type ReportMap = {
  readonly __typename?: "ReportMap";
  /** The map's game ID. */
  readonly id: Scalars["Int"];
};

/** The ReportMapBoundingBox is a box that encloses the positions of all players and enemies in a fight or dungeon pull. */
export type ReportMapBoundingBox = {
  readonly __typename?: "ReportMapBoundingBox";
  /** The smallest X position. */
  readonly minX: Scalars["Int"];
  /** The largest X position. */
  readonly maxX: Scalars["Int"];
  /** The smallest Y position. */
  readonly minY: Scalars["Int"];
  /** The largest Y position. */
  readonly maxY: Scalars["Int"];
};

/** The ReporMastertData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export type ReportMasterData = {
  readonly __typename?: "ReportMasterData";
  /** The version of the client parser that was used to parse and upload this log file. */
  readonly logVersion: Scalars["Int"];
  /** The version of the game that generated the log file. Used to distinguish Classic and Retail Warcraft primarily. */
  readonly gameVersion?: Maybe<Scalars["Int"]>;
  /** The auto-detected locale of the report. This is the source language of the original log file. */
  readonly lang?: Maybe<Scalars["String"]>;
  /** A list of every ability that occurs in the report. */
  readonly abilities?: Maybe<readonly Maybe<ReportAbility>[]>;
  /** A list of every actor (player, NPC, pet) that occurs in the report. */
  readonly actors?: Maybe<readonly Maybe<ReportActor>[]>;
};

/** The ReporMastertData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export type ReportMasterDataActorsArgs = {
  type?: Maybe<Scalars["String"]>;
  subType?: Maybe<Scalars["String"]>;
};

export type ReportPagination = {
  readonly __typename?: "ReportPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<Report>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** All the possible metrics. */
export enum ReportRankingMetricType {
  /** Boss damage per second. */
  Bossdps = "bossdps",
  /** Boss rDPS is unique to FFXIV and is damage done to the boss adjusted for raid-contributing buffs and debuffs. */
  Bossrdps = "bossrdps",
  /** Choose an appropriate default depending on the other selected parameters. */
  Default = "default",
  /** Damage per second. */
  Dps = "dps",
  /** Healing per second. */
  Hps = "hps",
  /** Survivability ranking for tanks. Deprecated. Only supported for some older WoW zones. */
  Krsi = "krsi",
  /** Score. Used by WoW Mythic dungeons and by ESO trials. */
  Playerscore = "playerscore",
  /** Speed. Not supported by every zone. */
  Playerspeed = "playerspeed",
  /** rDPS is unique to FFXIV and is damage done adjusted for raid-contributing buffs and debuffs. */
  Rdps = "rdps",
  /** Healing done per second to tanks. */
  Tankhps = "tankhps",
  /** Weighted damage per second. Unique to WoW currently. Used to remove pad damage and reward damage done to high priority targets. */
  Wdps = "wdps",
}

/** Used to specify a tank, healer or DPS role. */
export enum RoleType {
  /** Fetch any role.. */
  Any = "Any",
  /** Fetch the DPS role only. */
  Dps = "DPS",
  /** Fetch the healer role only. */
  Healer = "Healer",
  /** Fetch the tanking role only. */
  Tank = "Tank",
}

/** A single server. Servers correspond to actual game servers that characters and guilds reside on. */
export type Server = {
  readonly __typename?: "Server";
  /** The ID of the server. */
  readonly id: Scalars["Int"];
  /** The name of the server in the locale of the subregion that the server belongs to. */
  readonly name: Scalars["String"];
  /** The normalized name is a transformation of the name, dropping spaces. It is how the server appears in a World of Warcraft log file. */
  readonly normalizedName: Scalars["String"];
  /** The server slug, also a transformation of the name following Blizzard rules. For retail World of Warcraft realms, this slug will be in English. For all other games, the slug is just a transformation of the name field. */
  readonly slug: Scalars["String"];
  /** The region that this server belongs to. */
  readonly region: Region;
  /** The subregion that this server belongs to. */
  readonly subregion: Subregion;
  /** The guilds found on this server (and any servers connected to this one. */
  readonly guilds?: Maybe<GuildPagination>;
};

/** A single server. Servers correspond to actual game servers that characters and guilds reside on. */
export type ServerGuildsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type ServerPagination = {
  readonly __typename?: "ServerPagination";
  /** List of items on the current page */
  readonly data?: Maybe<readonly Maybe<Server>[]>;
  /** Number of total items selected by the query */
  readonly total: Scalars["Int"];
  /** Number of items returned per page */
  readonly per_page: Scalars["Int"];
  /** Current page of the cursor */
  readonly current_page: Scalars["Int"];
  /** Number of the first item returned */
  readonly from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  readonly to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  readonly last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  readonly has_more_pages: Scalars["Boolean"];
};

/** A spec for a given player class. */
export type Spec = {
  readonly __typename?: "Spec";
  /** An integer used to identify the spec. */
  readonly id: Scalars["Int"];
  /** The player class that the spec belongs to. */
  readonly class: GameClass;
  /** The localized name of the class. */
  readonly name: Scalars["String"];
  /** A slug used to identify the spec. */
  readonly slug: Scalars["String"];
};

/** A single subregion. Subregions are used to divide a region into sub-categories, such as French or German subregions of a Europe region. */
export type Subregion = {
  readonly __typename?: "Subregion";
  /** The ID of the subregion. */
  readonly id: Scalars["Int"];
  /** The localized name of the subregion. */
  readonly name: Scalars["String"];
  /** The region that this subregion is found in. */
  readonly region: Region;
  /** The servers found within this region. */
  readonly servers?: Maybe<ServerPagination>;
};

/** A single subregion. Subregions are used to divide a region into sub-categories, such as French or German subregions of a Europe region. */
export type SubregionServersArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** The type of table to examine. */
export enum TableDataType {
  /** Summary Overview */
  Summary = "Summary",
  /** Buffs. */
  Buffs = "Buffs",
  /** Casts. */
  Casts = "Casts",
  /** Damage done. */
  DamageDone = "DamageDone",
  /** Damage taken. */
  DamageTaken = "DamageTaken",
  /** Deaths. */
  Deaths = "Deaths",
  /** Debuffs. */
  Debuffs = "Debuffs",
  /** Dispels. */
  Dispels = "Dispels",
  /** Healing done. */
  Healing = "Healing",
  /** Interrupts. */
  Interrupts = "Interrupts",
  /** Resources. */
  Resources = "Resources",
  /** Summons */
  Summons = "Summons",
  /** Survivability (death info across multiple pulls). */
  Survivability = "Survivability",
  /** Threat. */
  Threat = "Threat",
}

/** A single user of the site. */
export type User = {
  readonly __typename?: "User";
  /** The ID of the user. */
  readonly id: Scalars["Int"];
  /** The name of the user. */
  readonly name: Scalars["String"];
};

/** Whether the view is by source, target, or ability. */
export enum ViewType {
  /** Use the same default that the web site picks based off the other selected parameters. */
  Default = "Default",
  /** View by ability. */
  Ability = "Ability",
  /** View. by source. */
  Source = "Source",
  /** View by target. */
  Target = "Target",
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldData = {
  readonly __typename?: "WorldData";
  /** Obtain a specific encounter by id. */
  readonly encounter?: Maybe<Encounter>;
  /** A single expansion obtained by ID. */
  readonly expansion?: Maybe<Expansion>;
  /** The set of all expansions supported by the site. */
  readonly expansions?: Maybe<readonly Maybe<Expansion>[]>;
  /** Obtain a specific region by its ID. */
  readonly region?: Maybe<Region>;
  /** The set of all regions supported by the site. */
  readonly regions?: Maybe<readonly Maybe<Region>[]>;
  /** Obtain a specific server either by id or by slug and region. */
  readonly server?: Maybe<Server>;
  /** Obtain a specific subregion by its ID. */
  readonly subregion?: Maybe<Subregion>;
  /** Obtain a specific zone by its ID. */
  readonly zone?: Maybe<Zone>;
  /** Obtain a set of all zones supported by the site. */
  readonly zones?: Maybe<readonly Maybe<Zone>[]>;
};

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldDataEncounterArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldDataExpansionArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldDataRegionArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldDataServerArgs = {
  id?: Maybe<Scalars["Int"]>;
  region?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
};

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldDataSubregionArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldDataZoneArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export type WorldDataZonesArgs = {
  expansion_id?: Maybe<Scalars["Int"]>;
};

/** A single zone from an expansion that represents a raid, dungeon, arena, etc. */
export type Zone = {
  readonly __typename?: "Zone";
  /** The ID of the zone. */
  readonly id: Scalars["Int"];
  /** The bracket information for this zone. */
  readonly brackets: Bracket;
  /** A list of all the difficulties supported for this zone. */
  readonly difficulties?: Maybe<readonly Maybe<Difficulty>[]>;
  /** The encounters found within this zone. */
  readonly encounters?: Maybe<readonly Maybe<Encounter>[]>;
  /** The expansion that this zone belongs to. */
  readonly expansion: Expansion;
  /** Whether or not the entire zone (including all its partitions) is permanently frozen. When a zone is frozen, data involving that zone will never change and can be cached forever. */
  readonly frozen: Scalars["Boolean"];
  /** The name of the zone. */
  readonly name: Scalars["String"];
  /** A list of all the partitions supported for this zone. */
  readonly partitions?: Maybe<readonly Maybe<Partition>[]>;
};

export type EventDataQueryVariables = Exact<{
  reportID: Scalars["String"];
  startTime: Scalars["Float"];
  endTime: Scalars["Float"];
  hostilityType: HostilityType;
  sourceID?: Maybe<Scalars["Int"]>;
  dataType?: Maybe<EventDataType>;
  abilityID?: Maybe<Scalars["Float"]>;
  targetID?: Maybe<Scalars["Int"]>;
  targetInstance?: Maybe<Scalars["Int"]>;
}>;

export type EventDataQuery = { readonly __typename?: "Query" } & {
  readonly reportData?: Maybe<
    { readonly __typename?: "ReportData" } & {
      readonly report?: Maybe<
        { readonly __typename?: "Report" } & {
          readonly events?: Maybe<
            { readonly __typename?: "ReportEventPaginator" } & Pick<
              ReportEventPaginator,
              "data" | "nextPageTimestamp"
            >
          >;
        }
      >;
    }
  >;
};

export type PetActorsQueryVariables = Exact<{
  reportID: Scalars["String"];
}>;

export type PetActorsQuery = { readonly __typename?: "Query" } & {
  readonly reportData?: Maybe<
    { readonly __typename?: "ReportData" } & {
      readonly report?: Maybe<
        { readonly __typename?: "Report" } & {
          readonly masterData?: Maybe<
            { readonly __typename?: "ReportMasterData" } & {
              readonly actors?: Maybe<
                readonly Maybe<
                  { readonly __typename?: "ReportActor" } & Pick<
                    ReportActor,
                    "gameID" | "petOwner" | "id"
                  >
                >[]
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type EnemyNpcIdsQueryVariables = Exact<{
  reportID: Scalars["String"];
  fightIDs: readonly Maybe<Scalars["Int"]>[] | Maybe<Scalars["Int"]>;
}>;

export type EnemyNpcIdsQuery = { readonly __typename?: "Query" } & {
  readonly reportData?: Maybe<
    { readonly __typename?: "ReportData" } & {
      readonly report?: Maybe<
        { readonly __typename?: "Report" } & {
          readonly fights?: Maybe<
            readonly Maybe<
              { readonly __typename?: "ReportFight" } & {
                readonly enemyNPCs?: Maybe<
                  readonly Maybe<
                    { readonly __typename?: "ReportFightNPC" } & Pick<
                      ReportFightNpc,
                      "id" | "gameID"
                    >
                  >[]
                >;
              }
            >[]
          >;
        }
      >;
    }
  >;
};

export type TableQueryVariables = Exact<{
  reportID: Scalars["String"];
  fightIDs: readonly Maybe<Scalars["Int"]>[] | Maybe<Scalars["Int"]>;
  startTime: Scalars["Float"];
  endTime: Scalars["Float"];
}>;

export type TableQuery = { readonly __typename?: "Query" } & {
  readonly reportData?: Maybe<
    { readonly __typename?: "ReportData" } & {
      readonly report?: Maybe<
        { readonly __typename?: "Report" } & Pick<Report, "table">
      >;
    }
  >;
};

export type InitialReportDataQueryVariables = Exact<{
  reportID: Scalars["String"];
}>;

export type InitialReportDataQuery = { readonly __typename?: "Query" } & {
  readonly reportData?: Maybe<
    { readonly __typename?: "ReportData" } & {
      readonly report?: Maybe<
        { readonly __typename?: "Report" } & Pick<
          Report,
          "title" | "startTime" | "endTime"
        > & {
            readonly region?: Maybe<
              { readonly __typename?: "Region" } & Pick<Region, "slug">
            >;
            readonly fights?: Maybe<
              readonly Maybe<
                { readonly __typename?: "ReportFight" } & Pick<
                  ReportFight,
                  "id" | "keystoneBonus" | "keystoneLevel"
                >
              >[]
            >;
          }
      >;
    }
  >;
};

export type ExtendedReportDataQueryVariables = Exact<{
  reportID: Scalars["String"];
  fightIDs: readonly Maybe<Scalars["Int"]>[] | Maybe<Scalars["Int"]>;
}>;

export type ExtendedReportDataQuery = { readonly __typename?: "Query" } & {
  readonly reportData?: Maybe<
    { readonly __typename?: "ReportData" } & {
      readonly report?: Maybe<
        { readonly __typename?: "Report" } & {
          readonly fights?: Maybe<
            readonly Maybe<
              { readonly __typename?: "ReportFight" } & Pick<
                ReportFight,
                | "id"
                | "averageItemLevel"
                | "keystoneAffixes"
                | "keystoneLevel"
                | "keystoneBonus"
                | "keystoneTime"
                | "startTime"
                | "endTime"
              > & {
                  readonly gameZone?: Maybe<
                    { readonly __typename?: "GameZone" } & Pick<GameZone, "id">
                  >;
                  readonly dungeonPulls?: Maybe<
                    readonly Maybe<
                      { readonly __typename?: "ReportDungeonPull" } & Pick<
                        ReportDungeonPull,
                        "x" | "y" | "startTime" | "endTime"
                      > & {
                          readonly maps?: Maybe<
                            readonly Maybe<
                              {
                                readonly __typename?: "ReportMap";
                              } & Pick<ReportMap, "id">
                            >[]
                          >;
                          readonly boundingBox?: Maybe<
                            {
                              readonly __typename?: "ReportMapBoundingBox";
                            } & Pick<
                              ReportMapBoundingBox,
                              "minX" | "maxX" | "minY" | "maxY"
                            >
                          >;
                          readonly enemyNPCs?: Maybe<
                            readonly Maybe<
                              {
                                readonly __typename?: "ReportDungeonPullNPC";
                              } & Pick<
                                ReportDungeonPullNpc,
                                | "gameID"
                                | "minimumInstanceID"
                                | "maximumInstanceID"
                              >
                            >[]
                          >;
                        }
                    >[]
                  >;
                }
            >[]
          >;
        }
      >;
    }
  >;
};

export const EventDataDocument = gql`
  query EventData(
    $reportID: String!
    $startTime: Float!
    $endTime: Float!
    $hostilityType: HostilityType!
    $sourceID: Int
    $dataType: EventDataType
    $abilityID: Float
    $targetID: Int
    $targetInstance: Int
  ) {
    reportData {
      report(code: $reportID) {
        events(
          startTime: $startTime
          endTime: $endTime
          hostilityType: $hostilityType
          sourceID: $sourceID
          dataType: $dataType
          abilityID: $abilityID
          targetID: $targetID
          targetInstanceID: $targetInstance
        ) {
          data
          nextPageTimestamp
        }
      }
    }
  }
`;
export const PetActorsDocument = gql`
  query PetActors($reportID: String!) {
    reportData {
      report(code: $reportID) {
        masterData {
          actors(type: "Pet") {
            gameID
            petOwner
            id
          }
        }
      }
    }
  }
`;
export const EnemyNpcIdsDocument = gql`
  query EnemyNPCIds($reportID: String!, $fightIDs: [Int]!) {
    reportData {
      report(code: $reportID) {
        fights(killType: Kills, fightIDs: $fightIDs) {
          enemyNPCs {
            id
            gameID
          }
        }
      }
    }
  }
`;
export const TableDocument = gql`
  query Table(
    $reportID: String!
    $fightIDs: [Int]!
    $startTime: Float!
    $endTime: Float!
  ) {
    reportData {
      report(code: $reportID) {
        table(startTime: $startTime, endTime: $endTime, fightIDs: $fightIDs)
      }
    }
  }
`;
export const InitialReportDataDocument = gql`
  query InitialReportData($reportID: String!) {
    reportData {
      report(code: $reportID) {
        title
        startTime
        endTime
        region {
          slug
        }
        fights(translate: true, killType: Kills) {
          id
          keystoneBonus
          keystoneLevel
        }
      }
    }
  }
`;
export const ExtendedReportDataDocument = gql`
  query ExtendedReportData($reportID: String!, $fightIDs: [Int]!) {
    reportData {
      report(code: $reportID) {
        fights(translate: true, killType: Kills, fightIDs: $fightIDs) {
          id
          gameZone {
            id
          }
          averageItemLevel
          keystoneAffixes
          keystoneLevel
          keystoneBonus
          keystoneTime
          startTime
          endTime
          dungeonPulls {
            x
            y
            startTime
            endTime
            maps {
              id
            }
            boundingBox {
              minX
              maxX
              minY
              maxY
            }
            enemyNPCs {
              gameID
              minimumInstanceID
              maximumInstanceID
            }
          }
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    EventData(
      variables: EventDataQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<EventDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<EventDataQuery>(EventDataDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "EventData"
      );
    },
    PetActors(
      variables: PetActorsQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<PetActorsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<PetActorsQuery>(PetActorsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "PetActors"
      );
    },
    EnemyNPCIds(
      variables: EnemyNpcIdsQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<EnemyNpcIdsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<EnemyNpcIdsQuery>(EnemyNpcIdsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "EnemyNPCIds"
      );
    },
    Table(
      variables: TableQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<TableQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TableQuery>(TableDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "Table"
      );
    },
    InitialReportData(
      variables: InitialReportDataQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<InitialReportDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<InitialReportDataQuery>(
            InitialReportDataDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "InitialReportData"
      );
    },
    ExtendedReportData(
      variables: ExtendedReportDataQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<ExtendedReportDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ExtendedReportDataQuery>(
            ExtendedReportDataDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "ExtendedReportData"
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;

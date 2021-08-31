import type { GraphQLClient } from "graphql-request";
import type * as Dom from "graphql-request/dist/types.dom";
import gql from "graphql-tag";

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
  __typename?: "Bracket";
  /** An integer representing the minimum value used by bracket number 1, etc. */
  min: Scalars["Float"];
  /** An integer representing the value used by bracket N when there are a total of N brackets, etc. */
  max: Scalars["Float"];
  /** A float representing the value to increment when moving from bracket 1 to bracket N, etc. */
  bucket: Scalars["Float"];
  /** The localized name of the bracket type. */
  type?: Maybe<Scalars["String"]>;
};

/** A player character. Characters can earn individual rankings and appear in reports. */
export type Character = {
  __typename?: "Character";
  /** The canonical ID of the character. If a character renames or transfers, then the canonical id can be used to identify the most recent version of the character. */
  canonicalID: Scalars["Int"];
  /** The class id of the character. */
  classID: Scalars["Int"];
  /** Encounter rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  encounterRankings?: Maybe<Scalars["JSON"]>;
  /** The faction of the character. */
  faction: GameFaction;
  /** Cached game data such as gear for the character. This data was fetched from the appropriate source (Blizzard APIs for WoW, XIVAPI for FF). This call will only return a cached copy of the data if it exists already. It will not go out to Blizzard or XIVAPI to fetch a new copy. */
  gameData?: Maybe<Scalars["JSON"]>;
  /** The guild rank of the character in their primary guild. This is not the user rank on the site, but the rank according to the game data, e.g., a Warcraft guild rank or an FFXIV Free Company rank. */
  guildRank: Scalars["Int"];
  /** All guilds that the character belongs to. */
  guilds?: Maybe<Maybe<Guild>[]>;
  /** Whether or not the character has all its rankings hidden. */
  hidden: Scalars["Boolean"];
  /** The ID of the character. */
  id: Scalars["Int"];
  /** The level of the character. */
  level: Scalars["Int"];
  /** The name of the character. */
  name: Scalars["String"];
  /** Recent reports for the character. */
  recentReports?: Maybe<ReportPagination>;
  /** The server that the character belongs to. */
  server: Server;
  /** Rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  zoneRankings?: Maybe<Scalars["JSON"]>;
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
  __typename?: "CharacterData";
  /** Obtain a specific character either by id or by name/server_slug/server_region. */
  character?: Maybe<Character>;
  /** A collection of characters for a specific guild. */
  characters?: Maybe<CharacterPagination>;
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
  __typename?: "CharacterPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<Character>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
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
  __typename?: "Difficulty";
  /** An integer representing a specific difficulty level within a zone. For example, in World of Warcraft, this could be Mythic. In FF, it could be Savage, etc. */
  id: Scalars["Int"];
  /** The localized name for the difficulty level. */
  name: Scalars["String"];
  /** A list of supported sizes for the difficulty level. An empty result means that the difficulty level has a flexible raid size. */
  sizes?: Maybe<Maybe<Scalars["Int"]>[]>;
};

/** A single encounter for the game. */
export type Encounter = {
  __typename?: "Encounter";
  /** The ID of the encounter. */
  id: Scalars["Int"];
  /** The localized name of the encounter. */
  name: Scalars["String"];
  /** Player rankings information for a zone. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  characterRankings?: Maybe<Scalars["JSON"]>;
  /** Fight rankings information for a zone. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  fightRankings?: Maybe<Scalars["JSON"]>;
  /** The zone that this encounter is found in. */
  zone: Zone;
  /** The Blizzard journal ID, used as the identifier in the encounter journal and various Blizzard APIs like progression. */
  journalID: Scalars["Int"];
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
  covenantID?: Maybe<Scalars["Int"]>;
  soulbindID?: Maybe<Scalars["Int"]>;
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
  __typename?: "Expansion";
  /** The ID of the expansion. */
  id: Scalars["Int"];
  /** The localized name of the expansion. */
  name: Scalars["String"];
  /** The zones (e.g., raids and dungeons) supported for this expansion. */
  zones?: Maybe<Maybe<Zone>[]>;
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
  __typename?: "GameAbility";
  /** The ID of the ability. */
  id: Scalars["Int"];
  /** The icon for the ability. */
  icon?: Maybe<Scalars["String"]>;
  /** The localized name of the ability. Will be null if no localization information exists for the ability. */
  name?: Maybe<Scalars["String"]>;
};

export type GameAbilityPagination = {
  __typename?: "GameAbilityPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GameAbility>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** A single achievement for the game. */
export type GameAchievement = {
  __typename?: "GameAchievement";
  /** The ID of the achievement. */
  id: Scalars["Int"];
  /** The icon for the achievement. */
  icon?: Maybe<Scalars["String"]>;
  /** The localized name of the achievement. Will be null if no localization information exists for the achievement. */
  name?: Maybe<Scalars["String"]>;
};

export type GameAchievementPagination = {
  __typename?: "GameAchievementPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GameAchievement>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** A single affix for Mythic Keystone dungeons. */
export type GameAffix = {
  __typename?: "GameAffix";
  /** The ID of the affix. */
  id: Scalars["Int"];
  /** The icon for the affix. */
  icon?: Maybe<Scalars["String"]>;
  /** The localized name of the affix. Will be null if no localization information exists for the affix. */
  name?: Maybe<Scalars["String"]>;
};

/** A single player class for the game. */
export type GameClass = {
  __typename?: "GameClass";
  /** An integer used to identify the class. */
  id: Scalars["Int"];
  /** The localized name of the class. */
  name: Scalars["String"];
  /** A slug used to identify the class. */
  slug: Scalars["String"];
  /** The specs supported by the class. */
  specs?: Maybe<Maybe<Spec>[]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameData = {
  __typename?: "GameData";
  /** The player and enemy abilities for the game. */
  abilities?: Maybe<GameAbilityPagination>;
  /** Obtain a single ability for the game. */
  ability?: Maybe<GameAbility>;
  /** Obtain a single achievement for the game. */
  achievement?: Maybe<GameAchievement>;
  /** Achievements for the game. */
  achievements?: Maybe<GameAchievementPagination>;
  /** Obtain a single affix for the game. */
  affix?: Maybe<GameAffix>;
  /** The affixes for the game. */
  affixes?: Maybe<Maybe<GameAffix>[]>;
  /** Obtain a single class for the game. */
  class?: Maybe<GameClass>;
  /** Obtain the supported classes for the game. */
  classes?: Maybe<Maybe<GameClass>[]>;
  /** Obtain a single enchant for the game. */
  enchant?: Maybe<GameEnchant>;
  /** Enchants for the game. */
  enchants?: Maybe<GameEnchantPagination>;
  /** Obtain all the factions that guilds and players can belong to. */
  factions?: Maybe<Maybe<GameFaction>[]>;
  /** Obtain a single item for the game. */
  item?: Maybe<GameItem>;
  /** Items for the game. */
  items?: Maybe<GameItemPagination>;
  /** Obtain a single map for the game. */
  map?: Maybe<GameMap>;
  /** Maps for the game. */
  maps?: Maybe<GameMapPagination>;
  /** Obtain a single NPC for the game. */
  npc?: Maybe<GameNpc>;
  /** NPCs for the game. */
  npcs?: Maybe<GameNpcPagination>;
  /** Obtain a single zone for the game, not to be confused with the worldData zones for ranking bosses and dungeons. */
  zone?: Maybe<GameZone>;
  /** Zones for the game. */
  zones?: Maybe<GameZonePagination>;
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
export type GameDataItemArgs = {
  id?: Maybe<Scalars["Int"]>;
};

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export type GameDataItemsArgs = {
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
  __typename?: "GameEnchant";
  /** The ID of the enchant. */
  id: Scalars["Int"];
  /** The localized name of the enchant. Will be null if no localization information exists for the enchant. */
  name?: Maybe<Scalars["String"]>;
};

export type GameEnchantPagination = {
  __typename?: "GameEnchantPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GameEnchant>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** A faction that a player or guild can belong to. Factions have an integer id used to identify them throughout the API and a localized name describing the faction. */
export type GameFaction = {
  __typename?: "GameFaction";
  /** An integer representing the faction id. */
  id: Scalars["Int"];
  /** The localized name of the faction. */
  name: Scalars["String"];
};

/** A single item for the game. */
export type GameItem = {
  __typename?: "GameItem";
  /** The ID of the item. */
  id: Scalars["Int"];
  /** The icon for the item. */
  icon?: Maybe<Scalars["String"]>;
  /** The localized name of the item. Will be null if no localization information exists for the item. */
  name?: Maybe<Scalars["String"]>;
};

export type GameItemPagination = {
  __typename?: "GameItemPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GameItem>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** A single item set for the game. */
export type GameItemSet = {
  __typename?: "GameItemSet";
  /** The ID of the item set. */
  id: Scalars["Int"];
  /** The localized name of the item set. Will be null if no localization information exists for the item set. */
  name?: Maybe<Scalars["String"]>;
};

/** A single map for the game. */
export type GameMap = {
  __typename?: "GameMap";
  /** The ID of the map. */
  id: Scalars["Int"];
  /** The localized name of the map. Will be null if no localization information exists for the map. */
  name?: Maybe<Scalars["String"]>;
};

export type GameMapPagination = {
  __typename?: "GameMapPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GameMap>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** A single NPC for the game. */
export type GameNpc = {
  __typename?: "GameNPC";
  /** The ID of the NPC. */
  id: Scalars["Int"];
  /** The localized name of the NPC. Will be null if no localization information exists for the NPC. */
  name?: Maybe<Scalars["String"]>;
};

export type GameNpcPagination = {
  __typename?: "GameNPCPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GameNpc>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** A single zone for the game. */
export type GameZone = {
  __typename?: "GameZone";
  /** The ID of the zone. */
  id: Scalars["Int"];
  /** The localized name of the zone. Will be null if no localization information exists for the zone. */
  name?: Maybe<Scalars["String"]>;
};

export type GameZonePagination = {
  __typename?: "GameZonePagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GameZone>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
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
  __typename?: "Guild";
  attendance: GuildAttendancePagination;
  /** Whether or not the guild has competition mode enabled. */
  competitionMode: Scalars["Boolean"];
  /** The description for the guild that is displayed with the guild name on the site. */
  description: Scalars["String"];
  /** The faction of the guild. */
  faction: GameFaction;
  /** The ID of the guild. */
  id: Scalars["Int"];
  /** The name of the guild. */
  name: Scalars["String"];
  /** The server that the guild belongs to. */
  server: Server;
  /** Whether or not the guild has stealth mode enabled. */
  stealthMode: Scalars["Boolean"];
  /** The tags used to label reports. In the site UI, these are called raid teams. */
  tags?: Maybe<Maybe<GuildTag>[]>;
  /** The member roster for a specific guild. The result of this query is a paginated list of characters. This query only works for games where the guild roster is verifiable, e.g., it does not work for Classic Warcraft. */
  members: CharacterPagination;
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
  __typename?: "GuildAttendance";
  /** The code of the report for the raid night. */
  code: Scalars["String"];
  /** The players that attended that raid night. */
  players?: Maybe<Maybe<PlayerAttendance>[]>;
  /** The start time of the raid night. */
  startTime?: Maybe<Scalars["Float"]>;
  /** The principal zone of the raid night. */
  zone?: Maybe<Zone>;
};

export type GuildAttendancePagination = {
  __typename?: "GuildAttendancePagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<GuildAttendance>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** The GuildData object enables the retrieval of single guilds or filtered collections of guilds. */
export type GuildData = {
  __typename?: "GuildData";
  /** Obtain a specific guild either by id or by name/serverSlug/serverRegion. */
  guild?: Maybe<Guild>;
  /** The set of all guilds supported by the site. Can be optionally filtered to a specific server id. */
  guilds?: Maybe<GuildPagination>;
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
  __typename?: "GuildPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<Guild>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** The tag for a specific guild. Tags can be used to categorize reports within a guild. In the site UI, they are referred to as report tags. */
export type GuildTag = {
  __typename?: "GuildTag";
  /** The ID of the tag. */
  id: Scalars["Int"];
  /** The guild that the tag belongs to. */
  guild: Guild;
  /** The name of the guild. */
  name: Scalars["String"];
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
  __typename?: "Partition";
  /** An integer representing a specific partition within a zone. */
  id: Scalars["Int"];
  /** The localized name for partition. */
  name: Scalars["String"];
  /** The compact localized name for the partition. Typically an abbreviation to conserve space. */
  compactName: Scalars["String"];
  /** Whether or not the partition is the current default when viewing rankings or statistics for the zone. */
  default: Scalars["Boolean"];
};

/** Attendance for a specific player on a specific raid night. */
export type PlayerAttendance = {
  __typename?: "PlayerAttendance";
  /** The name of the player. */
  name?: Maybe<Scalars["String"]>;
  /** The class of the player. */
  type?: Maybe<Scalars["String"]>;
  /** Presence info for the player. A value of 1 means the player was present. A value of 2 indicates present but on the bench. */
  presence?: Maybe<Scalars["Int"]>;
};

/** A way to obtain data for the top guilds involved in an ongoing world first or realm first progress race. */
export type ProgressRaceData = {
  __typename?: "ProgressRaceData";
  /** Progress race information including best percentages, pull counts and streams for top guilds. This API is only active when there is an ongoing race. The format of this JSON may change without notice and is not considered frozen. */
  progressRace?: Maybe<Scalars["JSON"]>;
};

/** A way to obtain data for the top guilds involved in an ongoing world first or realm first progress race. */
export type ProgressRaceDataProgressRaceArgs = {
  serverRegion?: Maybe<Scalars["String"]>;
  serverSubregion?: Maybe<Scalars["String"]>;
  serverSlug?: Maybe<Scalars["String"]>;
  zoneID?: Maybe<Scalars["Int"]>;
  difficulty?: Maybe<Scalars["Int"]>;
};

export type Query = {
  __typename?: "Query";
  /** Obtain the character data object that allows the retrieval of individual characters or filtered collections of characters. */
  characterData?: Maybe<CharacterData>;
  /** Obtain the game data object that holds collections of static data such as abilities, achievements, classes, items, NPCs, etc.. */
  gameData?: Maybe<GameData>;
  /** Obtain the guild data object that allows the retrieval of individual guilds or filtered collections of guilds. */
  guildData?: Maybe<GuildData>;
  /** Obtain information about an ongoing world first or realm first race. Inactive when no race is occurring. This data only updates once every 30 seconds, so you do not need to fetch this information more often than that. */
  progressRaceData?: Maybe<ProgressRaceData>;
  /** Obtain the rate limit data object to see how many points have been spent by this key. */
  rateLimitData?: Maybe<RateLimitData>;
  /** Obtain the report data object that allows the retrieval of individual reports or filtered collections of reports by guild or by user. */
  reportData?: Maybe<ReportData>;
  /** Obtain the user object that allows the retrieval of the authorized user's id and username. */
  userData?: Maybe<UserData>;
  /** Obtain the world data object that holds collections of data such as all expansions, regions, subregions, servers, dungeon/raid zones, and encounters. */
  worldData?: Maybe<WorldData>;
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
  __typename?: "RateLimitData";
  /** The total amount of points this API key can spend per hour. */
  limitPerHour: Scalars["Int"];
  /** The total amount of points spent during this hour. */
  pointsSpentThisHour: Scalars["Float"];
  /** The number of seconds remaining until the points reset. */
  pointsResetIn: Scalars["Int"];
};

/** A single region for the game. */
export type Region = {
  __typename?: "Region";
  /** The ID of the region. */
  id: Scalars["Int"];
  /** The localized compact name of the region, e.g., US for United States. */
  compactName: Scalars["String"];
  /** The localized name of the region. */
  name: Scalars["String"];
  /** The slug for the region, usable when looking up characters and guilds by server. */
  slug: Scalars["String"];
  /** The subregions found within this region. */
  subregions?: Maybe<Maybe<Subregion>[]>;
  /** The servers found within this region. */
  servers?: Maybe<ServerPagination>;
};

/** A single region for the game. */
export type RegionServersArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type Report = {
  __typename?: "Report";
  /** The report code, a unique value used to identify the report. */
  code: Scalars["String"];
  /** The end time of the report. This is a UNIX timestamp representing the timestamp of the last event contained in the report. */
  endTime: Scalars["Float"];
  /** A set of paginated report events, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  events?: Maybe<ReportEventPaginator>;
  /** The number of exported segments in the report. This is how many segments have been processed for rankings. */
  exportedSegments: Scalars["Int"];
  /** A set of fights with details about participating players. */
  fights?: Maybe<Maybe<ReportFight>[]>;
  /** A graph of information for a report, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  graph?: Maybe<Scalars["JSON"]>;
  /** The guild that the report belongs to. If this is null, then the report was uploaded to the user's personal logs. */
  guild?: Maybe<Guild>;
  /** The guild tag that the report belongs to. If this is null, then the report was not tagged. */
  guildTag?: Maybe<GuildTag>;
  /** The user that uploaded the report. */
  owner?: Maybe<User>;
  /** Data from the report's master file. This includes version info, all of the players, NPCs and pets that occur in the report, and all the game abilities used in the report. */
  masterData?: Maybe<ReportMasterData>;
  /** A list of all characters that ranked on kills in the report. */
  rankedCharacters?: Maybe<Maybe<Character>[]>;
  /** Rankings information for a report, filterable to specific fights, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  rankings?: Maybe<Scalars["JSON"]>;
  /** The region of the report. */
  region?: Maybe<Region>;
  /** The revision of the report. This number is increased when reports get re-exported. */
  revision: Scalars["Int"];
  /** The number of uploaded segments in the report. */
  segments: Scalars["Int"];
  /** The start time of the report. This is a UNIX timestamp representing the timestamp of the first event contained in the report. */
  startTime: Scalars["Float"];
  /** A table of information for a report, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  table?: Maybe<Scalars["JSON"]>;
  /** A title for the report. */
  title: Scalars["String"];
  /** The visibility level of the report. The possible values are 'public', 'private', and 'unlisted'. */
  visibility: Scalars["String"];
  /** The principal zone that the report contains fights for. Null if no supported zone exists. */
  zone?: Maybe<Zone>;
};

/** A single report uploaded by a player to a guild or personal logs. */
export type ReportEventsArgs = {
  abilityID?: Maybe<Scalars["Float"]>;
  dataType?: Maybe<EventDataType>;
  death?: Maybe<Scalars["Int"]>;
  difficulty?: Maybe<Scalars["Int"]>;
  encounterID?: Maybe<Scalars["Int"]>;
  endTime?: Maybe<Scalars["Float"]>;
  fightIDs?: Maybe<Maybe<Scalars["Int"]>[]>;
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
  fightIDs?: Maybe<Maybe<Scalars["Int"]>[]>;
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
  fightIDs?: Maybe<Maybe<Scalars["Int"]>[]>;
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
  fightIDs?: Maybe<Maybe<Scalars["Int"]>[]>;
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
  fightIDs?: Maybe<Maybe<Scalars["Int"]>[]>;
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
  __typename?: "ReportAbility";
  /** The game ID of the ability. */
  gameID?: Maybe<Scalars["Float"]>;
  /** An icon to use for the ability. */
  icon?: Maybe<Scalars["String"]>;
  /** The name of the actor. */
  name?: Maybe<Scalars["String"]>;
  /** The type of the ability. This represents the type of damage (e.g., the spell school in WoW). */
  type?: Maybe<Scalars["String"]>;
};

/** The ReportActor represents a single player, pet or NPC that occurs in the report. */
export type ReportActor = {
  __typename?: "ReportActor";
  /** The game ID of the actor. */
  gameID?: Maybe<Scalars["Float"]>;
  /** An icon to use for the actor. For pets and NPCs, this will be the icon the site chose to represent that actor. */
  icon?: Maybe<Scalars["String"]>;
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id?: Maybe<Scalars["Int"]>;
  /** The name of the actor. */
  name?: Maybe<Scalars["String"]>;
  /** The report ID of the actor's owner if the actor is a pet. */
  petOwner?: Maybe<Scalars["Int"]>;
  /** The normalized server name of the actor. */
  server?: Maybe<Scalars["String"]>;
  /** The sub-type of the actor, for players it's their class, and for NPCs, they are further subdivided into normal NPCs and bosses. */
  subType?: Maybe<Scalars["String"]>;
  /** The type of the actor, i.e., if it is a player, pet or NPC. */
  type?: Maybe<Scalars["String"]>;
};

/** The ReportData object enables the retrieval of single reports or filtered collections of reports. */
export type ReportData = {
  __typename?: "ReportData";
  /** Obtain a specific report by its code. */
  report?: Maybe<Report>;
  /** A set of reports for a specific guild, guild tag, or user. */
  reports?: Maybe<ReportPagination>;
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
  __typename?: "ReportDungeonPull";
  /** The bounding box that encloses the positions of all players/enemies in the fight. */
  boundingBox?: Maybe<ReportMapBoundingBox>;
  /** The encounter ID of the fight. If the ID is 0, the fight is considered a trash fight. */
  encounterID: Scalars["Int"];
  /** The end time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  endTime: Scalars["Float"];
  /** Information about enemies involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  enemyNPCs?: Maybe<Maybe<ReportDungeonPullNpc>[]>;
  /** The report ID of the fight. This ID can be used to fetch only events, tables or graphs for this fight. */
  id: Scalars["Int"];
  /** Whether or not the fight was a boss kill, i.e., successful. If this field is false, it means the fight was an incomplete run, etc.. */
  kill?: Maybe<Scalars["Boolean"]>;
  /** All the maps that were involved in a pull. */
  maps?: Maybe<Maybe<ReportMap>[]>;
  /** The name of the fight. */
  name: Scalars["String"];
  /** The start time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  startTime: Scalars["Float"];
  /** The x position of the first mob damaged in the pull at the time this damage happens. Used to establish a marker position to represent where the pull took place. */
  x: Scalars["Int"];
  /** The y position of the first mob damaged in the pull at the time this damage happens. Used to establish a marker position to represent where the pull took place. */
  y: Scalars["Int"];
};

/** The ReportDungeonPullNPC represents participation info within a single dungeon pull for an NPC. */
export type ReportDungeonPullNpc = {
  __typename?: "ReportDungeonPullNPC";
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id?: Maybe<Scalars["Int"]>;
  /** The game ID of the actor, e.g., so it can be looked up on external Web sites. */
  gameID?: Maybe<Scalars["Int"]>;
  /** The lowest instance ID seen during the pull. */
  minimumInstanceID?: Maybe<Scalars["Int"]>;
  /** The highest instance ID seen during the pull. */
  maximumInstanceID?: Maybe<Scalars["Int"]>;
  /** The lowest instance group ID seen during the pull. */
  minimumInstanceGroupID?: Maybe<Scalars["Int"]>;
  /** The highest instance group ID seen during the pull. */
  maximumInstanceGroupID?: Maybe<Scalars["Int"]>;
};

/** The ReportEventPaginator represents a paginated list of report events. */
export type ReportEventPaginator = {
  __typename?: "ReportEventPaginator";
  /** The list of events obtained. */
  data?: Maybe<Scalars["JSON"]>;
  /** A timestamp to pass in as the start time when fetching the next page of data. */
  nextPageTimestamp?: Maybe<Scalars["Float"]>;
};

/** The ReportFight represents a single fight that occurs in the report. */
export type ReportFight = {
  __typename?: "ReportFight";
  /** The average item level of the players in the fight. */
  averageItemLevel?: Maybe<Scalars["Float"]>;
  /** The percentage health of the active boss or bosses at the end of a fight. */
  bossPercentage?: Maybe<Scalars["Float"]>;
  /** The bounding box that encloses the positions of all players/enemies in the fight. */
  boundingBox?: Maybe<ReportMapBoundingBox>;
  /** Whether or not a fight represents an entire raid from start to finish, e.g., in Classic WoW a complete run of Blackwing Lair. */
  completeRaid: Scalars["Boolean"];
  /** The difficulty setting for the raid, dungeon, or arena. Null for trash. */
  difficulty?: Maybe<Scalars["Int"]>;
  /** For a dungeon, a list of pulls that occurred in the dungeon. Pulls have details such as the enemies involved in the pull and map info showing where the pull took place. */
  dungeonPulls?: Maybe<Maybe<ReportDungeonPull>[]>;
  /** The encounter ID of the fight. If the ID is 0, the fight is considered a trash fight. */
  encounterID: Scalars["Int"];
  /** The end time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  endTime: Scalars["Float"];
  /** Information about enemy NPCs involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  enemyNPCs?: Maybe<Maybe<ReportFightNpc>[]>;
  /** The IDs of all players involved in a fight. These players can be referenced in the master data actors table to get detailed information about each participant. */
  enemyPlayers?: Maybe<Maybe<Scalars["Int"]>[]>;
  /** The actual completion percentage of the fight. This is the field used to indicate how far into a fight a wipe was, since fights can be complicated and have multiple bosses, no bosses, bosses that heal, etc. */
  fightPercentage?: Maybe<Scalars["Float"]>;
  /** Information about friendly NPCs involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  friendlyNPCs?: Maybe<Maybe<ReportFightNpc>[]>;
  /** The IDs of all players involved in a fight. These players can be referenced in the master data actors table to get detailed information about each participant. */
  friendlyPlayers?: Maybe<Maybe<Scalars["Int"]>[]>;
  /** The game zone the fight takes place in. This should not be confused with the zones used by the sites for rankings. This is the actual in-game zone info. */
  gameZone?: Maybe<GameZone>;
  /** The report ID of the fight. This ID can be used to fetch only events, tables or graphs for this fight. */
  id: Scalars["Int"];
  /** The affixes for a Mythic+ dungeon. */
  keystoneAffixes?: Maybe<Maybe<Scalars["Int"]>[]>;
  /** The bonus field represents Bronze, Silver or Gold in Challenge Modes, or +1-+3 pushing of Mythic+ keys. It has the values 1, 2, and 3. */
  keystoneBonus?: Maybe<Scalars["Int"]>;
  /** The keystone level for a Mythic+ dungeon. */
  keystoneLevel?: Maybe<Scalars["Int"]>;
  /** The completion time for a Challenge Mode or Mythic+ Dungeon. This is the official time used on Blizzard leaderboards. */
  keystoneTime?: Maybe<Scalars["Int"]>;
  /** Whether or not the fight was a boss kill, i.e., successful. If this field is false, it means the fight was an incomplete run, etc.. */
  kill?: Maybe<Scalars["Boolean"]>;
  /** The phase that the encounter was in when the fight ended. */
  lastPhase?: Maybe<Scalars["Int"]>;
  /** Whether or not the phase that the encounter was in when the fight ended was an intermission or not. */
  lastPhaseIsIntermission?: Maybe<Scalars["Boolean"]>;
  /** The layer of a Torghast run. */
  layer?: Maybe<Scalars["Int"]>;
  /** All the maps that were involved in a fight. For single bosses this will usually be a single map, but for dungeons it will typically be multiple maps. */
  maps?: Maybe<Maybe<ReportMap>[]>;
  /** The name of the fight. */
  name: Scalars["String"];
  /** The official Blizzard rating for a completed Mythic+ dungeon or Torghast run. */
  rating?: Maybe<Scalars["Int"]>;
  /** The group size for the raid, dungeon, or arena. Null for trash. */
  size?: Maybe<Scalars["Int"]>;
  /** The start time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  startTime: Scalars["Float"];
  /** If a wipe was explicitly called using the Companion app, then this field will contain the time. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  wipeCalledTime?: Maybe<Scalars["Float"]>;
};

/** The ReportFightNPC represents participation info within a single fight for an NPC. */
export type ReportFightNpc = {
  __typename?: "ReportFightNPC";
  /** The game ID of the actor. This ID is used in events to identify sources and targets. */
  gameID?: Maybe<Scalars["Int"]>;
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id?: Maybe<Scalars["Int"]>;
  /** How many instances of the NPC were seen during the fight. */
  instanceCount?: Maybe<Scalars["Int"]>;
  /** How many packs of the NPC were seen during the fight. */
  groupCount?: Maybe<Scalars["Int"]>;
};

/** The ReportMap represents a single map that a fight can occur on. */
export type ReportMap = {
  __typename?: "ReportMap";
  /** The map's game ID. */
  id: Scalars["Int"];
};

/** The ReportMapBoundingBox is a box that encloses the positions of all players and enemies in a fight or dungeon pull. */
export type ReportMapBoundingBox = {
  __typename?: "ReportMapBoundingBox";
  /** The smallest X position. */
  minX: Scalars["Int"];
  /** The largest X position. */
  maxX: Scalars["Int"];
  /** The smallest Y position. */
  minY: Scalars["Int"];
  /** The largest Y position. */
  maxY: Scalars["Int"];
};

/** The ReporMastertData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export type ReportMasterData = {
  __typename?: "ReportMasterData";
  /** The version of the client parser that was used to parse and upload this log file. */
  logVersion: Scalars["Int"];
  /** The version of the game that generated the log file. Used to distinguish Classic and Retail Warcraft primarily. */
  gameVersion?: Maybe<Scalars["Int"]>;
  /** The auto-detected locale of the report. This is the source language of the original log file. */
  lang?: Maybe<Scalars["String"]>;
  /** A list of every ability that occurs in the report. */
  abilities?: Maybe<Maybe<ReportAbility>[]>;
  /** A list of every actor (player, NPC, pet) that occurs in the report. */
  actors?: Maybe<Maybe<ReportActor>[]>;
};

/** The ReporMastertData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export type ReportMasterDataActorsArgs = {
  type?: Maybe<Scalars["String"]>;
  subType?: Maybe<Scalars["String"]>;
};

export type ReportPagination = {
  __typename?: "ReportPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<Report>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
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
  __typename?: "Server";
  /** The ID of the server. */
  id: Scalars["Int"];
  /** The name of the server in the locale of the subregion that the server belongs to. */
  name: Scalars["String"];
  /** The normalized name is a transformation of the name, dropping spaces. It is how the server appears in a World of Warcraft log file. */
  normalizedName: Scalars["String"];
  /** The server slug, also a transformation of the name following Blizzard rules. For retail World of Warcraft realms, this slug will be in English. For all other games, the slug is just a transformation of the name field. */
  slug: Scalars["String"];
  /** The region that this server belongs to. */
  region: Region;
  /** The subregion that this server belongs to. */
  subregion: Subregion;
  /** The guilds found on this server (and any servers connected to this one. */
  guilds?: Maybe<GuildPagination>;
};

/** A single server. Servers correspond to actual game servers that characters and guilds reside on. */
export type ServerGuildsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type ServerPagination = {
  __typename?: "ServerPagination";
  /** List of items on the current page */
  data?: Maybe<Maybe<Server>[]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"];
  /** Number of items returned per page */
  per_page: Scalars["Int"];
  /** Current page of the cursor */
  current_page: Scalars["Int"];
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]>;
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]>;
  /** The last page (number of pages) */
  last_page: Scalars["Int"];
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"];
};

/** A spec for a given player class. */
export type Spec = {
  __typename?: "Spec";
  /** An integer used to identify the spec. */
  id: Scalars["Int"];
  /** The player class that the spec belongs to. */
  class: GameClass;
  /** The localized name of the class. */
  name: Scalars["String"];
  /** A slug used to identify the spec. */
  slug: Scalars["String"];
};

/** A single subregion. Subregions are used to divide a region into sub-categories, such as French or German subregions of a Europe region. */
export type Subregion = {
  __typename?: "Subregion";
  /** The ID of the subregion. */
  id: Scalars["Int"];
  /** The localized name of the subregion. */
  name: Scalars["String"];
  /** The region that this subregion is found in. */
  region: Region;
  /** The servers found within this region. */
  servers?: Maybe<ServerPagination>;
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
  __typename?: "User";
  /** The ID of the user. */
  id: Scalars["Int"];
  /** The name of the user. */
  name: Scalars["String"];
  /** The battle tag of the user if they have linked it. */
  battleTag?: Maybe<Scalars["String"]>;
};

/** The user data object contains basic information about users and lets you retrieve specific users (or the current user if using the user endpoint). */
export type UserData = {
  __typename?: "UserData";
  /** Obtain a specific user by id. */
  user?: Maybe<User>;
  /** Obtain the current user (only works with user endpoint). */
  currentUser?: Maybe<User>;
};

/** The user data object contains basic information about users and lets you retrieve specific users (or the current user if using the user endpoint). */
export type UserDataUserArgs = {
  id?: Maybe<Scalars["Int"]>;
};

export type ViewModels = {
  __typename?: "ViewModels";
  googleAnalytics?: Maybe<Scalars["JSON"]>;
  game?: Maybe<Scalars["JSON"]>;
  headerTitle?: Maybe<Scalars["JSON"]>;
  articleCategories?: Maybe<Scalars["JSON"]>;
  articleSlugs?: Maybe<Scalars["JSON"]>;
  article?: Maybe<Scalars["JSON"]>;
};

export type ViewModelsArticleSlugsArgs = {
  articleCategorySlug?: Maybe<Scalars["String"]>;
  siteName?: Maybe<Scalars["String"]>;
};

export type ViewModelsArticleArgs = {
  articleSlug?: Maybe<Scalars["String"]>;
  articleCategorySlug?: Maybe<Scalars["String"]>;
  siteName?: Maybe<Scalars["String"]>;
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
  __typename?: "WorldData";
  /** Obtain a specific encounter by id. */
  encounter?: Maybe<Encounter>;
  /** A single expansion obtained by ID. */
  expansion?: Maybe<Expansion>;
  /** The set of all expansions supported by the site. */
  expansions?: Maybe<Maybe<Expansion>[]>;
  /** Obtain a specific region by its ID. */
  region?: Maybe<Region>;
  /** The set of all regions supported by the site. */
  regions?: Maybe<Maybe<Region>[]>;
  /** Obtain a specific server either by id or by slug and region. */
  server?: Maybe<Server>;
  /** Obtain a specific subregion by its ID. */
  subregion?: Maybe<Subregion>;
  /** Obtain a specific zone by its ID. */
  zone?: Maybe<Zone>;
  /** Obtain a set of all zones supported by the site. */
  zones?: Maybe<Maybe<Zone>[]>;
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
  __typename?: "Zone";
  /** The ID of the zone. */
  id: Scalars["Int"];
  /** The bracket information for this zone. This field will be null if the zone does not support brackets. */
  brackets?: Maybe<Bracket>;
  /** A list of all the difficulties supported for this zone. */
  difficulties?: Maybe<Maybe<Difficulty>[]>;
  /** The encounters found within this zone. */
  encounters?: Maybe<Maybe<Encounter>[]>;
  /** The expansion that this zone belongs to. */
  expansion: Expansion;
  /** Whether or not the entire zone (including all its partitions) is permanently frozen. When a zone is frozen, data involving that zone will never change and can be cached forever. */
  frozen: Scalars["Boolean"];
  /** The name of the zone. */
  name: Scalars["String"];
  /** A list of all the partitions supported for this zone. */
  partitions?: Maybe<Maybe<Partition>[]>;
};

export type InitialReportDataQueryVariables = Exact<{
  reportID: Scalars["String"];
}>;

export type InitialReportDataQuery = {
  __typename?: "Query";
  reportData?: Maybe<{
    __typename?: "ReportData";
    report?: Maybe<{
      __typename?: "Report";
      title: string;
      startTime: number;
      endTime: number;
      region?: Maybe<{ __typename?: "Region"; slug: string }>;
      fights?: Maybe<
        Maybe<{
          __typename?: "ReportFight";
          id: number;
          startTime: number;
          endTime: number;
          keystoneLevel?: Maybe<number>;
          keystoneAffixes?: Maybe<Maybe<number>[]>;
          keystoneBonus?: Maybe<number>;
          keystoneTime?: Maybe<number>;
          rating?: Maybe<number>;
          averageItemLevel?: Maybe<number>;
          friendlyPlayers?: Maybe<Maybe<number>[]>;
          gameZone?: Maybe<{ __typename?: "GameZone"; id: number }>;
          maps?: Maybe<Maybe<{ __typename?: "ReportMap"; id: number }>[]>;
        }>[]
      >;
    }>;
  }>;
};

export type EventDataQueryVariables = Exact<{
  reportID: Scalars["String"];
  startTime: Scalars["Float"];
  endTime: Scalars["Float"];
  limit?: Maybe<Scalars["Int"]>;
  filterExpression?: Maybe<Scalars["String"]>;
}>;

export type EventDataQuery = {
  __typename?: "Query";
  reportData?: Maybe<{
    __typename?: "ReportData";
    report?: Maybe<{
      __typename?: "Report";
      events?: Maybe<{
        __typename?: "ReportEventPaginator";
        data?: Maybe<any>;
        nextPageTimestamp?: Maybe<number>;
      }>;
    }>;
  }>;
};

export type PetActorsQueryVariables = Exact<{
  reportID: Scalars["String"];
}>;

export type PetActorsQuery = {
  __typename?: "Query";
  reportData?: Maybe<{
    __typename?: "ReportData";
    report?: Maybe<{
      __typename?: "Report";
      masterData?: Maybe<{
        __typename?: "ReportMasterData";
        actors?: Maybe<
          Maybe<{
            __typename?: "ReportActor";
            gameID?: Maybe<number>;
            petOwner?: Maybe<number>;
            id?: Maybe<number>;
          }>[]
        >;
      }>;
    }>;
  }>;
};

export type EnemyNpcIdsQueryVariables = Exact<{
  reportID: Scalars["String"];
  fightIDs: Maybe<Scalars["Int"]>[] | Maybe<Scalars["Int"]>;
}>;

export type EnemyNpcIdsQuery = {
  __typename?: "Query";
  reportData?: Maybe<{
    __typename?: "ReportData";
    report?: Maybe<{
      __typename?: "Report";
      fights?: Maybe<
        Maybe<{
          __typename?: "ReportFight";
          enemyNPCs?: Maybe<
            Maybe<{
              __typename?: "ReportFightNPC";
              id?: Maybe<number>;
              gameID?: Maybe<number>;
            }>[]
          >;
        }>[]
      >;
    }>;
  }>;
};

export type TableQueryVariables = Exact<{
  reportID: Scalars["String"];
  fightIDs: Maybe<Scalars["Int"]>[] | Maybe<Scalars["Int"]>;
  startTime: Scalars["Float"];
  endTime: Scalars["Float"];
}>;

export type TableQuery = {
  __typename?: "Query";
  reportData?: Maybe<{
    __typename?: "ReportData";
    report?: Maybe<{ __typename?: "Report"; table?: Maybe<any> }>;
  }>;
};

export type FightPullsQueryVariables = Exact<{
  reportID: Scalars["String"];
  fightIDs: Maybe<Scalars["Int"]>[] | Maybe<Scalars["Int"]>;
}>;

export type FightPullsQuery = {
  __typename?: "Query";
  reportData?: Maybe<{
    __typename?: "ReportData";
    report?: Maybe<{
      __typename?: "Report";
      fights?: Maybe<
        Maybe<{
          __typename?: "ReportFight";
          dungeonPulls?: Maybe<
            Maybe<{
              __typename?: "ReportDungeonPull";
              startTime: number;
              endTime: number;
              x: number;
              y: number;
              maps?: Maybe<Maybe<{ __typename?: "ReportMap"; id: number }>[]>;
              enemyNPCs?: Maybe<
                Maybe<{
                  __typename?: "ReportDungeonPullNPC";
                  id?: Maybe<number>;
                  gameID?: Maybe<number>;
                }>[]
              >;
            }>[]
          >;
        }>[]
      >;
    }>;
  }>;
};

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
        fights(translate: true) {
          id
          startTime
          endTime
          keystoneLevel
          keystoneAffixes
          keystoneBonus
          keystoneTime
          rating
          averageItemLevel
          friendlyPlayers
          gameZone {
            id
          }
          maps {
            id
          }
        }
      }
    }
  }
`;
export const EventDataDocument = gql`
  query EventData(
    $reportID: String!
    $startTime: Float!
    $endTime: Float!
    $limit: Int
    $filterExpression: String
  ) {
    reportData {
      report(code: $reportID) {
        events(
          startTime: $startTime
          endTime: $endTime
          limit: $limit
          filterExpression: $filterExpression
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
export const FightPullsDocument = gql`
  query FightPulls($reportID: String!, $fightIDs: [Int]!) {
    reportData {
      report(code: $reportID) {
        fights(translate: true, fightIDs: $fightIDs) {
          dungeonPulls {
            startTime
            endTime
            x
            y
            maps {
              id
            }
            enemyNPCs {
              id
              gameID
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
    FightPulls(
      variables: FightPullsQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<FightPullsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FightPullsQuery>(FightPullsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "FightPulls"
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;

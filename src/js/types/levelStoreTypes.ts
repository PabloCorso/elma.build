import { Point } from "./elmaTypes";
import { Actions, StoredByInstance, StoredLevel } from "./storeTypes";
import { TemplateBlock } from "./templateTypes";

export type StoredLevelBlock = {
  blockId: string;
  origin: Point;
};

export type LevelState = StoredLevel & {
  levelBlocks: StoredByInstance<StoredLevelBlock>;
};

export enum LevelActions {
  AddLevelBlock = "level/add_level_block",
  MoveLevelBlock = "level/mode_level_block",
}

export type LevelAction = {
  type: Actions | LevelActions;
  block?: TemplateBlock;
  origin?: Point;
  instance?: string;
};

import { LevelAction, LevelActions, Point, TemplateBlock } from "../../types";

export const addLevelBlock = (
  block: TemplateBlock,
  origin: Point
): LevelAction => ({
  type: LevelActions.AddLevelBlock,
  block,
  origin,
});

export const moveLevelBlock = (
  instance: string,
  origin: Point
): LevelAction => ({
  type: LevelActions.MoveLevelBlock,
  instance,
  origin,
});

import { Action, Actions, TemplateBlock } from "../../types";

export const addTemplateBlock = (block: TemplateBlock): Action => ({
  type: Actions.AddTemplateBlock,
  block,
});

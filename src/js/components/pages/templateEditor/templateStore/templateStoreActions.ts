import { Point, TemplateBlock, VertexBlockSelection } from "../../../../types";
import { TemplateAction, TemplateActions } from "./templateStoreTypes";

export const addConnection = (
  from: VertexBlockSelection,
  to: VertexBlockSelection
): TemplateAction => ({ type: TemplateActions.AddConnection, from, to });

export const addConnectionBlock = (
  block: TemplateBlock,
  origin: Point
): TemplateAction => ({
  type: TemplateActions.AddConnectionBlock,
  block,
  origin,
});

export const addTemplateBlock = (block: TemplateBlock): TemplateAction => ({
  type: TemplateActions.AddTemplateBlock,
  block,
});

export const setTemplateName = (name: string): TemplateAction => ({
  type: TemplateActions.SetTemplateName,
  name,
});

export const renameTemplateBlock = (
  blockId: string,
  name: string
): TemplateAction => ({
  type: TemplateActions.RenameTemplateBlock,
  blockId,
  name,
});
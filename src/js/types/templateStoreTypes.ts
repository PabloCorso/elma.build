import {
  BlockElement,
  TemplateBlock,
  VertexBlockSelection,
} from "./templateTypes";
import { Point } from "./elmaTypes";
import {
  Actions,
  StoredById,
  StoredByInstance,
  StoredLevel,
} from "./storeTypes";

export type StoredConnectedBlock = {
  connectedVertices: StoredById<string>;
};

export type StoreConnectionBlock = {
  blockId: string;
  origin: Point;
  connectedBlocks: StoredByInstance<StoredConnectedBlock>;
};

export type StoredTemplate = StoredLevel & {
  connectionBlocks: StoredByInstance<StoreConnectionBlock>;
};

export type TemplateState = StoredTemplate;

export enum TemplateActions {
  AddConnection = "template/add_connection",
  AddConnectionBlock = "template/add_connection_block",
  SetTemplateName = "template/set_name",
  RenameTemplateBlock = "template/rename_block",
}

export type TemplateAction = {
  type: TemplateActions | Actions;
  from?: VertexBlockSelection;
  to?: VertexBlockSelection;
  block?: TemplateBlock;
  origin?: Point;
  blockElements?: BlockElement[];
  name?: string;
  blockId?: string;
};

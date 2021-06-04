import Konva from "konva";
import { Point } from "./elmaTypes";
import {
  BlockElement,
  InstancedBlock,
  TemplateBlock,
  VertexBlockSelection,
} from "./templateTypes";
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
  MoveConnectionBlock = "template/move_connection_block",
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
  instance?: string;
};

export type HandleControlledBlockDrag = {
  block: InstancedBlock;
  event: Konva.KonvaEventObject<DragEvent>;
  move: (instance: string, newOrigin: Point) => void;
};

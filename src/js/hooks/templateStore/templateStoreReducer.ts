import { VertexBlockSelection } from "../../types";
import {
  StoreConnectionBlock,
  StoredBlock,
  StoredById,
  StoredByInstance,
  TemplateAction,
  TemplateActions,
  TemplateState,
} from "../../types/templateStoreTypes";

const initStoredById = function <T>(): StoredById<T> {
  return { allIds: [], byId: {} };
};

const initStoredByInstance = function <T>(): StoredByInstance<T> {
  return { allInstances: [], byInstance: {} };
};

export const initialState: TemplateState = {
  name: "",
  filename: "",
  blocks: initStoredById(),
  polygons: initStoredById(),
  vertices: initStoredById(),
  objects: initStoredById(),
  connectionBlocks: initStoredByInstance(),
};

const templateEditorReducer = (
  state: TemplateState,
  action: TemplateAction
): TemplateState => {
  switch (action.type) {
    case TemplateActions.AddTemplateBlock: {
      return addTemplateBlockReducer(state, action);
    }
    case TemplateActions.AddConnection: {
      return addConnectionReducer(state, action);
    }
    case TemplateActions.AddConnectionBlock: {
      return addConnectionBlockReducer(state, action);
    }
    case TemplateActions.SetTemplateName: {
      return { ...state, name: action.name };
    }
    case TemplateActions.RenameTemplateBlock: {
      const { blockId, name } = action;
      return {
        ...state,
        blocks: {
          ...state.blocks,
          byId: {
            ...state.blocks.byId,
            [blockId]: { ...state.blocks.byId[blockId], name },
          },
        },
      };
    }
    default: {
      return state;
    }
  }
};

const updateConnectionBlock = (
  connectionBlock: StoreConnectionBlock,
  from: VertexBlockSelection,
  to: VertexBlockSelection
) => {
  const connectedBlock =
    connectionBlock.connectedBlocks.byInstance[to.instance];
  if (connectedBlock) {
    const connectedVertex =
      connectedBlock.connectedVertices.byId[from.vertex.id];
    if (!connectedVertex) {
      connectedBlock.connectedVertices.allIds.push(from.vertex.id);
      connectedBlock.connectedVertices.byId[from.vertex.id] = to.vertex.id;
    }
  } else {
    connectionBlock.connectedBlocks.allInstances.push(to.instance);
    connectionBlock.connectedBlocks.byInstance[to.instance] = {
      connectedVertices: {
        allIds: [from.vertex.id],
        byId: { [from.vertex.id]: to.vertex.id },
      },
    };
  }
};

const addConnectionReducer = (
  state: TemplateState,
  action: TemplateAction
): TemplateState => {
  const { from, to } = action;
  const connectionBlocks = { ...state.connectionBlocks };

  const fromConnectionBlock = connectionBlocks.byInstance[from.instance];
  const toConnectionBlock = connectionBlocks.byInstance[to.instance];

  updateConnectionBlock(fromConnectionBlock, from, to);
  updateConnectionBlock(toConnectionBlock, to, from);

  return { ...state, connectionBlocks };
};

const addConnectionBlockReducer = (
  state: TemplateState,
  action: TemplateAction
): TemplateState => {
  const connectionBlocks = { ...state.connectionBlocks };
  const { block, origin } = action;
  const instance = `${block.id}_${connectionBlocks.allInstances.length}`;
  connectionBlocks.allInstances.push(instance);
  connectionBlocks.byInstance[instance] = {
    blockId: block.id,
    origin,
    connectedBlocks: { allInstances: [], byInstance: {} },
  };

  return { ...state, connectionBlocks };
};

const addTemplateBlockReducer = (
  state: TemplateState,
  action: TemplateAction
): TemplateState => {
  const { block } = action;

  const blocks = { ...state.blocks };

  const polygonsState = { ...state.polygons };
  const verticesState = { ...state.vertices };
  const polygonIds = [];
  for (const polygon of block.polygons) {
    polygonIds.push(polygon.id);
    polygonsState.allIds.push(polygon.id);
    const vertexIds = [];
    for (const vertex of polygon.vertices) {
      vertexIds.push(vertex.id);
      verticesState.allIds.push(vertex.id);
      verticesState.byId[vertex.id] = { x: vertex.x, y: vertex.y };
    }

    polygonsState.byId[polygon.id] = { grass: polygon.grass, vertexIds };
  }

  const objectsState = { ...state.objects };
  const objectIds = [];
  for (const object of block.objects) {
    objectIds.push(object.id);
    objectsState.allIds.push(object.id);
    objectsState.byId[object.id] = {
      position: object.position,
      type: object.type,
      gravity: object.gravity,
      animation: object.animation,
    };
  }

  const newBlock: StoredBlock = {
    name: block.name,
    polygonIds,
    objectIds,
  };
  blocks.allIds.push(block.id);
  blocks.byId[block.id] = newBlock;

  return { ...state, blocks };
};

export default templateEditorReducer;

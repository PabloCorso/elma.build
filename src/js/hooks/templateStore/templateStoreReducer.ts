import {
  VertexBlockSelection,
  StoreConnectionBlock,
  TemplateAction,
  TemplateActions,
  TemplateState,
  Actions,
  Action,
} from "../../types";
import { initStoredById, initStoredByInstance } from "../../utils/storeUtils";
import { addTemplateBlockReducer } from "../storeHooks";

export const initialState: TemplateState = {
  name: "",
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
    case Actions.AddTemplateBlock: {
      return {
        ...state,
        ...addTemplateBlockReducer(state, action as Action),
      };
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
      return renameTemplateBlockReducer(state, action);
    }
    case TemplateActions.MoveConnectionBlock: {
      return moveConnectionBlockReducer(state, action);
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
    connectedBlocks: initStoredByInstance(),
  };

  return { ...state, connectionBlocks };
};

const renameTemplateBlockReducer = (
  state: TemplateState,
  action: TemplateAction
) => {
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
};

const moveConnectionBlockReducer = (
  state: TemplateState,
  action: TemplateAction
) => {
  const { instance, origin } = action;
  return {
    ...state,
    connectionBlocks: {
      allInstances: state.connectionBlocks.allInstances,
      byInstance: {
        ...state.connectionBlocks.byInstance,
        [instance]: { ...state.connectionBlocks.byInstance[instance], origin },
      },
    },
  };
};

export default templateEditorReducer;

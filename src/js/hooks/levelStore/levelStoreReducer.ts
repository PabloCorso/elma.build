import {
  Action,
  Actions,
  LevelAction,
  LevelActions,
  LevelState,
} from "../../types";
import { initStoredById, initStoredByInstance } from "../../utils/storeUtils";
import { addTemplateBlockReducer } from "../storeHooks";

export const initialState: LevelState = {
  name: "",
  blocks: initStoredById(),
  polygons: initStoredById(),
  vertices: initStoredById(),
  objects: initStoredById(),
  levelBlocks: initStoredByInstance(),
};

const levelEditorReducer = (
  state: LevelState,
  action: LevelAction
): LevelState => {
  switch (action.type) {
    case Actions.AddTemplateBlock: {
      return { ...state, ...addTemplateBlockReducer(state, action as Action) };
    }
    case LevelActions.AddLevelBlock: {
      return addLevelStageBlockReducer(state, action);
    }
    case LevelActions.MoveLevelBlock: {
      return moveLevelBlockReducer(state, action);
    }
    default: {
      return state;
    }
  }
};

const addLevelStageBlockReducer = (state: LevelState, action: LevelAction) => {
  const levelBlocks = { ...state.levelBlocks };
  const { block, origin } = action;
  const instance = `${block.id}_${levelBlocks.allInstances.length}`;
  levelBlocks.allInstances.push(instance);
  levelBlocks.byInstance[instance] = {
    blockId: block.id,
    origin,
  };

  return { ...state, levelBlocks };
};

const moveLevelBlockReducer = (
  state: LevelState,
  action: LevelAction
): LevelState => {
  const { instance, origin } = action;
  return {
    ...state,
    levelBlocks: {
      allInstances: state.levelBlocks.allInstances,
      byInstance: {
        ...state.levelBlocks.byInstance,
        [instance]: { ...state.levelBlocks.byInstance[instance], origin },
      },
    },
  };
};

export default levelEditorReducer;

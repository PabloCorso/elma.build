import { InstancedBlock, LevelState } from "../../types";
import { selectTemplateBlock } from "../templateStore";

export const useLevelBlocksSelector = (state: LevelState): InstancedBlock[] => {
  return state.levelBlocks.allInstances.map((instance) => {
    const storedLevelBlock = state.levelBlocks.byInstance[instance];
    const block = selectTemplateBlock(state, storedLevelBlock.blockId);
    return { block, instance, origin: storedLevelBlock.origin };
  });
};

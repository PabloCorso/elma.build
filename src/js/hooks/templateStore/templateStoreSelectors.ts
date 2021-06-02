import { useMemo } from "react";
import {
  ConnectedBlock,
  ConnectedVertex,
  ConnectionBlock,
  TemplateBlock,
} from "../../types";
import { StoredTemplate } from "../../types/templateStoreTypes";

export const selectTemplateBlock = (
  state: StoredTemplate,
  blockId: string
): TemplateBlock => {
  const storedBlock = state.blocks.byId[blockId];
  const block: TemplateBlock = {
    id: blockId,
    name: storedBlock.name,
    polygons: storedBlock.polygonIds.map((polygonId) => {
      const storedPolygon = state.polygons.byId[polygonId];
      return {
        id: polygonId,
        grass: storedPolygon.grass,
        vertices: storedPolygon.vertexIds.map((vertexId) => {
          return { id: vertexId, ...state.vertices.byId[vertexId] };
        }),
      };
    }),
    objects: storedBlock.objectIds.map((objectId) => {
      const storedObject = state.objects.byId[objectId];
      return { id: objectId, ...storedObject };
    }),
  };

  return block;
};

export const selectTemplateBlocks = (
  state: StoredTemplate
): TemplateBlock[] => {
  return state
    ? state.blocks.allIds.map((blockId) => selectTemplateBlock(state, blockId))
    : [];
};

export const selectConnectionBlocks = (
  state: StoredTemplate
): ConnectionBlock[] => {
  return state.connectionBlocks.allInstances.map((instance) => {
    const storedConnectionBlock = state.connectionBlocks.byInstance[instance];
    const block = selectTemplateBlock(state, storedConnectionBlock.blockId);

    const connectionBlock: ConnectionBlock = {
      block,
      instance,
      origin: storedConnectionBlock.origin,
      connectedBlocks: storedConnectionBlock.connectedBlocks.allInstances.map(
        (toInstance) => {
          const storedConnectedBlock =
            storedConnectionBlock.connectedBlocks.byInstance[toInstance];
          return {
            toInstance,
            connectedVertices:
              storedConnectedBlock.connectedVertices.allIds.map(
                (fromVertexId) => {
                  const toVertexId =
                    storedConnectedBlock.connectedVertices.byId[fromVertexId];
                  return {
                    fromVertex: {
                      id: fromVertexId,
                      ...state.vertices.byId[fromVertexId],
                    },
                    toVertex: {
                      id: toVertexId,
                      ...state.vertices.byId[toVertexId],
                    },
                  } as ConnectedVertex;
                }
              ),
          } as ConnectedBlock;
        }
      ),
    };

    return connectionBlock;
  });
};

export const useConnectionBlocksSelector = (
  state: StoredTemplate
): ConnectionBlock[] =>
  useMemo(
    () => selectConnectionBlocks(state),
    [
      state.connectionBlocks,
      state.blocks,
      state.polygons,
      state.vertices,
      state.objects,
    ]
  );

export const useTemplateBlocksSelector = (
  state: StoredTemplate
): TemplateBlock[] =>
  useMemo(
    () => selectTemplateBlocks(state),
    [state.blocks, state.polygons, state.vertices, state.objects]
  );

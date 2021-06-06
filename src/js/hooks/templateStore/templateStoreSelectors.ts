import { useMemo } from "react";
import {
  ConnectedBlock,
  ConnectedVertex,
  ConnectionBlock,
  StoredLevel,
  TemplateBlock,
  Vertex,
} from "../../types";
import { ConnectionEdge, StoredTemplate } from "../../types/templateStoreTypes";

export const selectTemplateBlock = (
  state: StoredLevel,
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

export const selectTemplateBlocks = (state: StoredLevel): TemplateBlock[] => {
  return state
    ? state.blocks.allIds.map((blockId) => selectTemplateBlock(state, blockId))
    : [];
};

export const selectConnectionBlock = (
  state: StoredTemplate,
  instance: string
): ConnectionBlock => {
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
          connectedVertices: storedConnectedBlock.connectedVertices.allIds.map(
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
};

export const selectConnectionBlocks = (
  state: StoredTemplate
): ConnectionBlock[] => {
  return state
    ? state.connectionBlocks.allInstances.map((instance) =>
        selectConnectionBlock(state, instance)
      )
    : [];
};

export const selectVertex = (state: StoredLevel, vertexId: string): Vertex => {
  return state.vertices.byId[vertexId];
};

export const selectConnectionEdges = (
  state: StoredTemplate
): ConnectionEdge[] => {
  const result: ConnectionEdge[] = [];
  for (const fromInstance of state.connectionBlocks.allInstances) {
    const connectionBlock = state.connectionBlocks.byInstance[fromInstance];
    for (const toInstance of connectionBlock.connectedBlocks.allInstances) {
      const connectedBlock =
        connectionBlock.connectedBlocks.byInstance[toInstance];
      for (const fromVertexId of connectedBlock.connectedVertices.allIds) {
        const toVertexId = connectedBlock.connectedVertices.byId[fromVertexId];
        const isRedundantConnection = result.some(
          (item) =>
            item.toBlock.instance === fromInstance &&
            item.fromBlock.instance === toInstance
        );
        if (!isRedundantConnection)
          result.push({
            fromBlock: selectConnectionBlock(state, fromInstance),
            toBlock: selectConnectionBlock(state, toInstance),
            fromVertex: selectVertex(state, fromVertexId),
            toVertex: selectVertex(state, toVertexId),
          });
      }
    }
  }

  return result;
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
  state: StoredLevel
): TemplateBlock[] =>
  useMemo(
    () => selectTemplateBlocks(state),
    [state.blocks, state.polygons, state.vertices, state.objects]
  );

export const useConnectionEdgesSelector = (
  state: StoredTemplate
): ConnectionEdge[] =>
  useMemo(
    () => selectConnectionEdges(state),
    [state.blocks, state.connectionBlocks]
  );

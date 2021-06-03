import { Action, StoredBlock, StoredLevel } from "../../types";

export const addTemplateBlockReducer = (
  state: StoredLevel,
  { block }: Action
): StoredLevel => {
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

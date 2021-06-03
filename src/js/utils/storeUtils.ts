import { StoredById, StoredByInstance } from "../types";

export const initStoredById = function <T>(): StoredById<T> {
  return { allIds: [], byId: {} };
};

export const initStoredByInstance = function <T>(): StoredByInstance<T> {
  return { allInstances: [], byInstance: {} };
};

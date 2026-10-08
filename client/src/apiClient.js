// Small adapter so the pages can call `api.getX()` style functions backed by
// api/index.js (which handles the mock/live switch). No network code here.

import {
  listLoads, createLoad, deleteLoad,
  listClothing, createClothing, deleteClothing,
} from "./api/index.js";

export const api = {
  getLoads: listLoads,
  addLoad: createLoad,
  removeLoad: deleteLoad,
  getClothing: listClothing,
  addClothing: createClothing,
  removeClothing: deleteClothing,
};

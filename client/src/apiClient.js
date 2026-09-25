// Small adapter so the page components (written against a `api.getX()`
// style) can call the template's real api/index.js functions — the ones
// that already handle the mock/live switch, the device-id header, and
// error messages. Nothing here talks to the network itself.

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

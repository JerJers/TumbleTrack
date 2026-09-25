// The only file your components import from.
//
//   VITE_USE_MOCK_API=false  -> your Express API at VITE_API_BASE_URL
//   anything else, INCLUDING UNSET -> the browser-only fake

import * as mockApi from './mockApi.js'
import * as httpApi from './httpApi.js'

export const USING_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const implementation = USING_MOCK_API ? mockApi : httpApi

export const {
  listLoads,
  createLoad,
  deleteLoad,
  listClothing,
  createClothing,
  deleteClothing,
} = implementation

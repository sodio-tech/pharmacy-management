import { combineReducers } from "@reduxjs/toolkit"
import branchReducer from "./slices/branchSlice"
import authReducer from "./slices/authSlice"
import uiReducer from "./slices/uiSlice"

export const rootReducer = combineReducers({
  branch: branchReducer,
  auth: authReducer,
  ui: uiReducer,
})


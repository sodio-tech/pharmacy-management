import { combineReducers } from "@reduxjs/toolkit"
import branchReducer from "./slices/branchSlice"

export const rootReducer = combineReducers({
  branch: branchReducer,
})


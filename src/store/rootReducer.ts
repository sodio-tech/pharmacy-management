import { combineReducers } from "@reduxjs/toolkit"
import branchReducer from "./slices/branchSlice"
import authReducer from "./slices/authSlice"

export const rootReducer = combineReducers({
  branch: branchReducer,
  auth: authReducer,
})


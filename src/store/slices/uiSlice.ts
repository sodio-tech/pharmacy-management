import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  isTrialBannerHidden: boolean
  isMembershipExpired: boolean
}

const initialState: UIState = {
  isTrialBannerHidden: false,
  isMembershipExpired: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTrialBannerHidden: (state, action: PayloadAction<boolean>) => {
      state.isTrialBannerHidden = action.payload
    },
    setMembershipExpired: (state, action: PayloadAction<boolean>) => {
      state.isMembershipExpired = action.payload
    },
  },
})

export const { setTrialBannerHidden, setMembershipExpired } = uiSlice.actions

export default uiSlice.reducer


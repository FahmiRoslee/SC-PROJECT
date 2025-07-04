import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PengakapState {
  noIC : string,
}

const initialState: PengakapState = {
  noIC : "880630-01-5767",

};

const pengakapSlice = createSlice({
  name: "pengakap",
  initialState,
  reducers: {

    setNoIC: (state, action: PayloadAction<string>) => {
      state.noIC = action.payload;
    },
    
    clearPengakapState: (state) => {
      return initialState;
    },
  },
});

export const {

  setNoIC
} = pengakapSlice.actions;

export default pengakapSlice.reducer;
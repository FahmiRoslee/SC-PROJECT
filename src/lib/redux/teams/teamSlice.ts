import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Team {
    team_id: number;
    name: string;
}

const initialState: Team = {
    team_id: 0,
    name: "",
};

const teamSlice = createSlice({
    name: "teams",
    initialState,
    reducers: {

    }
});


export const {} = teamSlice.actions;

export default teamSlice.reducer;


import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 0,
}

const counterSlice = createSlice({
    name: "counter", //name of slice
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },

        decrement: (state) => {
            state.value -= 1;
        },

        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(incrementAsync.pending, () => {
                    console.log("incrementAsync.pending");
            })
            .addCase(
                incrementAsync.fulfilled, 
                (state, action: PayloadAction<number>) => {
                    state.value =+ action.payload;
                }
            );
    }
});

export const incrementAsync = createAsyncThunk(
    "conter/incrementAsync",
    async (amount: number) => {
        await new Promise ((resolve) => setTimeout(resolve, 3000));
        return amount;
    }
)

export const { increment, decrement, incrementByAmount} = counterSlice.actions;

export default counterSlice.reducer;
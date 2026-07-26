import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  count: number;
  other: number;
}

const initialState: CounterState = { count: 0, other: 0 };

// Two independent numbers, used by the Redux demo to show that a selector can
// subscribe to just one slice.
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incrementCount(state) {
      state.count += 1;
    },
    incrementOther(state) {
      state.other += 1;
    },
  },
});

export const { incrementCount, incrementOther } = counterSlice.actions;
export default counterSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  details: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectDetails: (state, action) => {
      state.details = action.payload;
    },
  },
});

export const { setProjectDetails } = projectSlice.actions;
export default projectSlice.reducer;

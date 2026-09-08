import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  treePositions: [], // Array of objects with x, y, species properties
  currentYear: 0,
  carbonMetrics: {
    biomass: 0,
    co2e: 0,
    credits: 0
  },
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setTreePositions: (state, action) => {
      state.treePositions = action.payload;
    },
    setCurrentYear: (state, action) => {
      state.currentYear = action.payload;
    },
    setCarbonMetrics: (state, action) => {
      state.carbonMetrics = action.payload;
    },
  },
});

export const { setTreePositions, setCurrentYear, setCarbonMetrics } = sceneSlice.actions;
export default sceneSlice.reducer;

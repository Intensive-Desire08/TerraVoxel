import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projectId: null,
  polygon: null, // GeoJSON feature of the drawn boundary
  isDrawing: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
    setPolygon: (state, action) => {
      state.polygon = action.payload;
    },
    setIsDrawing: (state, action) => {
      state.isDrawing = action.payload;
    },
  },
});

export const { setProjectId, setPolygon, setIsDrawing } = mapSlice.actions;
export default mapSlice.reducer;

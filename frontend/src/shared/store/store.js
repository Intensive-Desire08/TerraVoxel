import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './mapSlice';
import sceneReducer from './sceneSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    scene: sceneReducer,
  },
});

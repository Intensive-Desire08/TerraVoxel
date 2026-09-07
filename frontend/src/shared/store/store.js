import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './mapSlice';
import sceneReducer from './sceneSlice';
import projectReducer from './projectSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    scene: sceneReducer,
    project: projectReducer,
  },
});

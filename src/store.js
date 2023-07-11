import { configureStore } from '@reduxjs/toolkit';
import fileUploaderReducer from './redux/fileUploaderSlice';

export const store = configureStore({
  reducer: {
    fileUploader: fileUploaderReducer,
  },
});
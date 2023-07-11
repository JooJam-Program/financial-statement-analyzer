import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fileUploaderSlice = createSlice({
  name: 'fileUploader',
  initialState: {
    files: [],
    uploadStatus: 'idle',
    error: null
  },
  reducers: {
    addFiles: (state, action) => {
      state.files = action.payload;
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(file => file.name !== action.payload.name);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFilesAsync.pending, (state) => {
        state.uploadStatus = 'loading';
      })
      .addCase(uploadFilesAsync.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        // You can handle the response here if needed
      })
      .addCase(uploadFilesAsync.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.error.message;
      });
  }
});

export const uploadFilesAsync = createAsyncThunk(
  'fileUploader/uploadFilesAsync',
  async (files, { rejectWithValue }) => {
    try {
      const uploadPromises = files.map(async (fileObject) => {
        const formData = new FormData();
        formData.append('file', fileObject.file); // Use the original File object

        const response = await axios.post('http://localhost:8000/api/media_objects', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        return response.data;
      });

      const responses = await Promise.all(uploadPromises);
      return responses;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const { addFiles, removeFile } = fileUploaderSlice.actions;

export default fileUploaderSlice.reducer;

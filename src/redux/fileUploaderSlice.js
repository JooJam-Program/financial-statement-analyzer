import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fileUploaderSlice = createSlice({
  name: 'fileUploader',
  initialState: {
    files: [],
    uploadStatus: 'idle',
    error: null,
    generatedText: '',
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
        state.generatedText = action.payload;
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
      const batchId = new Date().getTime(); // Generate a timestamp

      const formData = new FormData();
      files.forEach((fileObject, index) => {
        formData.append(`file${index}`, fileObject.file); // Use the original File object
      });
      formData.append('batchId', batchId); // Include the batchId

      const response = await axios.post('http://localhost:8000/api/media_objects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 600000 // 10 minutes
      });

      // Extract the generated text from the responses
      const generatedText = response.data.generatedText;

      return generatedText;
    } catch (error) {
      if (error.message.includes("Idle timeout reached")) {
        return rejectWithValue("The request timed out. Please check your internet connection or try again later.");
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const { addFiles, removeFile } = fileUploaderSlice.actions;

export default fileUploaderSlice.reducer;
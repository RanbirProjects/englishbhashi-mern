import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const initialState = {
  progress: [],
  currentProgress: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all progress
export const getProgress = createAsyncThunk(
  'progress/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/progress`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get course progress
export const getCourseProgress = createAsyncThunk(
  'progress/getCourse',
  async (courseId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/progress/${courseId}`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save quiz score
export const saveQuizScore = createAsyncThunk(
  'progress/saveQuiz',
  async ({ courseId, chapterId, score, maxScore }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/progress/${courseId}/quiz/${chapterId}`,
        { score, maxScore },
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get quiz score
export const getQuizScore = createAsyncThunk(
  'progress/getQuiz',
  async ({ courseId, chapterId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${API_URL}/progress/${courseId}/quiz/${chapterId}`,
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.progress = action.payload;
      })
      .addCase(getProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCourseProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCourseProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentProgress = action.payload;
      })
      .addCase(getCourseProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveQuizScore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveQuizScore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.currentProgress) {
          state.currentProgress.quizScores = action.payload;
        }
      })
      .addCase(saveQuizScore.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getQuizScore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuizScore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getQuizScore.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = progressSlice.actions;
export default progressSlice.reducer; 
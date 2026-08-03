import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resetPasswordService from '../services/resetPasswordService';

export const resetPasswordOTP = createAsyncThunk(
  'auth/resetPasswordOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await resetPasswordService.resetPasswordOTP(email);
      if (response.code === 200) {
        return response;
      } else {
        return rejectWithValue({ code: response.code, message: response.message });
      }
    } catch (error) {
      console.log('Error in Thunk resetPasswordOTP:', error);
      return rejectWithValue({
        code: error.response?.data?.code || error.response?.status || 500,
        message: error.response?.data?.message || 'Something_went_wrong',
      });
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ otp, password }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordService.resetPassword(otp, password);
      if (response.code === 200) {
        return response;
      } else {
        return rejectWithValue({ code: response.code, message: response.message });
      }
    } catch (error) {
      console.log('Error in Thunk resetPassword:', error);
      return rejectWithValue({
        code: error.response?.data?.code || error.response?.status || 500,
        message: error.response?.data?.message || 'Something_went_wrong',
      });
    }
  },
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    loading: false,
    code: null,
    success: false,
    message: '',
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.code = null;
      state.success = false;
      state.message = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.code = null;
        state.success = false;
        state.message = 'Waiting';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.code = action.payload.code;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.code = action.payload?.code;
        state.success = false;
        state.message = action.payload?.message;
        state.error = action.payload?.message;
      })

      // resetPasswordOTP
      .addCase(resetPasswordOTP.pending, (state) => {
        state.loading = true;
        state.code = null;
        state.success = false;
        state.message = 'Waiting';
        state.error = null;
      })
      .addCase(resetPasswordOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.code = action.payload.code;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resetPasswordOTP.rejected, (state, action) => {
        state.loading = false;
        state.code = action.payload?.code;
        state.success = false;
        state.message = action.payload?.message;
        state.error = action.payload?.message;
      });
  },
});

export const { resetState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {loginUser, fetchUserByToken, loadAppData} from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = createAsyncThunk(
  'auth/login',
  async ({email, password, deviceToken}, {rejectWithValue}) => {
    try {
      const response = await loginUser(email, password, 'LOCAL', deviceToken);

      await AsyncStorage.setItem('userToken', response?.requestData?.token);
      return response;
    } catch (error) {
      return rejectWithValue(error ?? 'Something_went_wrong_try_again');
    }
  },
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('err_load_user_data');

      const response = await fetchUserByToken();

      return { 
        user: response.requestData, 
        permissions: response.requestData.permissions, 
        notifications: response.notificationData ?? [], 
        token, 
        type: response.type 
      }; 
    } catch (error) {
      return rejectWithValue(error.message ?? 'Something_went_wrong_try_again');
    }
  },
);

export const loadData = createAsyncThunk(
  'auth/loadData',
  async (_, {rejectWithValue}) => {
    try {
      const response = await loadAppData();

      return response; 
    } catch (error) {
      return rejectWithValue(error.message ?? 'Something_went_wrong_try_again');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('userToken');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    permissions: null,
    type: null,
    notifications: null,
    token: null,
    loading: false,
    error: null,
    success: false,
    appData: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // LOGIN
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const requestData = action.payload?.requestData;
        state.user = {
          ...requestData,
          image: requestData.imagePath && requestData.image ? requestData.imagePath + requestData.image : requestData.image, // Full image URL
          imagePath: requestData.imagePath && requestData.image ? requestData.imagePath + requestData.image : requestData.imagePath, // Full image URL
        };
        state.notifications = action.payload.notificationData;
        state.permissions = action.payload.permissions;
        state.type = action.payload.type;
        state.token = requestData.token;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'signin_failed';
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        const requestData = action.payload.user;
        state.user = requestData ? {
          ...requestData,
          image: requestData.imagePath && requestData.image ? requestData.imagePath + requestData.image : requestData.image,
          imagePath: requestData.imagePath && requestData.image ? requestData.imagePath + requestData.image : requestData.imagePath,
        } : null;
        state.permissions = action.payload.permissions;
        state.notifications = action.payload.notifications;
        state.type = action.payload.type;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.notifications = null;
        state.token = null;
        state.success = false;
      })

      // LOAD DATA
      .addCase(loadData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadData.fulfilled, (state, action) => {
        state.appData = action.payload;
        state.loading = false;
      })
      .addCase(loadData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'err_load_data';
      })

      // LOGOUT
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.success = false;
        state.loading = false;
        state.appData = null;
      });
  },
});

export default authSlice.reducer;

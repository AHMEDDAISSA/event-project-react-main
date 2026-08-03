import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchRegisterData, registerUser, registerExhibitor} from '../services/registerService';

export const fetchRegisterDataThunk = createAsyncThunk(
  'register/fetchData',
  async (_, {rejectWithValue}) => {
    try {
      const data = await fetchRegisterData();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'err_load_register_data');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      visitor_profile,
      name,
      last_name,
      company_name,
      company_adress,
      company_sector,
      job_title,
      job_function,
      Countrycode,
      phone,
      website,
      email,
      image,
      password,
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await registerUser(
        visitor_profile,
        name,
        last_name,
        company_name,
        company_adress,
        company_sector,
        job_title,
        job_function,
        Countrycode,
        phone,
        website,
        email,
        image,
        password,
      );
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'register_failed',
        validationError: error.validationError || {},
      });
    }
  },
);

export const registerNewExhibitor = createAsyncThunk(
  'auth/registerExhibitor',
  async (
    {
      name,
      last_name,
      organization_name,
      company_adress,
      company_sector,
      job_title,
      job_function,
      square_metres,
      comments,
      Countrycode,
      phone,
      website,
      email,
      image,
      password,
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await registerExhibitor(
        name,
        last_name,
        organization_name,
        company_adress,
        company_sector,
        job_title,
        job_function,
        square_metres,
        comments,
        Countrycode,
        phone,
        website,
        email,
        image,
        password,
      );
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'register_failed',
        validationError: error.validationError || {},
      });
    }
  },
);

const registerDataSlice = createSlice({
  name: 'registerData',
  initialState: {
    data: null,
    loading: false,
    error: null,
    registerLoading: false,
    registerError: null,
    registerSuccess: false,
    registerResponse: null,
    registerExhibitorLoading: false,
    registerExhibitorError: null,
    registerExhibitorSuccess: false,
    registerExhibitorResponse: null,
  },
  reducers: {
    resetRegisterState: state => {
      state.registerLoading = false;
      state.registerError = null;
      state.registerSuccess = false;
      state.registerResponse = null;
      state.registerExhibitorLoading = false;
      state.registerExhibitorError = null;
      state.registerExhibitorSuccess = false;
      state.registerExhibitorResponse = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch register data
      .addCase(fetchRegisterDataThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisterDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRegisterDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register user
      .addCase(register.pending, state => {
        state.registerLoading = true;
        state.registerError = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registerSuccess = true;
        state.registerResponse = action.payload;
        state.registerError = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
        state.registerSuccess = false;
      })
      
      // Register Exhibitor
      .addCase(registerNewExhibitor.pending, state => {
        state.registerExhibitorLoading = true;
        state.registerExhibitorError = null;
        state.registerExhibitorSuccess = false;
      })
      .addCase(registerNewExhibitor.fulfilled, (state, action) => {
        state.registerExhibitorLoading = false;
        state.registerExhibitorSuccess = true;
        state.registerExhibitorResponse = action.payload;
        state.registerExhibitorError = null;
      })
      .addCase(registerNewExhibitor.rejected, (state, action) => {
        state.registerExhibitorLoading = false;
        state.registerExhibitorError = action.payload;
        state.registerExhibitorSuccess = false;
      });
  },
});

export const {resetRegisterState} = registerDataSlice.actions;

export default registerDataSlice.reducer;

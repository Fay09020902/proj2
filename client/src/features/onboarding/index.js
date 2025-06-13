import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchApplicationsByStatus = createAsyncThunk(
  'onboarding/fetchApplicationsByStatus',
  async ({ status, token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/hr/hiring/applications/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await res.json();
      return { status, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApplicationByUserId = createAsyncThunk(
  'onboarding/fetchApplicationByUserId',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/hr/hiring/application/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch application');
      }
      const data = await res.json();
      return data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  applications: {
    Pending: [],
    Approved: [],
    Rejected: []
  },
  currentApplication: null
  ,
  fetched: {
    Pending: false,
    Approved: false,
    Rejected: false,
  },
  loading: false,
  error: null,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    clearApplications(state) {
      state.applications = { Pending: [], Approved: [], Rejected: [] };
      state.fetched = { Pending: false, Approved: false, Rejected: false };
      state.error = null;
      state.loading = false;
    },
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.applications[action.payload.status] = action.payload.data;
        state.fetched[action.payload.status] = true;
      })
      .addCase(fetchApplicationsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchApplicationByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentApplication = null;
      })
      .addCase(fetchApplicationByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
        state.error = null;
      })
      .addCase(fetchApplicationByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentApplication = null;
      });
  },
});

export const { clearApplications,  setCurrentApplication, clearCurrentApplication} = onboardingSlice.actions;
export const onboardingReducer = onboardingSlice.reducer

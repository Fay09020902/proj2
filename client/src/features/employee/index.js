import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeHTTPPOSTRequest } from '../../services/api';
import axios from "axios";

const initialState = {
     employees: [],
  loading: false,
  error: null,
};


const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployees(state) {
      state.employees = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEmployeeProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(getEmployeeProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/hr/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getEmployeeProfileById = createAsyncThunk(
  'employee/getEmployeeProfileById',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/hr/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const employeeReducer = employeeSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeHTTPPOSTRequest } from '../../services/api';

const initialState = {
    token: null,
    loading: false,
    currentUser: null,
    isAuthenticated: false,
    isAdmin: false,
    onboardingStatus: null,
    error: null,
    feedback: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
          console.log("reducer state ", state, action)
            state.currentUser = action.payload;
            state.isAdmin = action.payload.isAdmin;
            state.isAuthenticated = !!action.payload;
            state.onboardingStatus = action.payload.onboardingStatus
        },
        clearUser: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state.currentUser = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
          state.error = null;
        },
        setOnboardingStatus: (state, action) => {
          state.onboardingStatus = action.payload;
          if (state.currentUser) {
            state.currentUser.onboardingStatus = action.payload;
          }
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            state.loading = false;
            state.currentUser = action.payload.user;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.user.isAdmin;
            state.onboardingStatus = action.payload.user.onboardingStatus;
            state.error = null;
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(createUserAsync.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(createUserAsync.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null
          })
          .addCase(createUserAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
          })
          .addCase(updatePasswordThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updatePasswordThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = action.payload; // update user info in store
            state.error = null;
          })
          .addCase(updatePasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
          })
          .addCase(sendResetEmailThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(sendResetEmailThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = action.payload; // update user info in store
            state.error = null;
          })
          .addCase(sendResetEmailThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
          });
      },

})


export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async ({ values, token }, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPOSTRequest('register', values, token);
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, {rejectWithValue}) => {
        try {
          // console.log('Email, password',email, password);
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              });
              const data = await res.json();
              if (!res.ok) {
                return rejectWithValue(data.message)
            }
            return data;
        } catch(e){
            return rejectWithValue(e.message);
        }
    }
)

export const updatePasswordThunk = createAsyncThunk(
  'user/updatePassword',
  async({token, password}, {rejectWithValue})=>{
    try{
      const res = await fetch(`http://localhost:5000/api/users/update-password`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({ token, newPassword: password})
      });
      const data = await res.json();
      if(!res.ok){
        return rejectWithValue(data.message || 'Failed to update password');
      }
      return data;
    }catch(e){
      return rejectWithValue(e.message);
    }
  }
)

export const sendResetEmailThunk = createAsyncThunk(
  'user/sendResetEmail',
  async (email, {rejectWithValue}) => {
      try {
          const res = await fetch("http://localhost:5000/api/users/reset-password", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({email}),
            });
          if (!res.ok) {
              const data = await res.json();
              return rejectWithValue(data.message)
          }
          const data = await res.json();
          return data;
      } catch(e){
          return rejectWithValue(e.message);
      }
  }
)


export const userReducer = userSlice.reducer
export const {setCurrentUser, clearUser, clearError, setOnboardingStatus} = userSlice.actions

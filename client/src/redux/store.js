import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger'; // <-- import logger

import { userReducer } from '../features/user';
import {onboardingReducer} from '../features/onboarding'
import {employeeReducer} from '../features/employee'

const store = configureStore({
  reducer: {
    user: userReducer,
    employee: employeeReducer,
    onboarding: onboardingReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export default store;

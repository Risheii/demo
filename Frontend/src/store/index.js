import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import formReducer from './formSlice';
import managerReducer from './managerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        form: formReducer,
        manager: managerReducer,
    },
});

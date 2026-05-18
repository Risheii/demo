import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// The backend endpoints use JWT according to routes/auth.js:
// /api/auth/login/jwt
// /api/auth/logout/jwt
// /api/auth/me/jwt

// Let's set up the thunks
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
    try {
        const response = await axios.post('/api/auth/login/jwt', credentials);
        // Save token to localStorage
        localStorage.setItem('token', response.data.data.token);
        return response.data.data; // should contain user info and token
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
        await axios.post('/api/auth/logout/jwt', {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        localStorage.removeItem('token');
        return true;
    } catch (error) {
        // even if api fails, remove local token
        localStorage.removeItem('token');
        return thunkAPI.rejectWithValue(error.response?.data || 'Logout failed');
    }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const response = await axios.get('/api/auth/me/jwt', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        localStorage.removeItem('token');
        return thunkAPI.rejectWithValue(error.response?.data || 'Get me failed');
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put('/api/auth/edit-profile', profileData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || 'Update profile failed');
    }
});

export const uploadProfileImage = createAsyncThunk('auth/uploadProfileImage', async (formData, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/auth/upload-profile-image', formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || 'Upload image failed');
    }
});

const token = localStorage.getItem('token');
let user = null;
if (token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        user = JSON.parse(atob(base64));
    } catch (e) {
        console.error("Failed to decode token", e);
    }
}

const initialState = {
    user: user,
    token: token,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Login failed';
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // action.payload is req.user
            })
            .addCase(getMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(uploadProfileImage.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    }
});

export default authSlice.reducer;

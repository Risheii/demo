import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchManagers = createAsyncThunk('manager/fetchManagers', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/get-all-manager', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch managers');
    }
});

export const createManager = createAsyncThunk('manager/createManager', async (formData, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/admin/create-manager', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create manager');
    }
});

export const updateManager = createAsyncThunk('manager/updateManager', async (data, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put('/api/admin/update-manager', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update manager');
    }
});

export const deleteManager = createAsyncThunk('manager/deleteManager', async (id, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/delete-manager/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete manager');
    }
});

const initialState = {
    managers: [],
    loading: false,
    submitting: false,
    error: null,
};

const managerSlice = createSlice({
    name: 'manager',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Managers
            .addCase(fetchManagers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagers.fulfilled, (state, action) => {
                state.loading = false;
                state.managers = action.payload;
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Manager
            .addCase(createManager.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(createManager.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(createManager.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Update Manager
            .addCase(updateManager.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(updateManager.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(updateManager.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Delete Manager
            .addCase(deleteManager.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteManager.fulfilled, (state, action) => {
                state.managers = state.managers.filter(m => m.id !== action.payload);
            })
            .addCase(deleteManager.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { clearError } = managerSlice.actions;
export default managerSlice.reducer;

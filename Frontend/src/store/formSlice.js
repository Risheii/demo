import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeaders = () => {
    return {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
};

export const fetchSubmissions = createAsyncThunk('form/fetchSubmissions', async (_, thunkAPI) => {
    try {
        const response = await axios.get('/api/forms', getAuthHeaders());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});

export const fetchSubmissionById = createAsyncThunk('form/fetchSubmissionById', async (id, thunkAPI) => {
    try {
        const response = await axios.get(`/api/forms/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});

export const createSubmission = createAsyncThunk('form/createSubmission', async (formData, thunkAPI) => {
    try {
        const response = await axios.post('/api/forms', formData, getAuthHeaders());
        return response.data.submission;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});

export const updateSubmission = createAsyncThunk('form/updateSubmission', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`/api/forms/${id}`, data, getAuthHeaders());
        return response.data.submission;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});

export const deleteSubmission = createAsyncThunk('form/deleteSubmission', async (id, thunkAPI) => {
    try {
        await axios.delete(`/api/forms/${id}`, getAuthHeaders());
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});

const formSlice = createSlice({
    name: 'form',
    initialState: {
        submissions: [],
        currentSubmission: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentSubmission: (state) => {
            state.currentSubmission = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchSubmissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload;
            })
            .addCase(fetchSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to fetch forms';
            })
            // Fetch By ID
            .addCase(fetchSubmissionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubmissionById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSubmission = action.payload;
            })
            .addCase(fetchSubmissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to fetch form by ID';
            })
            // Create
            .addCase(createSubmission.fulfilled, (state, action) => {
                state.submissions.push(action.payload);
            })
            // Update
            .addCase(updateSubmission.fulfilled, (state, action) => {
                const index = state.submissions.findIndex(sub => sub.id === action.payload.id);
                if (index !== -1) {
                    state.submissions[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteSubmission.fulfilled, (state, action) => {
                state.submissions = state.submissions.filter(sub => sub.id !== action.payload);
            });
    }
});

export const { clearCurrentSubmission } = formSlice.actions;
export default formSlice.reducer;

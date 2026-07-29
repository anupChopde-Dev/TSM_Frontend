import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axiosClient'

export const fetchProjectOptions = createAsyncThunk(
  'project/fetchOptions',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/projects/user/${userId}/options`)
      console.log('res',res)
      return res.data.projects
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects')
    }
  }
)

export const fetchProjectTasks = createAsyncThunk(
  'project/fetchTasks',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/tasks/project/${data.projectId}/user/${data.userId}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks')
    }
  }
)

const initialState = {
  projectOptions: [],
  selectedProjectId: null,
  tasks: [],
  loading: false,
  error: null,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProjectId(state, action) {
      state.selectedProjectId = action.payload
      state.tasks = []
    },
    clearProjectSelection(state) {
      state.selectedProjectId = null
      state.tasks = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectOptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectOptions.fulfilled, (state, action) => {
        state.loading = false
        // state.projectOptions = action.payload || []
        state.projectOptions = action.payload.map((project) => ({
            value: project.id,
            label: project.projectName,
          }));
      })
      .addCase(fetchProjectOptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload || []
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSelectedProjectId, clearProjectSelection } = projectSlice.actions
export default projectSlice.reducer
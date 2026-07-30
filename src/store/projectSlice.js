import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axiosClient'

export const fetchProjectOptions = createAsyncThunk(
  'project/fetchOptions',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/projects/user/${userId}/options`)
      return res.data.projects || []
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects')
    }
  }
)

export const fetchProjectTasks = createAsyncThunk(
  'project/fetchTasks',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const userId =
        getState().auth.user?.id ||
        (() => {
          try {
            return JSON.parse(localStorage.getItem('userData'))?.id
          } catch {
            return null
          }
        })()
      const res = await api.get(`/api/tasks/project/${projectId}/user/${userId}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks')
    }
  }
)
export const fetchUpdateTaskStaus = createAsyncThunk(
  'project/fetchUpdateTaskStaus',
  async (data, { rejectWithValue,dispatch  }) => {
    let payload = {
      status:data.status
    }
    try {
      const res = await api.put(`/api/tasks/taskUpdate/${data.id}`,payload)
      console.log('res.data',res.data)
      // if(res.data){
      //   dispatch(fetchProjectTasks(data.projectId))
      // }
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects')
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
    },
     setTasks: (state, action) => {
    state.tasks = action.payload;
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
        state.projectOptions = (action.payload || []).map((project) => ({
          value: project.id,
          label: project.projectName,
        }))
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
        state.tasks = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.tasks || []
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // .addCase(fetchUpdateTaskStaus.pending, (state) => {
      //   state.loading = true
      //   state.error = null
      // })
      // .addCase(fetchUpdateTaskStaus.fulfilled, (state, action) => {
      //   state.loading = false
        
      //   // Handle the response if needed
      // })
      // .addCase(fetchUpdateTaskStaus.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload
      // })
  },
})

export const { setSelectedProjectId, clearProjectSelection ,setTasks } = projectSlice.actions
export default projectSlice.reducer

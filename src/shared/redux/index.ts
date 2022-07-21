import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListRole = createAsyncThunk(
  'listRole/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/role/list'
    })
    return response?.data
  }
)

export const getPrivilege = createAsyncThunk(
  'privilege/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/admin/role/privilege'
    })
    return response?.data
  }
)

export const getPreRole = createAsyncThunk(
  'preRole/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/admin/role/preRole'
    })
    return response?.data
  }
)

export const getOperationDashboard = createAsyncThunk(
  'dashboard/operation',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/operation'
    })
    return response?.data
  }
)

export const getListTeacher = createAsyncThunk(
  'teacher/all',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/school/teacher/list'
    })
    return response?.data
  }
)

export const getListGrade = createAsyncThunk(
  'grade/all',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/school/grade/list'
    })
    return response?.data
  }
)

export const getListClass = createAsyncThunk(
  'class/all',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/school/class/list'
    })
    return response?.data
  }
)

export const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get List Role from API
      .addCase(getListRole.pending, (state) => {
        state.listRole.status = 'LOADING'
      })
      .addCase(getListRole.rejected, (state) => {
        state.listRole.status = 'FAILED'
      })
      .addCase(getListRole.fulfilled, (state, action) => {
        state.listRole.status = 'SUCCESS'
        state.listRole.data = action.payload.data
      })

      // Get List Class from API
      .addCase(getListClass.pending, (state) => {
        state.listClass.status = 'LOADING'
      })
      .addCase(getListClass.rejected, (state) => {
        state.listClass.status = 'FAILED'
      })
      .addCase(getListClass.fulfilled, (state, action) => {
        state.listClass.status = 'SUCCESS'
        state.listClass.data = action.payload.data
      })

      // Get List Grade from API
      .addCase(getListGrade.pending, (state) => {
        state.listGrade.status = 'LOADING'
      })
      .addCase(getListGrade.rejected, (state) => {
        state.listGrade.status = 'FAILED'
      })
      .addCase(getListGrade.fulfilled, (state, action) => {
        state.listGrade.status = 'SUCCESS'
        state.listGrade.data = action.payload.data
      })

      // Get List Teacher from API
      .addCase(getListTeacher.pending, (state) => {
        state.listTeacher.status = 'LOADING'
      })
      .addCase(getListTeacher.rejected, (state) => {
        state.listTeacher.status = 'FAILED'
      })
      .addCase(getListTeacher.fulfilled, (state, action) => {
        state.listTeacher.status = 'SUCCESS'
        state.listTeacher.data = action.payload.data
      })

      // Get Privilege from API
      .addCase(getPrivilege.pending, (state) => {
        state.privilege.status = 'LOADING'
      })
      .addCase(getPrivilege.rejected, (state) => {
        state.privilege.status = 'FAILED'
      })
      .addCase(getPrivilege.fulfilled, (state, action) => {
        state.privilege.status = 'SUCCESS'
        state.privilege.data = action.payload.data
      })
      
      // Get Pre Role from API
      .addCase(getPreRole.pending, (state) => {
        state.preRole.status = 'LOADING'
      })
      .addCase(getPreRole.rejected, (state) => {
        state.preRole.status = 'FAILED'
      })
      .addCase(getPreRole.fulfilled, (state, action) => {
        state.preRole.status = 'SUCCESS'
        state.preRole.data = action.payload.data
      })

      // Get Pre Role from API
      .addCase(getOperationDashboard.pending, (state) => {
        state.operationDashboard.status = 'LOADING'
      })
      .addCase(getOperationDashboard.rejected, (state) => {
        state.operationDashboard.status = 'FAILED'
      })
      .addCase(getOperationDashboard.fulfilled, (state, action) => {
        state.operationDashboard.status = 'SUCCESS'
        state.operationDashboard.data = action.payload.data
      })
  },
})

export const selectListRole = (state: RootState) => state.shared.listRole
export const selectListClass = (state: RootState) => state.shared.listClass
export const selectListGrade = (state: RootState) => state.shared.listGrade
export const selectListTeacher = (state: RootState) => state.shared.listTeacher
export const selectPrivilege = (state: RootState) => state.shared.privilege
export const selectPreRole = (state: RootState) => state.shared.preRole
export const selectOperationDashboard = (state: RootState) => state.shared.operationDashboard

export default sharedSlice.reducer

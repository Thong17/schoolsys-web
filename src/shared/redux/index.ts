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

export const getAdminDashboard = createAsyncThunk(
  'dashboard/admin',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/admin'
    })
    return response?.data
  }
)

export const getSchoolDashboard = createAsyncThunk(
  'dashboard/school',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/school'
    })
    return response?.data
  }
)

export const getReportSchoolDashboard = createAsyncThunk(
  'dashboard/reportSchool',
  async (query?: URLSearchParams) => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/report/school',
      params: query
    })
    return response?.data
  }
)

export const getReportAttendanceDashboard = createAsyncThunk(
  'dashboard/reportAttendance',
  async (query?: URLSearchParams) => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/report/attendance',
      params: query
    })
    return response?.data
  }
)

export const getReportAcademyDashboard = createAsyncThunk(
  'dashboard/reportAcademy',
  async (query?: URLSearchParams) => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/report/academy',
      params: query
    })
    return response?.data
  }
)

export const getListTeacher = createAsyncThunk(
  'teacher/all',
  async (query?: URLSearchParams) => {
    const response = await Axios({
      method: 'GET',
      url: '/school/teacher/list',
      params: query
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

      // Get Operation Dashboard from API
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

      // Get Admin Dashboard from API
      .addCase(getAdminDashboard.pending, (state) => {
        state.adminDashboard.status = 'LOADING'
      })
      .addCase(getAdminDashboard.rejected, (state) => {
        state.adminDashboard.status = 'FAILED'
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.adminDashboard.status = 'SUCCESS'
        state.adminDashboard.data = action.payload.data
      })

      // Get School Dashboard from API
      .addCase(getSchoolDashboard.pending, (state) => {
        state.schoolDashboard.status = 'LOADING'
      })
      .addCase(getSchoolDashboard.rejected, (state) => {
        state.schoolDashboard.status = 'FAILED'
      })
      .addCase(getSchoolDashboard.fulfilled, (state, action) => {
        state.schoolDashboard.status = 'SUCCESS'
        state.schoolDashboard.data = action.payload.data
      })

      // Get Report School Dashboard from API
      .addCase(getReportSchoolDashboard.pending, (state) => {
        state.reportSchoolDashboard.status = 'LOADING'
      })
      .addCase(getReportSchoolDashboard.rejected, (state) => {
        state.reportSchoolDashboard.status = 'FAILED'
      })
      .addCase(getReportSchoolDashboard.fulfilled, (state, action) => {
        state.reportSchoolDashboard.status = 'SUCCESS'
        state.reportSchoolDashboard.data = action.payload.data
      })

      // Get Report Attendance Dashboard from API
      .addCase(getReportAttendanceDashboard.pending, (state) => {
        state.reportAttendanceDashboard.status = 'LOADING'
      })
      .addCase(getReportAttendanceDashboard.rejected, (state) => {
        state.reportAttendanceDashboard.status = 'FAILED'
      })
      .addCase(getReportAttendanceDashboard.fulfilled, (state, action) => {
        state.reportAttendanceDashboard.status = 'SUCCESS'
        state.reportAttendanceDashboard.data = action.payload.data
        state.reportAttendanceDashboard.count = action.payload.length
      })

      // Get Report Academy Dashboard from API
      .addCase(getReportAcademyDashboard.pending, (state) => {
        state.reportAcademyDashboard.status = 'LOADING'
      })
      .addCase(getReportAcademyDashboard.rejected, (state) => {
        state.reportAcademyDashboard.status = 'FAILED'
      })
      .addCase(getReportAcademyDashboard.fulfilled, (state, action) => {
        state.reportAcademyDashboard.status = 'SUCCESS'
        state.reportAcademyDashboard.data = action.payload.data
        state.reportAcademyDashboard.count = action.payload.length
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
export const selectAdminDashboard = (state: RootState) => state.shared.adminDashboard
export const selectSchoolDashboard = (state: RootState) => state.shared.schoolDashboard
export const selectReportSchoolDashboard = (state: RootState) => state.shared.reportSchoolDashboard
export const selectReportAttendanceDashboard = (state: RootState) => state.shared.reportAttendanceDashboard
export const selectReportAcademyDashboard = (state: RootState) => state.shared.reportAcademyDashboard

export default sharedSlice.reducer

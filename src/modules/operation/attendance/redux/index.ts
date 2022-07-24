import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListAttendance = createAsyncThunk(
  'attendance/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/operation/attendance',
      params: query
    })
    return response?.data
  }
)

export const checkInAttendance = createAsyncThunk(
  'attendance/checkIn',
  async (body: Object) => {
    const response = await Axios({
      method: 'POST',
      url: '/operation/attendance/checkIn',
      body: body
    })
    return response?.data
  }
)

export const checkOutAttendance = createAsyncThunk(
  'attendance/checkOut',
  async (id: string) => {
    const response = await Axios({
      method: 'PUT',
      url: `/operation/attendance/checkOut/${id}`
    })
    return response?.data
  }
)

export const resetAttendance = createAsyncThunk(
  'attendance/reset',
  async (id: string) => {
    const response = await Axios({
      method: 'PUT',
      url: `/operation/attendance/reset/${id}`
    })
    return response?.data
  }
)

export const permissionAttendance = createAsyncThunk(
  'attendance/permission',
  async (body: Object) => {
    const response = await Axios({
      method: 'POST',
      url: `/operation/attendance/permission`,
      body
    })
    return response?.data
  }
)

export const getUserAttendance = createAsyncThunk(
  'attendance/detail',
  async ({ userId, query }: { userId: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/operation/attendance/detail/${userId}`,
      params: query
    })
    
    return response?.data
  }
)

export const roleSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Attendance
      .addCase(getListAttendance.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListAttendance.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListAttendance.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // Detail Attendance
      .addCase(getUserAttendance.pending, (state) => {
        state.userAttendance.status = 'LOADING'
      })
      .addCase(getUserAttendance.rejected, (state) => {
        state.userAttendance.status = 'FAILED'
      })
      .addCase(getUserAttendance.fulfilled, (state, action) => {
        state.userAttendance.status = 'SUCCESS'
        state.userAttendance.data = action.payload.data
      })
      
      // Check In Attendance
      .addCase(checkInAttendance.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(checkInAttendance.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(checkInAttendance.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = [...state.list.data, action.payload.data]
      })
      
      // Check Out Attendance
      .addCase(checkOutAttendance.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(checkOutAttendance.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(checkOutAttendance.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = state.list.data.map((data: any) => data._id === action.payload.data?._id ? action.payload.data : data)
      })

      // Reset Attendance
      .addCase(resetAttendance.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(resetAttendance.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(resetAttendance.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = state.list.data.filter((data: any) => data._id !== action.payload.data?._id)
      })

      // Permission Attendance
      .addCase(permissionAttendance.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(permissionAttendance.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(permissionAttendance.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = [...state.list.data, action.payload.data]
      })
  },
})

export const selectUserAttendance = (state: RootState) => state.attendance.userAttendance
export const selectListAttendance = (state: RootState) => state.attendance.list

export default roleSlice.reducer

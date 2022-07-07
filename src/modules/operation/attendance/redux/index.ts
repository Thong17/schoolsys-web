import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListAttendance = createAsyncThunk(
  'attendance/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/school/attendance',
      params: query
    })
    return response?.data
  }
)

export const getAttendance = createAsyncThunk(
  'attendance/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/attendance/detail/${id}`
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
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
      .addCase(getAttendance.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getAttendance.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectAttendance = (state: RootState) => state.attendance.detail
export const selectListAttendance = (state: RootState) => state.attendance.list

export default roleSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListStudent = createAsyncThunk(
  'student/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/school/student',
      params: query
    })
    return response?.data
  }
)

export const getListAcademy = createAsyncThunk(
  'student/academy',
  async ({ id, query }: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/student/academy/${id}`,
      params: query
    })
    return response?.data
  }
)

export const getStudent = createAsyncThunk(
  'student/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields?: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/student/detail/${id}`
    })
    let data = {}
    fields 
      ? fields.forEach((field) => {
        data[field] = response?.data?.data?.[field]
      }) 
      : data = response?.data?.data
    
    return { ...response?.data, data }
  }
)

export const roleSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Student
      .addCase(getListStudent.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListStudent.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListStudent.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // List Academy
      .addCase(getListAcademy.pending, (state) => {
        state.academy.status = 'LOADING'
      })
      .addCase(getListAcademy.rejected, (state) => {
        state.academy.status = 'FAILED'
      })
      .addCase(getListAcademy.fulfilled, (state, action) => {
        state.academy.status = 'SUCCESS'
        state.academy.data = action.payload.data
      })

      // Detail Student
      .addCase(getStudent.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getStudent.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getStudent.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectStudent = (state: RootState) => state.student.detail
export const selectListStudent = (state: RootState) => state.student.list
export const selectListAcademy = (state: RootState) => state.student.academy

export default roleSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListTeacher = createAsyncThunk(
  'teacher/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/school/teacher',
      params: query
    })
    return response?.data
  }
)

export const getTeacher = createAsyncThunk(
  'teacher/detail',
  async ({id, query, fields}: { id: string, query: Object, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/teacher/detail/${id}`
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const roleSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Teacher
      .addCase(getListTeacher.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListTeacher.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListTeacher.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // Detail Teacher
      .addCase(getTeacher.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getTeacher.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getTeacher.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectTeacher = (state: RootState) => state.teacher.detail
export const selectListTeacher = (state: RootState) => state.teacher.list

export default roleSlice.reducer

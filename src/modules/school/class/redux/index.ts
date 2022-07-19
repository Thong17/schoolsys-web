import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListClass = createAsyncThunk(
  'class/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/school/class',
      params: query
    })
    return response?.data
  }
)

export const getListSubjectOfClass = createAsyncThunk(
  'class/subject',
  async ({ id, query }: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/class/${id}/subject`,
      params: query
    })
    return response?.data
  }
)

export const getListStudentOfClass = createAsyncThunk(
  'class/student',
  async ({ id, query }: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/class/${id}/student`,
      params: query
    })
    return response?.data
  }
)

export const getClass = createAsyncThunk(
  'class/detail',
  async ({id, query, fields}: { id: string, query: Object, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/class/detail/${id}`
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    removeStudent(state, action) {
      state.detail.data.students = state.detail.data?.students?.filter((data: any) => data._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // List Class
      .addCase(getListClass.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListClass.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListClass.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // List Subject Of Class
      .addCase(getListSubjectOfClass.pending, (state) => {
        state.subject.status = 'LOADING'
      })
      .addCase(getListSubjectOfClass.rejected, (state) => {
        state.subject.status = 'FAILED'
      })
      .addCase(getListSubjectOfClass.fulfilled, (state, action) => {
        state.subject.status = 'SUCCESS'
        state.subject.data = action.payload.data
      })

      // List Student Of Class
      .addCase(getListStudentOfClass.pending, (state) => {
        state.student.status = 'LOADING'
      })
      .addCase(getListStudentOfClass.rejected, (state) => {
        state.student.status = 'FAILED'
      })
      .addCase(getListStudentOfClass.fulfilled, (state, action) => {
        state.student.status = 'SUCCESS'
        state.student.data = action.payload.data
      })

      // Detail Class
      .addCase(getClass.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getClass.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getClass.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectClass = (state: RootState) => state.class.detail
export const selectListClass = (state: RootState) => state.class.list
export const selectListSubjectOfClass = (state: RootState) => state.class.subject
export const selectListStudentOfClass = (state: RootState) => state.class.student
export const { removeStudent } = classSlice.actions

export default classSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListGrade = createAsyncThunk(
  'grade/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/school/grade',
      params: query
    })
    return response?.data
  }
)

export const getGrade = createAsyncThunk(
  'grade/detail',
  async ({id, query, fields}: { id: string, query?: Object, fields?: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/school/grade/detail/${id}`
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

export const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Grade
      .addCase(getListGrade.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListGrade.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListGrade.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail Grade
      .addCase(getGrade.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getGrade.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getGrade.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectGrade = (state: RootState) => state.grade.detail
export const selectListGrade = (state: RootState) => state.grade.list

export default gradeSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListClass = createAsyncThunk(
  'class/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/operation/class',
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
      url: `/operation/class/detail/${id}`
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
export const { removeStudent } = classSlice.actions

export default classSlice.reducer

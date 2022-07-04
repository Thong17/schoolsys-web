import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../modules/counter/counterSlice'
import roleReducer from 'modules/admin/role/redux'
import userReducer from 'modules/admin/user/redux'
import studentReducer from 'modules/school/student/redux'
import teacherReducer from 'modules/school/teacher/redux'
import sharedReducer from 'shared/redux'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    role: roleReducer,
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    shared: sharedReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

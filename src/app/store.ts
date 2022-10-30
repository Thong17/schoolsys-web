import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import roleReducer from 'modules/admin/role/redux'
import userReducer from 'modules/admin/user/redux'
import studentReducer from 'modules/school/student/redux'
import teacherReducer from 'modules/school/teacher/redux'
import gradeReducer from 'modules/school/grade/redux'
import classReducer from 'modules/school/class/redux'
import attendanceReducer from 'modules/operation/attendance/redux'
import sharedReducer from 'shared/redux'

export const store = configureStore({
  reducer: {
    role: roleReducer,
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    grade: gradeReducer,
    class: classReducer,
    attendance: attendanceReducer,
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

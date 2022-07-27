import { IBody } from 'shared/interface'

export interface AttendanceState {
  list: IBody<Object[]>
  userAttendance: IBody<any>
}

export const initialState: AttendanceState = {
  list: {
    data: [],
    status: 'INIT',
  },
  userAttendance: {
    data: {},
    status: 'INIT',
  },
}
